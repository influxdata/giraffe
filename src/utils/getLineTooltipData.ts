import {getNumericColumn} from './getNumericColumn'
import {getGroupColumn} from './getGroupColumn'
import {TooltipData, Table, Scale} from '../types'

export const getLineTooltipData = (
  table: Table,
  hoveredRowIndices: number[],
  xColKey: string,
  yColKey: string,
  fillColKeys: string[],
  fillScale: Scale<string, string>
): TooltipData => {
  if (!hoveredRowIndices || hoveredRowIndices.length === 0) {
    return null
  }

  const {data: xColData} = getNumericColumn(table, xColKey)
  const {data: groupColData} = getGroupColumn(table)
  const yCol = getNumericColumn(table, yColKey)

  const tooltipYCol = {
    name: yColKey,
    type: yCol.type,
    colors: [],
    values: hoveredRowIndices.map(i => yCol.data[i]),
  }

  const fillColumns = fillColKeys.map(name => ({
    name,
    type: table.columns[name].type,
    values: hoveredRowIndices.map(i => table.columns[name].data[i]),
    colors: hoveredRowIndices.map(i => fillScale(groupColData[i])),
  }))

  const x = xColData[hoveredRowIndices[0]]

  return {
    xMin: x,
    xMax: x,
    columns: [...fillColumns, tooltipYCol],
  }
}
