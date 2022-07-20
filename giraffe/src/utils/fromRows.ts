import {Table, ColumnType, ErrorName} from '../types'
import {newTable} from './newTable'

export const fromRows = <T extends object>(
  rows: T[],
  schema?: {[K in keyof T]?: ColumnType}
): Table => {
  const columns: {[columnKey: string]: any[]} = {}
  const resolvedSchema: {[columnKey: string]: ColumnType} = {}

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]

    for (const key of Object.keys(row)) {
      if (schema && !schema[key]) {
        continue
      }

      if (!columns[key]) {
        columns[key] = new Array(i).fill(undefined)
      }

      let value, columnType

      if (schema) {
        columnType = schema[key]
        if (!columnType) {
          columnType = inferColumnType(row[key])
        }
        value = parseValue(row[key], columnType)
      } else {
        columnType = inferColumnType(row[key])
        value = parseValue(row[key], columnType)
      }

      if (resolvedSchema[key] && resolvedSchema[key] !== columnType) {
        throw new SchemaMismatchError(key, resolvedSchema[key], columnType)
      } else {
        resolvedSchema[key] = columnType
      }

      columns[key][i] = value
    }
  }

  for (const column of Object.values(columns)) {
    column.length = rows.length
  }

  const table = Object.entries(columns).reduce(
    (table, [key, values]) =>
      table.addColumn(key, 'system', resolvedSchema[key], values),
    newTable(rows.length)
  )

  return table
}

const parseValue = (value: any, to: ColumnType) => {
  switch (to) {
    case 'time':
      return new Date(value).getTime()
    case 'number':
      return parseFloat(value)
    case 'boolean':
      return !!value
    case 'string':
      return String(value)
    default:
      const uhOh: never = to

      throw new Error(`unexpected ColumnType "${uhOh}"`)
  }
}

const inferColumnType = (value: any): ColumnType => {
  switch (typeof value) {
    case 'number':
      return 'number'
    case 'string':
      return 'string'
    case 'boolean':
      return 'boolean'
  }

  if (value instanceof Date) {
    return 'time'
  }

  throw new UnknownColumnTypeError(value)
}

class UnknownColumnTypeError extends Error {
  constructor(value) {
    super(...arguments)

    this.name = ErrorName.UnknownColumnTypeError
    this.message = `could not infer ColumnType of value "${value}"`
  }
}

class SchemaMismatchError extends Error {
  constructor(columnKey, firstColumnType, secondColumnType) {
    super(...arguments)

    this.name = ErrorName.SchemaMismatchError
    this.message = `ColumnType for column "${columnKey}" cannot be both "${firstColumnType}" and "${secondColumnType}"`
  }
}
