import {assert} from './assert'
import {isNumeric} from './isNumeric'
import {Table, NumberColumn, TimeColumn} from '../types'

export const getNumericColumn = (
  table: Table,
  key: string
): NumberColumn | TimeColumn => {
  const col = table.columns[key]

  assert(
    isNumeric(col.type),
    `expected column "${key}" to be numeric but received column of type "${
      col.type
    }"`
  )

  return col as NumberColumn | TimeColumn
}
