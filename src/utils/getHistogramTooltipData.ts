import {TooltipData, Scale, HistogramTable, ColumnType} from '../types'
import {getGroupColumn} from './getGroupColumn'

export const getHistogramTooltipData = (
  hoveredRowIndices: number[],
  table: HistogramTable,
  fillColKeys: string[],
  fillScale: Scale<string, string>
): TooltipData => {
  if (!hoveredRowIndices || hoveredRowIndices.length === 0) {
    return null
  }

  const xMinCol = table.columns.xMin.data
  const xMaxCol = table.columns.xMax.data
  const yMinCol = table.columns.yMin.data
  const yMaxCol = table.columns.yMax.data
  const {data: groupCol} = getGroupColumn(table)

  const countColumn = {
    name: 'count',
    type: 'uint' as ColumnType,
    colors: [],
    values: hoveredRowIndices.map(i => yMaxCol[i] - yMinCol[i]),
  }

  const fillColumns = fillColKeys.map(name => ({
    name,
    type: table.columns[name].type,
    values: hoveredRowIndices.map(i => table.columns[name].data[i]),
    colors: hoveredRowIndices.map(i => fillScale(groupCol[i])),
  }))

  const tooltipProps: TooltipData = {
    xMin: xMinCol[hoveredRowIndices[0]],
    xMax: xMaxCol[hoveredRowIndices[0]],
    columns: [countColumn, ...fillColumns],
  }

  return tooltipProps
}
