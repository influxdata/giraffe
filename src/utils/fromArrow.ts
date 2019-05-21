import {Table as ArrowTable} from 'apache-arrow'
import {Table as VisTable, ColumnType, ColumnData} from '../types'
import {newTable} from './newTable'

const TO_COLUMN_TYPE = {
  Int8: 'number',
  Int16: 'number',
  Int32: 'number',
  Int64: 'number',
  Float64: 'number',
  Float32: 'number',
  Timestamp: 'number',
  Time: 'number',
  Date: 'number',
}

class ArrowTableWrapper implements VisTable {
  public length: number

  private arrowTable: ArrowTable
  private visTable: VisTable

  constructor(table: ArrowTable) {
    this.arrowTable = table
    this.length = table.length
    this.visTable = newTable(table.length)
  }

  get columnKeys(): string[] {
    return [
      ...this.arrowTable.schema.fields.map(f => f.name),
      ...this.visTable.columnKeys,
    ]
  }

  getColumn(columnKey: string) {
    // TODO: Better checks / errors
    // TODO: Memoize
    // TODO: Date? .asEpochMilliseconds().toArray()
    const arrowColumn = this.arrowTable.getColumn(columnKey)

    if (arrowColumn) {
      return arrowColumn.toArray()
    }

    return this.visTable.getColumn(columnKey)
  }

  getColumnName(columnKey: string): string {
    // Arrow doesn't distinguish column keys and names, so we just return the
    // column key
    return columnKey
  }

  getColumnType(columnKey: string): ColumnType {
    const field = this.arrowTable.schema.fields.find(f => f.name === columnKey)

    if (!field) {
      return this.visTable.getColumnType(columnKey)
    }

    const arrowColumnType = field.type.toString()

    const visColumnType = TO_COLUMN_TYPE[arrowColumnType]

    if (!visColumnType) {
      throw new Error(
        `no conversion defined for arrow column type ${arrowColumnType}`
      )
    }

    return visColumnType
  }

  addColumn(columnKey: string, type: ColumnType, data: ColumnData): VisTable {
    const result = new ArrowTableWrapper(this.arrowTable)

    result.visTable = this.visTable.addColumn(columnKey, type, data)

    return result
  }
}

export const fromArrow = (arrowTable: ArrowTable): VisTable => {
  return new ArrowTableWrapper(arrowTable)
}
