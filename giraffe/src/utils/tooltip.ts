import {TooltipData, TooltipColumn, Scale, Table} from '../types'

const isVoid = (x: any) => x === null || x === undefined

export const getRangeLabel = (min: number, max: number, formatter): string => {
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

const getTooltipGroupColumns = (
  table: Table,
  rowIndices: number[],
  groupColKeys: string[],
  getValueFormatter: (colKey: string) => (x: any) => string,
  rowColors: string[] | null
): TooltipColumn[] =>
  groupColKeys.map(key => {
    const colData = table.getColumn(key)
    const formatter = getValueFormatter(key)

    return {
      key,
      name: table.getColumnName(key),
      type: table.getColumnType(key),
      colors: rowColors,
      values: rowIndices.map(i =>
        !isVoid(colData[i]) ? formatter(colData[i]) : null
      ),
    }
  })

export const getPointsTooltipData = (
  hoveredRowIndices: number[],
  table: Table,
  xColKey: string,
  yColKey: string,
  groupColKey: string,
  getValueFormatter: (colKey: string) => (x: any) => string,
  fillColKeys: string[],
  fillScale: Scale<number, string>
): TooltipData => {
  const xColData = table.getColumn(xColKey, 'number')
  const yColData = table.getColumn(yColKey, 'number')
  const groupColData = table.getColumn(groupColKey, 'number')
  const colors = hoveredRowIndices.map(i => fillScale(groupColData[i]))
  const xFormatter = getValueFormatter(xColKey)
  const yFormatter = getValueFormatter(yColKey)

  const tooltipXCol = {
    key: xColKey,
    name: table.getColumnName(xColKey),
    type: table.getColumnType(xColKey),
    colors,
    values: hoveredRowIndices.map(i => xFormatter(xColData[i])),
  }

  const tooltipYCol = {
    key: yColKey,
    name: table.getColumnName(yColKey),
    type: table.getColumnType(yColKey),
    colors,
    values: hoveredRowIndices.map(i => yFormatter(yColData[i])),
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
