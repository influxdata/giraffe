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

  const columns = {...table.columns}

  // Works around a build issue that shows up when using computed property
  // syntax
  columns[GROUP_COL_KEY] = {data, type: 'string'}

  return {...table, columns}
}
