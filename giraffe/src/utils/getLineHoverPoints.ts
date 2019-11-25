import {LinePosition, LineData, Table, Scale, DomainLabel} from '../types'

import {FILL} from '../constants/columnKeys'

import {getDomainDataFromLines} from './lineData'

export const getLineHoverPoints = (
  position: LinePosition,
  lineData: LineData,
  table: Table,
  hoverRowIndices: number[],
  xColKey: string,
  yColKey: string,
  xScale: Scale<number, number>,
  yScale: Scale<number, number>,
  fillScale: Scale<number, string>
): Array<{x: number; y: number; fill: string}> => {
  const xColData = table.getColumn(xColKey, 'number')
  const yColData =
    position === 'stacked'
      ? getDomainDataFromLines(lineData, DomainLabel.Y)
      : table.getColumn(yColKey, 'number')
  const groupColData = table.getColumn(FILL, 'number')

  return hoverRowIndices.map(i => ({
    x: xScale(xColData[i]),
    y: yScale(yColData[i]),
    fill: fillScale(groupColData[i]),
  }))
}
