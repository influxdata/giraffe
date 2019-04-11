import {Table, Scale} from '../types'

import {getNumericColumn} from './getNumericColumn'
import {getGroupColumn} from './getGroupColumn'

export const getLineHoverPoints = (
  table: Table,
  hoverRowIndices: number[],
  xColKey: string,
  yColKey: string,
  xScale: Scale<number, number>,
  yScale: Scale<number, number>,
  fillScale: Scale<string, string>
): Array<{x: number; y: number; fill: string}> => {
  if (!hoverRowIndices) {
    return null
  }

  const {data: xColData} = getNumericColumn(table, xColKey)
  const {data: yColData} = getNumericColumn(table, yColKey)
  const {data: groupColData} = getGroupColumn(table)

  return hoverRowIndices.map(i => ({
    x: xScale(xColData[i]),
    y: yScale(yColData[i]),
    fill: fillScale(groupColData[i]),
  }))
}
