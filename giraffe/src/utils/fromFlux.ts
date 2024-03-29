import Papa from 'papaparse'
import {Table, ColumnType, FluxDataType} from '../types'
import {newTable} from './newTable'
import {RESULT} from '../constants/columnKeys'
export interface FromFluxResult {
  error?: Error

  // The single parsed `Table`
  table: Table

  // The union of unique group keys from all input Flux tables
  fluxGroupKeyUnion: string[]

  // All possible values of the "result" column
  resultColumnNames: string[]
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
  let tableLength = 0
  try {
    /*
      A Flux CSV response can contain multiple CSV files each joined by a newline.
      This function splits up a CSV response into these individual CSV files.
      See https://github.com/influxdata/flux/blob/master/docs/SPEC.md#multiple-tables.
    */
    // finds the first non-whitespace character
    let currentIndex = fluxCSV.search(/\S/)

    if (currentIndex === -1) {
      return {
        table: newTable(0),
        fluxGroupKeyUnion: [],
        resultColumnNames: [],
      }
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

    const chunks = []
    while (currentIndex !== -1) {
      const prevIndex = currentIndex
      const nextIndex = fluxCSV
        .substring(currentIndex, fluxCSV.length)
        .search(/\n\s*\n#(?=datatype|group|default)/)
      if (nextIndex === -1) {
        chunks.push([prevIndex, fluxCSV.length - 1])
        currentIndex = -1
        break
      } else {
        chunks.push([prevIndex, prevIndex + nextIndex])
        currentIndex = prevIndex + nextIndex + 2
      }
    }

    // declaring all nested variables here to reduce memory drain
    let columnKey = ''
    const fluxGroupKeyUnion = new Set<string>()
    const resultColumnNames = new Set<string>()
    let _end, _start
    for (const [start, end] of chunks) {
      _end = end
      _start = start
      let annotationMode = true

      const parsed = {
        group: [],
        datatype: [],
        default: [],
        columnKey: [],
      }
      // we want to move the pointer to the first non-whitespace character at the end of the chunk
      while (/\s/.test(fluxCSV[_end]) && _end > _start) {
        _end--
      }
      // we want to move the pointer to the first non-whitespace character at the start of the chunk
      while (/\s/.test(fluxCSV[_start]) && _start < _end) {
        _start++
      }
      /**
       * substring doesn't include the index for the end. For example:
       *
       * 'hello'.substring(0, 1) // 'h'
       *
       * Given the fact that we want to include the last character of the chunk
       * we want to add + 1 to the substring ending
       */
      Papa.parse(fluxCSV.substring(_start, _end + 1), {
        step: function(results) {
          if (results.data[0] === '#group') {
            parsed.group = results.data.slice(1)
          } else if (results.data[0] === '#datatype') {
            parsed.datatype = results.data.slice(1)
          } else if (results.data[0] === '#default') {
            parsed.default = results.data.slice(1)
          } else if (results.data[0][0] !== '#' && annotationMode === true) {
            annotationMode = false
            results.data.slice(1).reduce((acc, curr, index) => {
              columnKey = `${curr} (${TO_COLUMN_TYPE[parsed.datatype[index]]})`
              parsed.columnKey.push(columnKey)
              if (!acc[columnKey]) {
                acc[columnKey] = {
                  name: curr,
                  type: TO_COLUMN_TYPE[parsed.datatype[index]],
                  fluxDataType: parsed.datatype[index],
                  data: [],
                }
              }
              if (parsed.group[index] === 'true') {
                fluxGroupKeyUnion.add(columnKey)
              }
              return acc
            }, columns)
          } else {
            results.data.slice(1).forEach((data, index) => {
              const value = data || parsed.default[index]
              let result = null

              if (value === undefined) {
                result = undefined
              } else if (value === 'null') {
                result = null
              } else if (value === 'NaN') {
                result = NaN
              } else if (
                TO_COLUMN_TYPE[parsed.datatype[index]] === 'boolean' &&
                value === 'true'
              ) {
                result = true
              } else if (
                TO_COLUMN_TYPE[parsed.datatype[index]] === 'boolean' &&
                value === 'false'
              ) {
                result = false
              } else if (TO_COLUMN_TYPE[parsed.datatype[index]] === 'string') {
                result = value
              } else if (TO_COLUMN_TYPE[parsed.datatype[index]] === 'time') {
                if (/\s/.test(value)) {
                  result = Date.parse(value.trim())
                } else {
                  result = Date.parse(value)
                }
              } else if (TO_COLUMN_TYPE[parsed.datatype[index]] === 'number') {
                if (value === '') {
                  result = null
                } else {
                  const parsedValue = Number(value)
                  result = parsedValue === parsedValue ? parsedValue : value
                }
              } else {
                result = null
              }

              if (columns[parsed.columnKey[index]] !== undefined) {
                if (
                  columns[parsed.columnKey[index]].name === RESULT &&
                  result
                ) {
                  resultColumnNames.add(result)
                }
                columns[parsed.columnKey[index]].data[tableLength] = result
              }
            })
            tableLength++
          }
        },
      })
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
      resultColumnNames: Array.from(resultColumnNames),
    }

    return result
  } catch (error) {
    return {
      error: error as Error,
      table: newTable(0),
      fluxGroupKeyUnion: [],
      resultColumnNames: [],
    }
  }
}

export const fastFromFlux = (fluxCSV: string): FromFluxResult => {
  const columns: Columns = {}
  let tableLength = 0
  try {
    /*
      A Flux CSV response can contain multiple CSV files each joined by a newline.
      This function splits up a CSV response into these individual CSV files.
      See https://github.com/influxdata/flux/blob/master/docs/SPEC.md#multiple-tables.
    */
    // finds the first non-whitespace character
    let currentIndex = fluxCSV.search(/\S/)

    if (currentIndex === -1) {
      return {
        table: newTable(0),
        fluxGroupKeyUnion: [],
        resultColumnNames: [],
      }
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

    const chunks = []
    while (currentIndex !== -1) {
      const prevIndex = currentIndex
      const nextIndex = fluxCSV
        .substring(currentIndex, fluxCSV.length)
        .search(/\n\s*\n#(?=datatype|group|default)/)
      if (nextIndex === -1) {
        chunks.push([prevIndex, fluxCSV.length - 1])
        currentIndex = -1
        break
      } else {
        chunks.push([prevIndex, prevIndex + nextIndex])
        currentIndex = prevIndex + nextIndex + 2
      }
    }

    // declaring all nested variables here to reduce memory drain
    let columnKey = ''
    const fluxGroupKeyUnion = new Set<string>()
    const resultColumnNames = new Set<string>()
    let _end, _start
    for (const [start, end] of chunks) {
      _end = end
      _start = start
      let annotationMode = true

      const parsed = {
        group: [],
        datatype: [],
        default: [],
        columnKey: [],
      }
      // we want to move the pointer to the first non-whitespace character at the end of the chunk
      while (/\s/.test(fluxCSV[_end]) && _end > _start) {
        _end--
      }
      // we want to move the pointer to the first non-whitespace character at the start of the chunk
      while (/\s/.test(fluxCSV[_start]) && _start < _end) {
        _start++
      }
      /**
       * substring doesn't include the index for the end. For example:
       *
       * 'hello'.substring(0, 1) // 'h'
       *
       * Given the fact that we want to include the last character of the chunk
       * we want to add + 1 to the substring ending
       */
      Papa.parse(fluxCSV.substring(_start, _end + 1), {
        step: function(results) {
          if (results.data[0] === '#group') {
            parsed.group = results.data.slice(1)
          } else if (results.data[0] === '#datatype') {
            parsed.datatype = results.data.slice(1)
          } else if (results.data[0] === '#default') {
            parsed.default = results.data.slice(1)
          } else if (results.data[0][0] !== '#' && annotationMode === true) {
            annotationMode = false
            results.data.slice(1).reduce((acc, curr, index) => {
              columnKey = `${curr} (${TO_COLUMN_TYPE[parsed.datatype[index]]})`
              parsed.columnKey.push(columnKey)
              if (!acc[columnKey]) {
                acc[columnKey] = {
                  name: curr,
                  type: TO_COLUMN_TYPE[parsed.datatype[index]],
                  fluxDataType: parsed.datatype[index],
                  data: [],
                }
              }
              if (parsed.group[index] === 'true') {
                fluxGroupKeyUnion.add(columnKey)
              }
              return acc
            }, columns)
          } else {
            results.data.slice(1).forEach((data, index) => {
              const value = data || parsed.default[index]
              let result = null

              if (value === undefined) {
                result = undefined
              } else if (value === 'null') {
                result = null
              } else if (value === 'NaN') {
                result = NaN
              } else if (
                TO_COLUMN_TYPE[parsed.datatype[index]] === 'boolean' &&
                value === 'true'
              ) {
                result = true
              } else if (
                TO_COLUMN_TYPE[parsed.datatype[index]] === 'boolean' &&
                value === 'false'
              ) {
                result = false
              } else if (TO_COLUMN_TYPE[parsed.datatype[index]] === 'string') {
                result = value
              } else if (TO_COLUMN_TYPE[parsed.datatype[index]] === 'time') {
                if (/\s/.test(value)) {
                  result = Date.parse(value.trim())
                } else {
                  result = Date.parse(value)
                }
              } else if (TO_COLUMN_TYPE[parsed.datatype[index]] === 'number') {
                if (value === '') {
                  result = null
                } else {
                  const parsedValue = Number(value)
                  result = parsedValue === parsedValue ? parsedValue : value
                }
              } else {
                result = null
              }

              if (columns[parsed.columnKey[index]] !== undefined) {
                if (
                  columns[parsed.columnKey[index]].name === RESULT &&
                  result
                ) {
                  resultColumnNames.add(result)
                }
                columns[parsed.columnKey[index]].data[tableLength] = result
              }
            })
            tableLength++
          }
        },
      })
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
      resultColumnNames: Array.from(resultColumnNames),
    }

    return result
  } catch (error) {
    return {
      error: error as Error,
      table: newTable(0),
      fluxGroupKeyUnion: [],
      resultColumnNames: [],
    }
  }
}

const TO_COLUMN_TYPE: {[fluxDatatype: string]: ColumnType} = {
  boolean: 'boolean',
  unsignedLong: 'number',
  long: 'number',
  double: 'number',
  string: 'string',
  'dateTime:RFC3339': 'time',
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
