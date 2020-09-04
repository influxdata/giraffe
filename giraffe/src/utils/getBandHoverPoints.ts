import {Table, Scale} from '../types'

export const getBandHoverPoints = (
  table: Table,
  hoverRowIndices: number[],
  xColKey: string,
  yColKey: string,
  xScale: Scale<number, number>,
  yScale: Scale<number, number>,
  fillScale: Function
): Array<{x: number; y: number; fill: string}> => {
  const xColData = table.getColumn(xColKey, 'number')
  const yColData = table.getColumn(yColKey, 'number')

  return hoverRowIndices.map((hoverIndex, index) => ({
    x: xScale(xColData[hoverIndex]),
    y: yScale(yColData[hoverIndex]),
    fill: fillScale(index),
  }))
}
