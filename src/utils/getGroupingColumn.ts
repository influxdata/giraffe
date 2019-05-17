import {Table, StringColumn} from '../types'
import {assert} from '../utils/assert'

export const getGroupingColumn = (
  table: Table,
  columnKey: string
): StringColumn => {
  const col = table.columns[columnKey]

  assert(!!col, `expected column "${columnKey}" but did not find it`)

  return col as StringColumn
}
