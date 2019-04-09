import {Table, StringColumn} from '../types'
import {GROUP_COL_KEY} from '../constants'
import {assert} from '../utils/assert'

export const getGroupColumn = (table: Table): StringColumn => {
  const col = table.columns[GROUP_COL_KEY]

  assert(`expected column "${GROUP_COL_KEY}" but did not find it`, !!col)

  return col as StringColumn
}
