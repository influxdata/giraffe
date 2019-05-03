import {ColumnType} from '../types'

export const isNumeric = (columnType: ColumnType): boolean =>
  columnType === 'number' || columnType === 'time'
