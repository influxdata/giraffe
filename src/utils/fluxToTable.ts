import {csvParse, csvParseRows} from 'd3-dsv'

import {Table, ColumnType, TableColumn} from '../types'
import {isNumeric} from './isNumeric'
import {assert} from './assert'

interface FluxToTableResult {
  // The single parsed `Table`
  table: Table

  // The union of group keys from all input Flux tables
  fluxGroupKeyUnion: Set<string>
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

      column_a | column_b (string) | column_b (float) | column_c | column_d  <-- key
      column_a | column_b          | column_b         | column_c | column_d  <-- name
      int      | string            | float            | int      | bool      <-- type
      ---------------------------------------------------------------------
             1 |               "g" |             1.0  |       34 | 
             2 |               "f" |             2.0  |       58 |
             3 |                   |             3.0  |       21 |
               |                   |                  |          |     true
               |                   |                  |          |     true
               |                   |                  |          |     true


  The `#group`, `#datatype`, and `#default` [annotations][1] are expected to be
  in the input Flux CSV.

  Values are coerced into appropriate JavaScript types based on the Flux
  `#datatype` annotation for the table

  The `Table` stores a `key` for each column which is seperate from the column
  `name`. If multiple Flux tables have the same column but with different
  types, they will be distinguished by different keys in the resulting `Table`;
  otherwise the `key` and `value` for each column in the result table will be
  identical.

  [0]: https://github.com/influxdata/flux/blob/master/docs/SPEC.md#csv
  [1]: https://github.com/influxdata/flux/blob/master/docs/SPEC.md#annotations
*/
export const fluxToTable = (fluxCSV: string): FluxToTableResult => {
  const table: Table = {columns: {}, length: 0}
  const fluxGroupKeyUnion = new Set()
  const chunks = splitChunks(fluxCSV)

  for (const chunk of chunks) {
    const tableText = extractTableText(chunk)
    const tableData = csvParse(tableText)
    const annotationText = extractAnnotationText(chunk)
    const annotationData = parseAnnotations(annotationText, tableData.columns)

    for (const columnName of tableData.columns.slice(1)) {
      const columnType = toColumnType(
        annotationData.datatypeByColumnName[columnName]
      )

      const columnKey = `${columnName} (${columnType})`

      if (!table.columns[columnKey]) {
        table.columns[columnKey] = {
          name: columnName,
          type: columnType,
          data: [],
        } as TableColumn
      }

      const colData = table.columns[columnKey].data
      const columnDefault = annotationData.defaultByColumnName[columnName]

      for (let i = 0; i < tableData.length; i++) {
        colData[table.length + i] = parseValue(
          tableData[i][columnName] || columnDefault,
          columnType
        )
      }

      if (annotationData.groupKey.includes(columnName)) {
        fluxGroupKeyUnion.add(columnKey)
      }
    }

    table.length += tableData.length
  }

  const result = {table, fluxGroupKeyUnion}

  resolveNames(result)

  return result
}

const splitChunks = (fluxCSV: string): string[] => {
  const trimmedResponse = fluxCSV.trim()

  if (trimmedResponse === '') {
    return []
  }

  const chunks = trimmedResponse.split(/\n\s*\n/)

  return chunks
}

const extractAnnotationText = (chunk: string): string => {
  const text = chunk
    .split('\n')
    .filter(line => line.startsWith('#'))
    .join('\n')
    .trim()

  assert(
    'could not find annotation lines in Flux response; are `annotations` enabled in the Flux query `dialect` option?',
    !!text
  )

  return text
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

  assert('could not find group annotation in Flux response', !!groupRow)
  assert('could not find group annotation in Flux response', !!datatypeRow)
  assert('could not find group annotation in Flux response', !!defaultRow)

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

const extractTableText = (chunk: string): string => {
  const text = chunk
    .split('\n')
    .filter(line => !line.startsWith('#'))
    .join('\n')
    .trim()

  return text
}

const TO_COLUMN_TYPE: {[fluxDatatype: string]: ColumnType} = {
  boolean: 'bool',
  unsignedLong: 'uint',
  long: 'int',
  double: 'float',
  string: 'string',
  'dateTime:RFC3339': 'time',
}

const toColumnType = (fluxDataType: string): ColumnType => {
  const columnType = TO_COLUMN_TYPE[fluxDataType]

  assert(`encountered unknown Flux column type ${fluxDataType}`, !!columnType)

  return columnType
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

  if (columnType === 'bool' && value === 'true') {
    return true
  }

  if (columnType === 'bool' && value === 'false') {
    return false
  }

  if (columnType === 'string') {
    return value
  }

  if (columnType === 'time') {
    return Date.parse(value)
  }

  if (isNumeric(columnType)) {
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
const resolveNames = (result: FluxToTableResult): void => {
  const {table, fluxGroupKeyUnion} = result

  const colNameCounts = Object.values(table.columns)
    .map(col => col.name)
    .reduce((acc, name) => ({...acc, [name]: (acc[name] || 0) + 1}), {})

  const uniqueColNames = Object.entries(colNameCounts)
    .filter(([_, count]) => count === 1)
    .map(([name]) => name)

  for (const uniqueName of uniqueColNames) {
    const [columnKey, column] = Object.entries(table.columns).find(
      ([_, col]) => col.name === uniqueName
    )

    table.columns[uniqueName] = column

    delete table.columns[columnKey]

    if (fluxGroupKeyUnion.has(columnKey)) {
      fluxGroupKeyUnion.delete(columnKey)
      fluxGroupKeyUnion.add(uniqueName)
    }
  }
}
