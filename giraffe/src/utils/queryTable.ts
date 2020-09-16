import {
  ParameterizedQuery,
  QueryApi,
  FluxTableMetaData,
  ColumnType as ClientColumnType,
  Cancellable,
  FluxResultObserver,
} from '@influxdata/influxdb-client'
import {Table, ColumnType, ColumnData} from '../types'
import {newTable} from './newTable'

/**
 * Stores data and metadata of a result column.
 */
interface ColumnStore {
  /** column name */
  name: string
  /** column type */
  type: ColumnType
  /** column data */
  data: ColumnData
  /** converts string to column value */
  toValue: (row: string[]) => number | string | boolean | null
  /** marker to indicate that this column can have multiple keys  */
  multipleTypes?: true
  /** it this column part of the group key */
  group?: boolean
}

function toTableColumns(
  columns: Record<string, ColumnStore>,
  tableLength: number
): Record<string, ColumnStore> {
  return Object.keys(columns).reduce((acc, val) => {
    const col = columns[val]
    if (!col.multipleTypes) {
      acc[val] = col
      ;(col.data as any).length = tableLength // extend the array length, required (and tested)
    }
    return acc
  }, {} as Record<string, ColumnStore>)
}

/**
 * AcceptRowFunction allows to accept/reject specific rows or terminate processing.
 * @param row CSV data row
 * @param tableMeta CSV table metadata including column definition
 * @return true to accept row, false to skip row, undefined means stop processing
 **/
export type AcceptRowFunction = (
  row: string[],
  tableMeta: FluxTableMetaData
) => true | false | undefined

/**
 * Contains parameters that optimize/drive creation of the query result Table.
 */
export interface TableOptions {
  /**
   * Accept allows to accept/reject specific rows or terminate processing.
   **/
  accept?: AcceptRowFunction | AcceptRowFunction[]
  /**
   * Sets maximum table length, QUERY_MAX_TABLE_LENGTH when undefined.
   */
  maxTableLength?: number

  /** column keys to collect in the table, undefined means all columns */
  columns?: string[]
}

/**
 * DEFAULT_TABLE_OPTIONS allows to setup default maxTableLength.
 */
export const DEFAULT_TABLE_OPTIONS: Pick<TableOptions, 'maxTableLength'> = {
  maxTableLength: 100_000,
}

/**
 * Create an accept function that stops processing
 * if the table reaches the specified max rows.
 * @param size maximum processed rows
 */
export function acceptMaxTableLength(max: number): AcceptRowFunction {
  let size = 0
  return () => {
    if (size >= max) {
      // eslint-disable-next-line no-console
      console.log(
        `queryTable: max table length ${max} reached, processing stopped`
      )
      return undefined
    }
    size++
    return true
  }
}

/**
 * Creates one accept function for the TableOptions supplied.
 * @param options table options
 * @returns accept function
 */
function createAcceptRowFunction(options: TableOptions): AcceptRowFunction {
  const maxTableLength =
    options.maxTableLength === undefined
      ? DEFAULT_TABLE_OPTIONS.maxTableLength
      : options.maxTableLength
  const acceptors: AcceptRowFunction[] = []
  if (options.accept) {
    if (Array.isArray(options.accept)) {
      acceptors.push(...options.accept)
    } else {
      acceptors.push(options.accept)
    }
  }
  if (maxTableLength !== undefined) {
    acceptors.push(acceptMaxTableLength(maxTableLength))
  }

  return (row: string[], tableMeta: FluxTableMetaData) => {
    for (let i = 0; i < acceptors.length; i++) {
      const retVal = acceptors[i](row, tableMeta)
      if (retVal === undefined || retVal === false) {
        return retVal
      }
    }
    return true
  }
}

/**
 * Creates influxdb-client-js's FluxResultObserver that collects row results to a Table instance
 * @param resolve called when the Table is collected
 * @param reject called upon error
 * @param tableOptions tableOptions allow to filter or even stop the processing of rows, or restrict the columns to collect
 * @return FluxResultObserver that collects rows to a table instance
 */
export function createFluxResultObserver(
  resolve: (value: Table) => void,
  reject: (reason?: any) => void,
  tableOptions: TableOptions = {}
): FluxResultObserver<string[]> {
  const {columns: onlyColumns} = tableOptions
  const accept = createAcceptRowFunction(tableOptions)
  const columns: Record<string, ColumnStore> = {}
  let dataColumns: ColumnStore[]
  let lastTableMeta: FluxTableMetaData | undefined = undefined
  let tableSize = 0
  let cancellable: Cancellable
  return {
    next(row: string[], tableMeta: FluxTableMetaData) {
      switch (accept(row, tableMeta)) {
        case true:
          break
        case false:
          return
        default:
          cancellable.cancel()
          return
      }
      if (tableMeta !== lastTableMeta) {
        dataColumns = []
        for (const metaCol of tableMeta.columns) {
          const type = toGiraffeColumnType(metaCol.dataType)
          if (onlyColumns && !onlyColumns.includes(metaCol.label)) {
            continue // exclude this column
          }

          // handle the rare situation of having columns with the same name, but different type
          let columnKey = metaCol.label
          let existingColumn = columns[columnKey]
          if (existingColumn) {
            if (existingColumn.multipleTypes) {
              // multiple column types of the same name already found
              // use type-specific column key
              columnKey = `${metaCol.label} (${type})`
              existingColumn = columns[columnKey]
            } else if (existingColumn.type !== type) {
              // move the existing key to a type-specific key
              columns[
                `${existingColumn.name} (${existingColumn.type})`
              ] = existingColumn
              // occupy the column by a multiType virtual column
              columns[metaCol.label] = {
                name: metaCol.label,
                type: existingColumn.type,
                data: [],
                multipleTypes: true,
                toValue: () => '',
              }
              //
              columnKey = `${metaCol.label} (${type})`
              existingColumn = columns[columnKey]
            }
          }
          const column = {
            name: metaCol.label,
            type,
            data: existingColumn ? existingColumn.data : [],
            group: metaCol.group,
            toValue: toValueFn(metaCol.index, type, metaCol.defaultValue),
          }

          dataColumns.push(column)
          columns[columnKey] = column
        }
        lastTableMeta = tableMeta
      }
      for (let i = 0; i < dataColumns.length; i++) {
        const column = dataColumns[i]
        column.data[tableSize] = column.toValue(row) as
          | string
          | number
          | boolean // TODO wrong type definition in giraffe
      }
      tableSize++
    },
    complete() {
      resolve(newTable(tableSize, toTableColumns(columns, tableSize)))
    },
    error(e: Error) {
      if (e?.name === 'AbortError') {
        resolve(newTable(tableSize, toTableColumns(columns, tableSize)))
      }
      reject(e)
    },
    useCancellable(val: Cancellable) {
      cancellable = val
    },
  }
}

/**
 * Executes a flux query and iterrativelly collects results into a giraffe's Table depending on the TableOptions supplied.
 *
 * @param queryApi InfluxDB client's QueryApi instance
 * @param query query to execute
 * @param tableOptions tableOptions allows to filter or even stop the processing of rows, or restrict the columns to collect
 * @return Promise  with query results
 */
export function queryTable(
  queryApi: QueryApi,
  query: string | ParameterizedQuery,
  tableOptions: TableOptions = {}
): Promise<Table> {
  return new Promise<Table>((resolve, reject) => {
    queryApi.queryRows(
      query,
      createFluxResultObserver(resolve, reject, tableOptions)
    )
  })
}

/**
 * Creates a function that returns a column value from row data.
 *
 * @param rowIndex index of a string value in the row data
 * @param type column type
 * @param def default value
 * @returns column value to store in a table
 */
function toValueFn(
  rowIndex: number,
  type: ColumnType,
  def: string
): (row: string[]) => number | string | boolean | null {
  switch (type) {
    case 'boolean':
      return (row: string[]) =>
        (row[rowIndex] === '' ? def : row[rowIndex]) === 'true'
    case 'number':
      return (row: string[]) => {
        const val = row[rowIndex] === '' ? def : row[rowIndex]
        return val === '' ? null : Number(val)
      }
    case 'time':
      return (row: string[]) =>
        Date.parse(row[rowIndex] === '' ? def : row[rowIndex])
    default:
      return (row: string[]) => (row[rowIndex] === '' ? def : row[rowIndex])
  }
}

/**
 * Converts between columns types.
 *
 * @param clientType @influxdata/influxdb-client column type
 * @returns @influxdata/giraffe column type
 */
function toGiraffeColumnType(clientType: ClientColumnType): ColumnType {
  // from: 'boolean' | 'unsignedLong' | 'long' | 'double' | 'string' | 'base64Binary' | 'dateTime:RFC3339' | 'duration'
  // to:   'number' | 'string' | 'time' | 'boolean'
  switch (clientType) {
    case 'boolean':
      return 'boolean'
    case 'unsignedLong':
    case 'long':
    case 'double':
      return 'number'
    default:
      return clientType && clientType.startsWith('dateTime') ? 'time' : 'string'
  }
}
