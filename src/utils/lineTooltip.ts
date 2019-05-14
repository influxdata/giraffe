import {getNumericColumn} from './getNumericColumn'
import {getStringColumn} from './getStringColumn'
import {getTooltipGroupColumns} from './tooltip'
import {TooltipData, Table, Scale} from '../types'

export const getTooltipData = (
  hoveredRowIndices: number[],
  table: Table,
  xColKey: string,
  yColKey: string,
  groupColKey: string,
  getValueFormatter: (colKey: string) => (x: any) => string,
  fillColKeys: string[],
  fillScale: Scale<string, string>
): TooltipData => {
  const xCol = getNumericColumn(table, xColKey)
  const yCol = getNumericColumn(table, yColKey)
  const groupCol = getStringColumn(table, groupColKey)
  const colors = hoveredRowIndices.map(i => fillScale(groupCol.data[i]))
  const xFormatter = getValueFormatter(xColKey)
  const yFormatter = getValueFormatter(yColKey)

  const tooltipXCol = {
    key: xColKey,
    name: xCol.name,
    type: xCol.type,
    colors,
    values: hoveredRowIndices.map(i => xFormatter(xCol.data[i])),
  }

  const tooltipYCol = {
    key: yColKey,
    name: yCol.name,
    type: yCol.type,
    colors,
    values: hoveredRowIndices.map(i => yFormatter(yCol.data[i])),
  }

  const fillColumns = getTooltipGroupColumns(
    table,
    hoveredRowIndices,
    fillColKeys,
    getValueFormatter,
    colors
  )

  return [tooltipXCol, tooltipYCol, ...fillColumns]
}
