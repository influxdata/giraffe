import {getNumericColumn} from './getNumericColumn'
import {getStringColumn} from './getStringColumn'
import {TooltipData, Table, Scale} from '../types'

export const getLineTooltipData = (
  hoveredRowIndices: number[],
  table: Table,
  xColKey: string,
  yColKey: string,
  groupColKey: string,
  xTickFormatter: (tick: number) => string,
  yTickFormatter: (tick: number) => string,
  fillColKeys: string[],
  fillScale: Scale<string, string>
): TooltipData => {
  const xCol = getNumericColumn(table, xColKey)
  const yCol = getNumericColumn(table, yColKey)
  const groupCol = getStringColumn(table, groupColKey)

  const tooltipXCol = {
    name: xColKey,
    type: xCol.type,
    colors: [],
    values: hoveredRowIndices.map(i => xTickFormatter(xCol.data[i])),
  }

  const tooltipYCol = {
    name: yColKey,
    type: yCol.type,
    colors: [],
    values: hoveredRowIndices.map(i => yTickFormatter(yCol.data[i])),
  }

  const fillColumns = fillColKeys.map(name => ({
    name,
    type: table.columns[name].type,
    values: hoveredRowIndices.map(i => String(table.columns[name].data[i])),
    colors: hoveredRowIndices.map(i => fillScale(groupCol.data[i])),
  }))

  return [tooltipXCol, tooltipYCol, ...fillColumns]
}
