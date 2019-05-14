import {TooltipData, Scale, HistogramTable, ColumnType} from '../types'
import {getNumericColumn} from './getNumericColumn'
import {getGroupingColumn} from './getGroupingColumn'
import {getRangeLabel} from './tooltip'
import {FILL_COL_KEY} from '../constants'

export const getHistogramTooltipData = (
  hoveredRowIndices: number[],
  table: HistogramTable,
  xColKey: string,
  fillColKeys: string[],
  xTickFormatter: (tick: number) => string,
  yTickFormatter: (tick: number) => string,
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

  const xColumn = {
    key: xColKey,
    name: xColKey,
    type: 'number' as ColumnType,
    colors,
    values: hoveredRowIndices.map(i =>
      getRangeLabel(xMinCol.data[i], xMaxCol.data[i], xTickFormatter)
    ),
  }

  const countColumn = {
    key: 'count',
    name: 'count',
    type: 'number' as ColumnType,
    colors,
    values: hoveredRowIndices.map(i =>
      yTickFormatter(yMaxCol.data[i] - yMinCol.data[i])
    ),
  }

  const fillColumns = fillColKeys.map(key => ({
    key,
    name: table.columns[key].name,
    type: table.columns[key].type,
    colors,
    values: hoveredRowIndices.map(i => String(table.columns[key].data[i])),
  }))

  return [xColumn, countColumn, ...fillColumns]
}
