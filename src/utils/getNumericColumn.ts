import {assert} from './assert'
import {isNumeric} from './isNumeric'
import {Table, NumericTableColumn} from '../types'

export const getNumericColumn = (
  table: Table,
  key: string
): NumericTableColumn => {
  const col = table.columns[key]

  assert(
    `expected column "${key}" to be numeric but received column of type "${
      col.type
    }"`,
    isNumeric(col.type)
  )

  return col as NumericTableColumn
}
