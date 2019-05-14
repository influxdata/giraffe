import {range} from 'd3-array'

import {TooltipData, Scale, HistogramTable, ColumnType} from '../types'
import {getNumericColumn} from './getNumericColumn'
import {getGroupingColumn} from './getGroupingColumn'
import {getRangeLabel} from './tooltip'
import {getTooltipGroupColumns} from './tooltip'
import {FILL_COL_KEY} from '../constants'

export const findHoveredRowIndices = (
  table: HistogramTable,
  hoverX: number,
  hoverY: number,
  xScale: Scale,
  yScale: Scale
) => {
  if (!hoverX || !hoverY) {
    return null
  }

  const xMinCol = table.columns.xMin.data
  const xMaxCol = table.columns.xMax.data
  const yMaxCol = table.columns.yMax.data
  const dataX = xScale.invert(hoverX)
  const dataY = yScale.invert(hoverY)

  // Find all bins whose x extent contain the mouse x position
  const hoveredRowIndices = range(0, xMinCol.length).filter(
    i => xMinCol[i] <= dataX && xMaxCol[i] > dataX
  )

  // If the mouse y position is above every one of those bars, then the mouse
  // isn't hovering over them
  if (!hoveredRowIndices.some(i => yMaxCol[i] >= dataY)) {
    return null
  }

  return hoveredRowIndices
}

export const getTooltipData = (
  hoveredRowIndices: number[],
  table: HistogramTable,
  xColKey: string,
  fillColKeys: string[],
  getValueFormatter: (colKey: string) => (x: any) => string,
  fillScale: Scale<string, string>
): TooltipData => {
  if (!hoveredRowIndices || hoveredRowIndices.length === 0) {
    return null
  }

  const xMinCol = getNumericColumn(table, 'xMin')
  const xMaxCol = getNumericColumn(table, 'xMax')
  const yMinCol = getNumericColumn(table, 'yMin')
  const yMaxCol = getNumericColumn(table, 'yMax')
  const groupCol = getGroupingColumn(table, FILL_COL_KEY)
  const colors = hoveredRowIndices.map(i => fillScale(groupCol.data[i]))
  const xFormatter = getValueFormatter(xColKey)
  const countFormatter = getValueFormatter('yMin')

  const xColumn = {
    key: xColKey,
    name: xColKey,
    type: 'number' as ColumnType,
    colors,
    values: hoveredRowIndices.map(i =>
      getRangeLabel(xMinCol.data[i], xMaxCol.data[i], xFormatter)
    ),
  }

  const countColumn = {
    key: 'count',
    name: 'count',
    type: 'number' as ColumnType,
    colors,
    values: hoveredRowIndices.map(i =>
      countFormatter(yMaxCol.data[i] - yMinCol.data[i])
    ),
  }

  const fillColumns = getTooltipGroupColumns(
    table,
    hoveredRowIndices,
    fillColKeys,
    getValueFormatter,
    colors
  )

  return [xColumn, countColumn, ...fillColumns]
}
