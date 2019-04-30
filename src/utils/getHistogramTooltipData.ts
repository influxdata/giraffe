import {TooltipData, Scale, HistogramTable, ColumnType} from '../types'
import {getNumericColumn} from './getNumericColumn'
import {getGroupColumn} from './getGroupColumn'

const isVoid = (x: any) => x === null || x === undefined

const getRangeLabel = (min: number, max: number, formatter): string => {
  let label = ''

  if (isVoid(min) || isVoid(max)) {
    label = ''
  } else if (min === max) {
    label = formatter(min)
  } else {
    label = `${formatter(min)} – ${formatter(max)}`
  }

  return label
}

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
  const groupCol = getGroupColumn(table)

  const colors = hoveredRowIndices.map(i => fillScale(groupCol.data[i]))

  const xColumn = {
    name: xColKey,
    type: 'float' as ColumnType,
    colors,
    values: hoveredRowIndices.map(i =>
      getRangeLabel(xMinCol.data[i], xMaxCol.data[i], xTickFormatter)
    ),
  }

  const countColumn = {
    name: 'count',
    type: 'uint' as ColumnType,
    colors,
    values: hoveredRowIndices.map(i =>
      yTickFormatter(yMaxCol.data[i] - yMinCol.data[i])
    ),
  }

  const fillColumns = fillColKeys.map(name => ({
    name,
    type: table.columns[name].type,
    colors,
    values: hoveredRowIndices.map(i => String(table.columns[name].data[i])),
  }))

  return [xColumn, countColumn, ...fillColumns]
}
