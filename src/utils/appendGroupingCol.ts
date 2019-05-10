import {Table} from '../types'
import {getGroupKey} from '../utils/getGroupKey'

export const appendGroupingCol = <T extends Table>(
  table: T,
  groupingColKeys: string[],
  columnKey: string
): T => {
  const data = []

  for (let i = 0; i < table.length; i++) {
    data.push(getGroupKey(groupingColKeys.map(k => table.columns[k].data[i])))
  }

  return {
    ...table,
    columns: {
      ...table.columns,
      [columnKey]: {data, type: 'string', name: columnKey},
    },
  }
}
