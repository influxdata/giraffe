import {range} from 'd3-array'

import {getRangeLabel} from './tooltip'
import {X_MIN, X_MAX, Y_MIN, Y_MAX, FILL, COUNT, SERIES} from '../constants/columnKeys'
import {
  Table,
  Scale,
  TooltipData,
  TooltipColumn,
  ColumnGroupMap,
} from '../types'

export const findHoveredBoxes = (
  boxTable: Table,
  hoverX: number | null,
  hoverY: number | null,
  xScale: Scale<number, number>,
  yScale: Scale<number, number>
): number[] => {
//   console.log('entered findHoveredRects')
  if (!hoverX || !hoverY) {
    // console.log('no hovers')
    return []
  }
  const xMinData = boxTable.getColumn(X_MIN, 'number')
  const xMaxData = boxTable.getColumn(X_MAX, 'number')
  const valData = boxTable.getColumn(FILL, 'number')
  const seriesData = boxTable.getColumn(SERIES, 'number')
  const dataX = xScale.invert(hoverX)
  const dataY = yScale.invert(hoverY)

  // Find all bins whose x extent contain the mouse x position
  const xIndices = range(0, xMinData.length).filter(
    i => xMinData[i] <= dataX && xMaxData[i] > dataX
  )
  return xIndices

//   if (!xIndices.some(i => yMaxData[i] >= dataY)) {
//     return []
//   } else if (binDimension === 'x') {
//     return xIndices
//   }

//   const xyIndices = xIndices.filter(
//     i => yMinData[i] <= dataY && yMaxData[i] > dataY
//   )
//   console.log('xyIndices', xyIndices)
//   return xyIndices
}
