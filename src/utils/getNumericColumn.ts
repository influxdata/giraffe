import {assert} from './assert'
import {isNumeric} from './isNumeric'
import {Table, NumberColumn, TimeColumn} from '../types'

export const getNumericColumn = (
  table: Table,
  key: string
): NumberColumn | TimeColumn => {
  const col = table.columns[key]

  assert(
    `expected column "${key}" to be numeric but received column of type "${
      col.type
    }"`,
    isNumeric(col.type)
  )

  return col as NumberColumn | TimeColumn
}
