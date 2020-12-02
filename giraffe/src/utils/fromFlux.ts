import {csvParse, csvParseRows} from 'd3-dsv'
import Papa from 'papaparse'
import {get} from './get'
import {groupBy} from './groupBy'
import {Schema, Table, ColumnType, FluxDataType} from '../types'
import {assert} from './assert'
import {newTable} from './newTable'

export interface FromFluxResult {
  schema?: Schema
  error?: Error
  // The single parsed `Table`
  table: Table

  // The union of unique group keys from all input Flux tables
  fluxGroupKeyUnion: string[]
}

type Column =
  | {
      name: string
      type: 'number'
      fluxDataType: FluxDataType
      data: Array<number | null>
    } //  parses empty numeric values as null
  | {name: string; type: 'time'; fluxDataType: FluxDataType; data: number[]}
  | {name: string; type: 'boolean'; fluxDataType: FluxDataType; data: boolean[]}
  | {name: string; type: 'string'; fluxDataType: FluxDataType; data: string[]}

interface Columns {
  [columnKey: string]: Column
}

const formatSchemaByChunk = (chunk: string, schema: Schema): void => {
  const lines = chunk.split('\n')
  const annotationLines: string = lines
    .filter(line => line.startsWith('#'))
    .join('\n')
    .trim()
  const nonAnnotationLines: string = lines
    .filter(line => !line.startsWith('#'))
    .join('\n')
    .trim()

  const nonAnnotationData = Papa.parse(nonAnnotationLines).data
  const annotationD = Papa.parse(annotationLines).data
  const headerRow = nonAnnotationData[0]
  const tableColIndex = headerRow.findIndex(h => h === 'table')
  // Group rows by their table id
  const tablesData = Object.values(
    groupBy(nonAnnotationData.slice(1), row => row[tableColIndex])
  )

  const groupRow = annotationD.find(row => row[0] === '#group')
  const defaultsRow = annotationD.find(row => row[0] === '#default')

  // groupRow = ['#group', 'false', 'true', 'true', 'false']
  const groupKeyIndices = groupRow.reduce((acc, value, i) => {
    if (value === 'true') {
      return [...acc, i]
    }

    return acc
  }, [])

  tablesData.forEach(tableData => {
    const dataRow = get(tableData, '0', defaultsRow)

    const groupKey = groupKeyIndices.reduce((acc, i) => {
      return {...acc, [headerRow[i]]: get(dataRow, i, '')}
    }, {})

    formatSchemaByGroupKey(groupKey, schema)
  })
}

/*
  Convert a [Flux CSV response][0] to a `Table`.
  For example, given a series of Flux tables that look like this:
      column_a | column_b | column_c  <-- name
      long     | string   | long      <-- type
      ------------------------------
             1 |      "g" |       34
             2 |      "f" |       58
             3 |      "c" |       21
      column_b | column_d   <-- name
      double   | boolean    <-- type
      -------------------
           1.0 |     true
           2.0 |     true
           3.0 |     true
  This function will spread them out to a single wide table that looks like
  this instead:
      column_a | column_b (string) | column_c | column_b (number) | column_d  <-- key
      column_a | column_b          | column_c | column_b          | column_d  <-- name
      number   | string            | number   | number            | bool      <-- type
      ---------------------------------------------------------------------
             1 |               "g" |       34 |                   |
             2 |               "f" |       58 |                   |
             3 |                   |       21 |                   |
               |                   |          |               1.0 |     true
               |                   |          |               2.0 |     true
               |                   |          |               3.0 |     true
  The `#group`, `#datatype`, and `#default` [annotations][1] are expected to be
  in the input Flux CSV.
  Values are coerced into appropriate JavaScript types based on the Flux
  `#datatype` annotation for the table
  The `Table` stores a `key` for each column which is seperate from the column
  `name`. If multiple Flux tables have the same column but with different
  types, they will be distinguished by different keys in the resulting `Table`;
  otherwise the `key` and `name` for each column in the result table will be
  identical.
  [0]: https://github.com/influxdata/flux/blob/master/docs/SPEC.md#csv
  [1]: https://github.com/influxdata/flux/blob/master/docs/SPEC.md#annotations
*/
export const fromFlux = (fluxCSV: string): FromFluxResult => {
  const columns: Columns = {}
  const fluxGroupKeyUnion = new Set<string>()
  let tableLength = 0

  try {
    const chunks = splitChunks(fluxCSV)

    // declaring all nested variables here to reduce memory drain
    let tableText = ''
    let tableData: any = []
    let annotationText = ''
    let columnType: any = ''
    let columnKey = ''
    let columnDefault: any = ''

    for (const chunk of chunks) {
      tableText = chunk
        .split('\n')
        .filter(line => !line.startsWith('#'))
        .join('\n')
        .trim()

      assert(
        !!tableText,
        'could not find annotation lines in Flux response; are `annotations` enabled in the Flux query `dialect` option?'
      )

      tableData = csvParse(tableText)

      annotationText = chunk
        .split('\n')
        .filter(line => line.startsWith('#'))
        .join('\n')
        .trim()

      assert(
        !!annotationText,
        'could not find annotation lines in Flux response; are `annotations` enabled in the Flux query `dialect` option?'
      )
      const annotationData = parseAnnotations(annotationText, tableData.columns)

      for (const columnName of tableData.columns.slice(1)) {
        columnType =
          TO_COLUMN_TYPE[annotationData.datatypeByColumnName[columnName]]

        assert(
          !!columnType,
          `encountered unknown Flux column type ${annotationData.datatypeByColumnName[columnName]}`
        )

        columnKey = `${columnName} (${columnType})`

        if (!columns[columnKey]) {
          columns[columnKey] = {
            name: columnName,
            type: columnType,
            fluxDataType: annotationData.datatypeByColumnName[columnName],
            data: [],
          } as Column
        }

        columnDefault = annotationData.defaultByColumnName[columnName]

        for (let i = 0; i < tableData.length; i++) {
          columns[columnKey].data[tableLength + i] = parseValue(
            tableData[i][columnName] || columnDefault,
            columnType
          )
        }

        if (annotationData.groupKey.includes(columnName)) {
          fluxGroupKeyUnion.add(columnKey)
        }
      }

      tableLength += tableData.length
    }

    resolveNames(columns, fluxGroupKeyUnion)

    const table = Object.entries(columns).reduce(
      (table, [key, {name, fluxDataType, type, data}]) => {
        data.length = tableLength
        return table.addColumn(key, fluxDataType, type, data, name)
      },
      newTable(tableLength)
    )

    const result = {
      table,
      fluxGroupKeyUnion: Array.from(fluxGroupKeyUnion),
    }

    return result
  } catch (error) {
    return {
      table: newTable(0),
      fluxGroupKeyUnion: [],
      error,
    }
  }
}

export const fromFluxWithSchema = (fluxCSV: string): FromFluxResult => {
  const columns: Columns = {}
  const fluxGroupKeyUnion = new Set<string>()

  const schema: Schema = {}
  let tableLength = 0

  try {
    const chunks = splitChunks(fluxCSV)

    // declaring all nested variables here to reduce memory drain
    let tableText = ''
    let tableData: any = []
    let annotationText = ''
    let columnType: any = ''
    let columnKey = ''
    let columnDefault: any = ''

    for (const chunk of chunks) {
      formatSchemaByChunk(chunk, schema)
      tableText = chunk
        .split('\n')
        .filter(line => !line.startsWith('#'))
        .join('\n')
        .trim()

      assert(
        !!tableText,
        'could not find annotation lines in Flux response; are `annotations` enabled in the Flux query `dialect` option?'
      )

      tableData = csvParse(tableText)

      annotationText = chunk
        .split('\n')
        .filter(line => line.startsWith('#'))
        .join('\n')
        .trim()

      assert(
        !!annotationText,
        'could not find annotation lines in Flux response; are `annotations` enabled in the Flux query `dialect` option?'
      )
      const annotationData = parseAnnotations(annotationText, tableData.columns)

      for (const columnName of tableData.columns.slice(1)) {
        columnType =
          TO_COLUMN_TYPE[annotationData.datatypeByColumnName[columnName]]

        assert(
          !!columnType,
          `encountered unknown Flux column type ${annotationData.datatypeByColumnName[columnName]}`
        )

        columnKey = `${columnName} (${columnType})`

        if (!columns[columnKey]) {
          columns[columnKey] = {
            name: columnName,
            type: columnType,
            fluxDataType: annotationData.datatypeByColumnName[columnName],
            data: [],
          } as Column
        }

        columnDefault = annotationData.defaultByColumnName[columnName]

        for (let i = 0; i < tableData.length; i++) {
          columns[columnKey].data[tableLength + i] = parseValue(
            tableData[i][columnName] || columnDefault,
            columnType
          )
        }

        if (annotationData.groupKey.includes(columnName)) {
          fluxGroupKeyUnion.add(columnKey)
        }
      }

      tableLength += tableData.length
    }

    resolveNames(columns, fluxGroupKeyUnion)

    const table = Object.entries(columns).reduce(
      (table, [key, {name, fluxDataType, type, data}]) => {
        data.length = tableLength
        return table.addColumn(key, fluxDataType, type, data, name)
      },
      newTable(tableLength)
    )

    const result = {
      table,
      fluxGroupKeyUnion: Array.from(fluxGroupKeyUnion),
      schema,
    }

    return result
  } catch (error) {
    return {
      table: newTable(0),
      fluxGroupKeyUnion: [],
      schema,
      error,
    }
  }
}

/*
  A Flux CSV response can contain multiple CSV files each joined by a newline.
  This function splits up a CSV response into these individual CSV files.
  See https://github.com/influxdata/flux/blob/master/docs/SPEC.md#multiple-tables.
*/
const splitChunks = (fluxCSV: string): string[] => {
  const trimmedResponse = fluxCSV.trim()

  if (trimmedResponse === '') {
    return []
  }

  // Split the response into separate chunks whenever we encounter:
  //
  // 1. A newline
  // 2. Followed by any amount of whitespace
  // 3. Followed by a newline
  // 4. Followed by a `#` character
  //
  // The last condition is [necessary][0] for handling CSV responses with
  // values containing newlines.
  //
  // [0]: https://github.com/influxdata/influxdb/issues/15017
  const chunks = trimmedResponse
    .split(/\n\s*\n#/)
    .map((s, i) => (i === 0 ? s : `#${s}`)) // Add back the `#` characters that were removed by splitting

  return chunks
}

const formatSchemaByGroupKey = (groupKey, schema: Schema) => {
  const measurement = groupKey['_measurement']
  if (measurement === undefined) {
    return {}
  }
  const field = groupKey['_field']
  const tags = Object.entries(groupKey)
    .filter(([k]) => {
      return !(
        k === '_start' ||
        k === '_stop' ||
        k === '_measurement' ||
        k === '_field' ||
        k === 'undefined'
      )
    })
    .reduce((acc, [k, vals]) => {
      if (k !== undefined && vals !== undefined) {
        const values: Set<string | number> = vals as Set<string | number>
        if (acc[k]) {
          const currentValues: Set<string | number> = acc[k]
          acc[k] = new Set([...currentValues, ...values])
        } else {
          acc[k] = new Set([values])
        }
      }
      return acc
    }, {})

  if (schema[measurement]) {
    let fields = schema[measurement].fields || []
    if (field && !fields.includes(field)) {
      fields = fields.concat(field)
    }
    const existingTags = schema[measurement].tags || {}
    Object.entries(existingTags).forEach(([k, values]) => {
      if (tags[k] && values) {
        tags[k] = new Set([...tags[k], ...values])
      }
    })
    schema[measurement] = {
      fields,
      tags,
      type: 'string',
    }
  } else {
    schema[measurement] = {
      type: 'string',
      fields: field ? [field] : [],
      tags,
    }
  }
}

const parseAnnotations = (
  annotationData: string,
  headerRow: string[]
): {
  groupKey: string[]
  datatypeByColumnName: {[columnName: string]: any}
  defaultByColumnName: {[columnName: string]: any}
} => {
  const rows = csvParseRows(annotationData)

  const groupRow = rows.find(row => row[0] === '#group')
  const datatypeRow = rows.find(row => row[0] === '#datatype')
  const defaultRow = rows.find(row => row[0] === '#default')

  assert(!!groupRow, 'could not find group annotation in Flux response')
  assert(!!datatypeRow, 'could not find datatype annotation in Flux response')
  assert(!!defaultRow, 'could not find default annotation in Flux response')

  const groupKey = groupRow.reduce(
    (acc, val, i) => (val === 'true' ? [...acc, headerRow[i]] : acc),
    []
  )

  const datatypeByColumnName = datatypeRow
    .slice(1)
    .reduce((acc, val, i) => ({...acc, [headerRow[i + 1]]: val}), {})

  const defaultByColumnName = defaultRow
    .slice(1)
    .reduce((acc, val, i) => ({...acc, [headerRow[i + 1]]: val}), {})

  return {groupKey, datatypeByColumnName, defaultByColumnName}
}

const TO_COLUMN_TYPE: {[fluxDatatype: string]: ColumnType} = {
  boolean: 'boolean',
  unsignedLong: 'number',
  long: 'number',
  double: 'number',
  string: 'string',
  'dateTime:RFC3339': 'time',
}

const parseValue = (value: string | undefined, columnType: ColumnType): any => {
  if (value === undefined) {
    return undefined
  }

  if (value === 'null') {
    return null
  }

  if (value === 'NaN') {
    return NaN
  }

  if (columnType === 'boolean' && value === 'true') {
    return true
  }

  if (columnType === 'boolean' && value === 'false') {
    return false
  }

  if (columnType === 'string') {
    return value
  }

  if (columnType === 'time') {
    return Date.parse(value)
  }

  if (columnType === 'number' && value === '') {
    return null
  }

  if (columnType === 'number') {
    return Number(value)
  }

  return null
}

/*
  Each column in a parsed `Table` can only have a single type, but because we
  combine columns from multiple Flux tables into a single table, we may
  encounter conflicting types for a given column during parsing.
  To avoid this issue, we seperate the concept of the column _key_ and column
  _name_ in the `Table` object, where each key is unique but each name is not
  necessarily unique. We name the keys something like "foo (int)", where "foo"
  is the name and "int" is the type.
  But since type conflicts are rare and the public API requires referencing
  columns by key, we want to avoid unwieldy keys whenever possible. So the last
  stage of parsing is to rename all column keys from the `$NAME ($TYPE)` format
  to just `$NAME` if we can do so safely. That is what this function does.
*/
const resolveNames = (
  columns: Columns,
  fluxGroupKeyUnion: Set<string>
): void => {
  const colNameCounts = Object.values(columns)
    .map(col => col.name)
    .reduce((acc, name) => ({...acc, [name]: (acc[name] || 0) + 1}), {})

  const uniqueColNames = Object.entries(colNameCounts)
    .filter(([_, count]) => count === 1)
    .map(([name]) => name)

  for (const uniqueName of uniqueColNames) {
    const [columnKey, column] = Object.entries(columns).find(
      ([_, col]) => col.name === uniqueName
    )

    columns[uniqueName] = column

    delete columns[columnKey]

    if (fluxGroupKeyUnion.has(columnKey)) {
      fluxGroupKeyUnion.delete(columnKey)
      fluxGroupKeyUnion.add(uniqueName)
    }
  }
}
