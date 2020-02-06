import {
  LinePosition,
  LineData,
  TooltipData,
  TooltipColumn,
  Scale,
  Table,
  DomainLabel,
} from '../types'
import {
  FILL,
  STACKED_LINE_CUMULATIVE,
  LINE_COUNT,
} from '../constants/columnKeys'

import {getDomainDataFromLines} from './lineData'

const isVoid = (x: any) => x === null || x === undefined

const orderDataByValue = (
  originalOrder: number[],
  nextOrder: number[],
  data: Array<any>
) => {
  const map = {}
  originalOrder.forEach((key, i) => (map[key] = data[i]))
  return nextOrder.map(index => map[index])
}

const getDataSortOrder = (
  lineData: LineData,
  hoveredRowIndices: number[],
  position: LinePosition
): number[] => {
  if (position === 'overlaid') {
    return hoveredRowIndices
  }
  const map = {}
  const values = Object.keys(lineData).reduce(
    (accum, value) => accum.concat(lineData[value][DomainLabel.Y]),
    []
  )
  const sortable = []
  hoveredRowIndices.forEach(hoverRowIndex => {
    if (!map[values[hoverRowIndex]]) {
      map[values[hoverRowIndex]] = []
    }
    map[values[hoverRowIndex]].push(hoverRowIndex)
    sortable.push(values[hoverRowIndex])
  })
  sortable.sort((first, second) => second - first)
  return sortable.map(value => map[value].shift())
}

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
  fillScale: Scale<number, string>,
  position?: LinePosition,
  lineData?: LineData
): TooltipData => {
  const sortOrder = getDataSortOrder(lineData, hoveredRowIndices, position)
  const xColData = table.getColumn(xColKey, 'number')
  const yColData = table.getColumn(yColKey, 'number')
  const groupColData = table.getColumn(groupColKey, 'number')
  const colors = orderDataByValue(
    hoveredRowIndices,
    sortOrder,
    hoveredRowIndices.map(i => fillScale(groupColData[i]))
  )
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
    values: orderDataByValue(
      hoveredRowIndices,
      sortOrder,
      hoveredRowIndices.map(i => yFormatter(yColData[i]))
    ),
  }

  const tooltipAdditionalColumns = []
  if (position === 'stacked') {
    tooltipAdditionalColumns.push({
      key: STACKED_LINE_CUMULATIVE,
      name: STACKED_LINE_CUMULATIVE,
      type: table.getColumnType(yColKey),
      colors,
      values: orderDataByValue(
        hoveredRowIndices,
        sortOrder,
        hoveredRowIndices.map(i => {
          const cumulativeColData = getDomainDataFromLines(
            lineData,
            DomainLabel.Y
          )
          return yFormatter(cumulativeColData[i])
        })
      ),
    })
    tooltipAdditionalColumns.push({
      key: LINE_COUNT,
      name: LINE_COUNT,
      type: table.getColumnType(FILL),
      colors,
      values: orderDataByValue(
        hoveredRowIndices,
        sortOrder,
        hoveredRowIndices.map(i => Number(table.getColumn(FILL)[i]) + 1)
      ),
    })
  }

  const fillColumns = getTooltipGroupColumns(
    table,
    sortOrder,
    fillColKeys,
    getValueFormatter,
    colors
  )

  return [tooltipXCol, tooltipYCol, ...tooltipAdditionalColumns, ...fillColumns]
}
