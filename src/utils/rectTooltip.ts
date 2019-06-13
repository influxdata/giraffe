import {range} from 'd3-array'

import {getRangeLabel} from './tooltip'
import {X_MIN, X_MAX, Y_MIN, Y_MAX, FILL, COUNT} from '../constants/columnKeys'
import {
  Table,
  Scale,
  TooltipData,
  TooltipColumn,
  ColumnGroupMap,
} from '../types'

export const findHoveredRects = (
  rectTable: Table,
  hoverX: number | null,
  hoverY: number | null,
  xScale: Scale<number, number>,
  yScale: Scale<number, number>,
  binDimension: 'xy' | 'x'
): number[] => {
  if (!hoverX || !hoverY) {
    return []
  }

  const xMinData = rectTable.getColumn(X_MIN, 'number')
  const xMaxData = rectTable.getColumn(X_MAX, 'number')
  const yMinData = rectTable.getColumn(Y_MIN, 'number')
  const yMaxData = rectTable.getColumn(Y_MAX, 'number')
  const dataX = xScale.invert(hoverX)
  const dataY = yScale.invert(hoverY)

  // Find all bins whose x extent contain the mouse x position
  const xIndices = range(0, xMinData.length).filter(
    i => xMinData[i] <= dataX && xMaxData[i] > dataX
  )

  if (binDimension === 'x' && !xIndices.some(i => yMaxData[i] >= dataY)) {
    return []
  } else if (binDimension === 'x') {
    return xIndices
  }

  const xyIndices = xIndices.filter(
    i => yMinData[i] <= dataY && yMaxData[i] > dataY
  )

  return xyIndices
}

export const get1DTooltipData = (
  hoveredRectRows: number[],
  rectTable: Table,
  inputTable: Table,
  xColKey: string,
  fillGroupMap: ColumnGroupMap,
  fillScale: Scale<number, string>,
  columnFormatter: (colKey: string) => (x: any) => string
): TooltipData => {
  const xMinCol = rectTable.getColumn(X_MIN, 'number')
  const xMaxCol = rectTable.getColumn(X_MAX, 'number')
  const countCol = rectTable.getColumn(COUNT, 'number')
  const fillCol = rectTable.getColumn(FILL, 'number')
  const xFormatter = columnFormatter(xColKey)
  const countFormatter = columnFormatter(COUNT)
  const colors = hoveredRectRows.map(i => fillScale(fillCol[i]))

  const xTooltipColumn: TooltipColumn = {
    key: xColKey,
    name: inputTable.getColumnName(xColKey),
    type: inputTable.getColumnType(xColKey),
    colors,
    values: hoveredRectRows.map(i =>
      getRangeLabel(xMinCol[i], xMaxCol[i], xFormatter)
    ),
  }

  const countTooltipColumn: TooltipColumn = {
    key: COUNT,
    name: 'count',
    type: 'number',
    colors,
    values: hoveredRectRows.map(i => countFormatter(countCol[i])),
  }

  const groupTooltipColumns = fillGroupMap.columnKeys.map(key => ({
    key,
    name: inputTable.getColumnName(key),
    type: inputTable.getColumnType(key),
    colors,
    values: hoveredRectRows.map(i =>
      columnFormatter(key)(fillGroupMap.mappings[fillCol[i]][key])
    ),
  }))

  const tooltipColumns = [
    xTooltipColumn,
    countTooltipColumn,
    ...groupTooltipColumns,
  ]

  return tooltipColumns
}

export const get2DTooltipData = (
  hoveredRectRows: number[],
  rectTable: Table,
  inputTable: Table,
  xColKey: string,
  yColKey: string,
  columnFormatter: (colKey: string) => (x: any) => string
): TooltipData => {
  const xMinCol = rectTable.getColumn(X_MIN, 'number')
  const xMaxCol = rectTable.getColumn(X_MAX, 'number')
  const yMinCol = rectTable.getColumn(Y_MIN, 'number')
  const yMaxCol = rectTable.getColumn(Y_MAX, 'number')
  const countCol = rectTable.getColumn(COUNT, 'number')
  const xFormatter = columnFormatter(xColKey)
  const yFormatter = columnFormatter(yColKey)
  const countFormatter = columnFormatter(COUNT)

  const xTooltipColumn: TooltipColumn = {
    key: xColKey,
    name: inputTable.getColumnName(xColKey),
    type: inputTable.getColumnType(xColKey),
    colors: null,
    values: hoveredRectRows.map(i =>
      getRangeLabel(xMinCol[i], xMaxCol[i], xFormatter)
    ),
  }

  const countTooltipColumn: TooltipColumn = {
    key: COUNT,
    name: 'count',
    type: 'number',
    colors: null,
    values: hoveredRectRows.map(i => countFormatter(countCol[i])),
  }

  const yTooltipColumn: TooltipColumn = {
    key: yColKey,
    name: inputTable.getColumnName(yColKey),
    type: inputTable.getColumnType(yColKey),
    colors: null,
    values: hoveredRectRows.map(i =>
      getRangeLabel(yMinCol[i], yMaxCol[i], yFormatter)
    ),
  }

  const tooltipColumns = [xTooltipColumn, yTooltipColumn, countTooltipColumn]

  return tooltipColumns
}
