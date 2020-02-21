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
  const dataMap = {}
  originalOrder.forEach((place, index) => (dataMap[place] = data[index]))
  return nextOrder.map(place => dataMap[place])
}

const getDataSortOrder = (
  lineData: LineData,
  hoveredRowIndices: number[],
  position: LinePosition
): number[] => {
  if (position === 'overlaid') {
    return hoveredRowIndices
  }
  const dataMap = {}
  const measurementValues = Object.keys(lineData).reduce(
    (accumulator, id) => accumulator.concat(lineData[id][DomainLabel.Y]),
    []
  )
  const sortable = []
  hoveredRowIndices.forEach(hoveredRowIndex => {
    if (!dataMap[measurementValues[hoveredRowIndex]]) {
      dataMap[measurementValues[hoveredRowIndex]] = []
    }
    dataMap[measurementValues[hoveredRowIndex]].push(hoveredRowIndex)
    sortable.push(measurementValues[hoveredRowIndex])
  })
  sortable.sort((first, second) => second - first)
  return sortable.map(measurement => dataMap[measurement].shift())
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
      key: yColKey,
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

    const lineCountByGroupId = {}
    hoveredRowIndices
      .map(hoveredRowIndex => groupColData[hoveredRowIndex])
      .sort()
      .forEach((groupId, key) => (lineCountByGroupId[groupId] = key + 1))
    tooltipAdditionalColumns.push({
      key: yColKey,
      name: LINE_COUNT,
      type: table.getColumnType(FILL),
      colors,
      values: orderDataByValue(
        hoveredRowIndices,
        sortOrder,
        hoveredRowIndices.map(
          hoveredRowIndex => lineCountByGroupId[groupColData[hoveredRowIndex]]
        )
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
