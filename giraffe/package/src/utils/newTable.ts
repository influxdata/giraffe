import {Table, ColumnType, ColumnData, Config} from '../types'
import {fromFlux} from './fromFlux'

// Don't export me!
class SimpleTable implements Table {
  public readonly length: number = 0

  private columns: {
    [colKey: string]: {
      name: string
      type: ColumnType
      data: ColumnData
    }
  } = {}

  constructor(length: number) {
    this.length = length
  }

  get columnKeys(): string[] {
    return Object.keys(this.columns)
  }

  getColumn(columnKey: string, columnType?: ColumnType): any[] | null {
    const column = this.columns[columnKey]

    if (!column) {
      return null
    }

    // Allow time columns to be retrieved as number columns
    const isWideningTimeType = columnType === 'number' && column.type === 'time'

    if (columnType && columnType !== column.type && !isWideningTimeType) {
      return null
    }

    switch (columnType) {
      case 'number':
        return column.data as number[]
      case 'time':
        return column.data as number[]
      case 'string':
        return column.data as string[]
      case 'boolean':
        return column.data as boolean[]
      default:
        return column.data as any[]
    }
  }

  getColumnName(columnKey: string): string {
    const column = this.columns[columnKey]

    if (!column) {
      return null
    }

    return column.name
  }

  getColumnType(columnKey: string): ColumnType {
    const column = this.columns[columnKey]

    if (!column) {
      return null
    }

    return column.type
  }

  addColumn(
    columnKey: string,
    type: ColumnType,
    data: ColumnData,
    name?: string
  ): Table {
    if (this.columns[columnKey]) {
      throw new Error('column already exists')
    }

    if (data.length !== this.length) {
      throw new Error(
        `expected column of length ${this.length}, got column of length ${data.length} instead`
      )
    }

    const table = new SimpleTable(this.length)

    table.columns = {
      ...this.columns,
      [columnKey]: {
        name: name || columnKey,
        type,
        data,
      },
    }

    return table
  }
}

export const newTable = (length: number): Table => new SimpleTable(length)

export const newTableFromConfig = (config: Config): Table => {
  if (!config) {
    return newTable(0)
  }
  if (config.table) {
    return config.table
  }
  if (config.fluxResponse) {
    return fromFlux(config.fluxResponse).table
  }
  return newTable(0)
}
