import {ColumnType} from '../types'

const NUMERIC_TYPES = new Set(['uint', 'int', 'float', 'time'])

export const isNumeric = (columnType: ColumnType): boolean =>
  NUMERIC_TYPES.has(columnType)
