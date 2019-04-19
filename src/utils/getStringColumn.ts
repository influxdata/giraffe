import {assert} from './assert'
import {Table, StringColumn} from '../types'

export const getStringColumn = (table: Table, key: string): StringColumn => {
  const col = table.columns[key]

  assert(
    `expected column "${key}" to be numeric but received column of type "${
      col.type
    }"`,
    col.type === 'string'
  )

  return col as StringColumn
}
