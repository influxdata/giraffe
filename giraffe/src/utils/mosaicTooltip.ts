import {range} from 'd3-array'

import {getRangeLabel} from './tooltip'
import {X_MIN, X_MAX, FILL, SERIES} from '../constants/columnKeys'
import {
  Table,
  Scale,
  TooltipData,
  TooltipColumn,
  ColumnGroupMap,
} from '../types'

export const findHoveredBoxes = (
  boxTable: Table,
  hoverX: number | null,
  hoverY: number | null,
  xScale: Scale<number, number>,
  yScale: Scale<number, number>,
  yDomain: number[]
): number[] => {
  if (!hoverX || !hoverY) {
    return []
  }
  const xMinData = boxTable.getColumn(X_MIN, 'number')
  const xMaxData = boxTable.getColumn(X_MAX, 'number')
  const dataX = xScale.invert(hoverX)
  const dataY = yScale.invert(hoverY)
  // Find all boxes whose x extent contain the mouse x position
  const xIndices = range(0, xMinData.length).filter(
    i => xMinData[i] <= dataX && xMaxData[i] > dataX
  )

  for (let i = 0; i < yDomain[1]; i++) {
    const yMin = yScale(i + 1)
    const yMax = yScale(i)

    if (
      xIndices[i] != undefined &&
      yMin < yScale(dataY) &&
      yMax >= yScale(dataY)
    ) {
      return [xIndices[i]] // isn't there some value to referring to this as xyIndices for clarity?
    }
  }
  // handles the case where the loop didn't return early.
  return []
}

export const getMosaicTooltipData = (
  hoveredBoxRows: number[],
  boxTable: Table,
  inputTable: Table,
  xColKey: string,
  yColKey: string,
  fillGroupMap: ColumnGroupMap,
  fillScale: Scale<number, string>,
  columnFormatter: (colKey: string) => (x: any) => string
): TooltipData => {
  const xMinCol = boxTable.getColumn(X_MIN, 'number')
  const xMaxCol = boxTable.getColumn(X_MAX, 'number')
  const valCol = (boxTable.getColumn(FILL, 'string') as unknown) as Scale<
    number,
    number
  >
  const yCol = boxTable.getColumn(SERIES, 'string')
  const xFormatter = columnFormatter(xColKey)
  const yFormatter = columnFormatter(yColKey)
  const valFormatter = columnFormatter(FILL)
  const colors = hoveredBoxRows.map(i => fillScale(valCol[i]))

  const xTooltipColumn: TooltipColumn = {
    key: xColKey,
    name: inputTable.getColumnName(xColKey),
    type: inputTable.getColumnType(xColKey),
    colors,
    values: hoveredBoxRows.map(i =>
      getRangeLabel(xMinCol[i], xMaxCol[i], xFormatter)
    ),
  }

  const yTooltipColumn: TooltipColumn = {
    key: yColKey,
    name: inputTable.getColumnName(yColKey),
    type: inputTable.getColumnType(yColKey),
    colors,
    values: hoveredBoxRows.map(i => yFormatter(yCol[i])),
  }

  const durationTooltipColumn: TooltipColumn = {
    key: 'duration column',
    name: 'Duration(s)',
    type: 'number',
    colors,
    values: hoveredBoxRows.map(
      i => (((xMaxCol[i] - xMinCol[i]) / 1000) as unknown) as string
    ),
  }

  const groupTooltipColumns = fillGroupMap.columnKeys.map(key => ({
    key,
    name: inputTable.getColumnName(key),
    type: inputTable.getColumnType(key),
    colors,
    values: hoveredBoxRows.map(i => valFormatter(valCol[i])),
  }))

  const tooltipColumns = [
    xTooltipColumn,
    yTooltipColumn,
    durationTooltipColumn,
    ...groupTooltipColumns,
  ]

  return tooltipColumns
}
