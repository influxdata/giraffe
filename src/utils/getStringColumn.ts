import {assert} from './assert'
import {Table, StringColumn} from '../types'

export const getStringColumn = (table: Table, key: string): StringColumn => {
  const col = table.columns[key]

  assert(
    col.type === 'string',
    `expected column "${key}" to be numeric but received column of type "${
      col.type
    }"`
  )

  return col as StringColumn
}
