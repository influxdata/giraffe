import {Table, Scale} from '../types'

import {getNumericColumn} from './getNumericColumn'
import {getGroupingColumn} from './getGroupingColumn'
import {FILL_COL_KEY} from '../constants'

export const getLineHoverPoints = (
  table: Table,
  hoverRowIndices: number[],
  xColKey: string,
  yColKey: string,
  xScale: Scale<number, number>,
  yScale: Scale<number, number>,
  fillScale: Scale<string, string>
): Array<{x: number; y: number; fill: string}> => {
  const {data: xColData} = getNumericColumn(table, xColKey)
  const {data: yColData} = getNumericColumn(table, yColKey)
  const {data: groupColData} = getGroupingColumn(table, FILL_COL_KEY)

  return hoverRowIndices.map(i => ({
    x: xScale(xColData[i]),
    y: yScale(yColData[i]),
    fill: fillScale(groupColData[i]),
  }))
}
