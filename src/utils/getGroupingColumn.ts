import {Table, StringColumn} from '../types'
import {assert} from '../utils/assert'

export const getGroupingColumn = (
  table: Table,
  columnKey: string
): StringColumn => {
  const col = table.columns[columnKey]

  assert(`expected column "${columnKey}" but did not find it`, !!col)

  return col as StringColumn
}
