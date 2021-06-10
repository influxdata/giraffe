import {range} from 'd3-array'

import {getRangeLabel} from './tooltip'
import {
  DISPLAY_NAME,
  FILL,
  SERIES,
  X_MAX,
  X_MIN,
} from '../../constants/columnKeys'
import {
  Table,
  Scale,
  LegendData,
  LegendColumn,
  ColumnGroupMap,
} from '../../types'

export const findHoveredBoxes = (
  hoverDimension: string,
  hoverX: number | null,
  hoverY: number | null,
  boxTable: Table,
  xScale: Scale<number, number>,
  yScale: Scale<number, number>,
  yDomain: number[],
  yTicks: string[],
  width: number,
  height: number
): number[] => {
  const isActive =
    hoverX !== undefined &&
    hoverX !== null &&
    hoverX >= 0 &&
    hoverX < width &&
    hoverY !== undefined &&
    hoverY !== null &&
    hoverY >= 0 &&
    hoverY <= height

  if (!isActive) {
    return []
  }

  const xMinData = boxTable.getColumn(X_MIN, 'number')
  const xMaxData = boxTable.getColumn(X_MAX, 'number')
  const yTickData = boxTable.getColumn(SERIES, 'string')

  const dataX = xScale.invert(hoverX)
  const dataY = yScale.invert(hoverY)

  const xRange = range(0, xMinData.length)
  const hoveredYTick =
    Math.floor(dataY) >= yDomain[0] && Math.floor(dataY) < yDomain[1]
      ? yTicks[Math.floor(dataY)]
      : ''

  const containsHoverX = (index: number): boolean =>
    xMinData[index] <= dataX && xMaxData[index] > dataX
  const containsHoverY = (index: number): boolean =>
    yTickData[index] === hoveredYTick

  /****************************************************************************
   * Mosaic hover dimensions
   * 'xy' means a single piece at the mouse position
   * 'x'  means all pieces with the same time value along the y-axis at mouse position
   * 'y'  means all pieces with the same y-tick along the x-axis at mouse position
   * 'auto' menas 'xy' see above
   */

  if (hoverDimension === 'x') {
    return xRange.filter(containsHoverX)
  }

  if (hoverDimension === 'y') {
    return xRange.filter(containsHoverY)
  }

  // Otherwise treat as 'xy' regardless of what the hoverDimension is
  return xRange.filter(i => containsHoverX(i) && containsHoverY(i))
}

export const getMosaicTooltipData = (
  hoveredRowIndices: number[],
  boxTable: Table,
  inputTable: Table,
  xColKey: string,
  yColKey: string,
  fillGroupMap: ColumnGroupMap,
  fillScale: Scale<number, string>,
  columnFormatter: (colKey: string) => (x: any) => string
): LegendData => {
  const xMinCol = boxTable.getColumn(X_MIN, 'number')
  const xMaxCol = boxTable.getColumn(X_MAX, 'number')
  const valCol = boxTable.getColumn(FILL, 'string')
  const yCol = boxTable.getColumn(DISPLAY_NAME, 'string')
  const xFormatter = columnFormatter(xColKey)
  const yFormatter = columnFormatter(yColKey)
  const valFormatter = columnFormatter(FILL)

  // Use reverse order because
  // Mosaic graph contents are filled in from bottom to top
  // Mosaic tooltip contents are filled in from top to bottom
  const hoveredBoxRows = hoveredRowIndices.reverse()

  const colors = hoveredBoxRows.map(i =>
    fillScale((valCol[i] as unknown) as number)
  )

  const xTooltipColumn: LegendColumn = {
    key: xColKey,
    name: inputTable.getColumnName(xColKey),
    type: inputTable.getColumnType(xColKey),
    colors,
    values: hoveredBoxRows.map(i =>
      getRangeLabel(xMinCol[i], xMaxCol[i], xFormatter)
    ),
  }

  const yTooltipColumn: LegendColumn = {
    key: yColKey,
    name: yColKey,
    type: 'string',
    colors,
    values: hoveredBoxRows.map(i => yFormatter(yCol[i])),
  }

  const durationTooltipColumn: LegendColumn = {
    key: 'duration column',
    name: 'Duration',
    type: 'number',
    colors,
    values: hoveredBoxRows.map(
      i => ((((xMaxCol[i] - xMinCol[i]) / 1000) as unknown) + ' sec') as string
    ),
  }

  // Mosaic uses only one key for the fill column
  //   By capturing this in an array, we can destructure to get
  //   either the fill column or nothing into the tooltips
  const fillColumns = []
  const key = fillGroupMap.columnKeys[0]
  if (key) {
    fillColumns.push({
      key,
      name: inputTable.getColumnName(key),
      type: inputTable.getColumnType(key),
      colors,
      values: hoveredBoxRows.map(i => valFormatter(valCol[i])),
    })
  }
  const tooltipColumns = [
    xTooltipColumn,
    ...fillColumns,
    yTooltipColumn,
    durationTooltipColumn,
  ]
  return tooltipColumns
}
