import {Table} from '../types'
import {getGroupKey} from '../utils/getGroupKey'
import {GROUP_COL_KEY} from '../constants'

export const appendGroupCol = <T extends Table>(
  table: T,
  groupColKeys: string[]
): T => {
  const data = []

  for (let i = 0; i < table.length; i++) {
    data.push(getGroupKey(groupColKeys.map(k => table.columns[k].data[i])))
  }

  return {
    ...table,
    columns: {
      ...table.columns,
      [GROUP_COL_KEY]: {data, type: 'string'},
    },
  }
}
