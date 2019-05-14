import {range} from 'd3-array'

import {TooltipData, ColumnType, HeatmapTable} from '../types'
import {getRangeLabel} from './tooltip'

export const findHoveredRowIndices = (
  table: HeatmapTable,
  dataX: number,
  dataY: number
): number[] => {
  const xMinColData = table.columns.xMin.data
  const xMaxColData = table.columns.xMax.data
  const yMinColData = table.columns.yMin.data
  const yMaxColData = table.columns.yMax.data
  const countColData = table.columns.count.data

  const hoveredRowIndices = range(xMinColData.length).filter(
    i =>
      xMinColData[i] <= dataX &&
      xMaxColData[i] > dataX &&
      yMinColData[i] <= dataY &&
      yMaxColData[i] > dataY &&
      countColData[i] !== 0
  )

  return hoveredRowIndices
}

export const getTooltipData = (
  hoveredRowIndices: number[] | null,
  xColName: string,
  yColName: string,
  xTickFormatter: (tick: number) => string,
  yTickFormatter: (tick: number) => string,
  table: HeatmapTable
): TooltipData => {
  if (!hoveredRowIndices || hoveredRowIndices.length === 0) {
    return null
  }

  const xMinColData = table.columns.xMin.data
  const xMaxColData = table.columns.xMax.data
  const yMinColData = table.columns.yMin.data
  const yMaxColData = table.columns.yMax.data
  const countColData = table.columns.count.data

  const xColumn = {
    key: xColName,
    name: xColName,
    type: 'number' as ColumnType,
    colors: null,
    values: hoveredRowIndices.map(i =>
      getRangeLabel(xMinColData[i], xMaxColData[i], xTickFormatter)
    ),
  }

  const yColumn = {
    key: yColName,
    name: yColName,
    type: 'number' as ColumnType,
    colors: null,
    values: hoveredRowIndices.map(i =>
      getRangeLabel(yMinColData[i], yMaxColData[i], yTickFormatter)
    ),
  }

  const countColumn = {
    key: 'count',
    name: 'count',
    type: 'number' as ColumnType,
    colors: null,
    values: hoveredRowIndices.map(i => String(countColData[i])),
  }

  return [xColumn, yColumn, countColumn]
}
