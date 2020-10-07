import {LineData, Scale, Table} from '../types'
import {FILL} from '../constants/columnKeys'
import {isNumber} from '../utils/isNumber'

export const getBandHoverPoints = (
  table: Table,
  hoverRowIndices: number[],
  xColKey: string,
  yColKey: string,
  xScale: Scale<number, number>,
  yScale: Scale<number, number>,
  lineData: LineData
): Array<{x: number; y: number; fill: string}> => {
  const xColData = table.getColumn(xColKey, 'number')
  const yColData = table.getColumn(yColKey, 'number')
  const groupColData = table.getColumn(FILL, 'number')
  const lines = lineData || {}

  return hoverRowIndices.map(hoverIndex => {
    let color = ''
    const lineIndex = groupColData[hoverIndex]
    if (isNumber(lineIndex) && lines[lineIndex]) {
      color = lines[lineIndex].fill
    }
    return {
      x: xScale(xColData[hoverIndex]),
      y: yScale(yColData[hoverIndex]),
      fill: color,
    }
  })
}
