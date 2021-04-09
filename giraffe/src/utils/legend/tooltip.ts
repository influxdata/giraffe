import {
  DomainLabel,
  LineData,
  LinePosition,
  NumericColumnData,
  Scale,
  Table,
  LegendColumn,
  LegendData,
} from '../../types'
import {
  FILL,
  STACKED_LINE_CUMULATIVE,
  LINE_COUNT,
  RESULT,
  VALUE,
} from '../../constants/columnKeys'

import {BandHoverIndices} from '../bandHover'

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
  if (!position || position === 'overlaid') {
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
): LegendColumn[] => {
  return groupColKeys.map(key => {
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
}

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
  lineData?: LineData,
  stackedDomainValueColumn?: NumericColumnData
): LegendData => {
  const sortOrder = lineData
    ? getDataSortOrder(lineData, hoveredRowIndices, position)
    : hoveredRowIndices
  const xColData = table.getColumn(xColKey, 'number')
  const yColData = table.getColumn(yColKey, 'number')
  const groupColData = table.getColumn(groupColKey, 'number')

  console.log('ack-i: lineData', lineData)
  console.log('ack-i: about to arder data by value: ', hoveredRowIndices)
  console.log('ack-i: sortorder?', sortOrder)
  console.log('ack-i: fillscale???,', fillScale)

  const colors = orderDataByValue(
    hoveredRowIndices,
    sortOrder,
    hoveredRowIndices.map(i => fillScale(groupColData[i]))
  )

  console.log('ack-i: got colors:', colors)
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
    const stackedDomainValues = stackedDomainValueColumn
      ? stackedDomainValueColumn
      : []
    tooltipAdditionalColumns.push({
      key: yColKey,
      name: STACKED_LINE_CUMULATIVE,
      type: table.getColumnType(yColKey),
      colors,
      values: orderDataByValue(
        hoveredRowIndices,
        sortOrder,
        hoveredRowIndices.map(i => yFormatter(stackedDomainValues[i]))
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

const getTooltipBandGroupColumns = (
  table: Table,
  rowIndices: number[],
  groupColKeys: string[],
  getValueFormatter: (colKey: string) => (x: any) => string,
  rowColors: string[] | null
): LegendColumn[] => {
  return groupColKeys.reduce((accum, key) => {
    if (key === RESULT) {
      return accum
    }
    const colData = table.getColumn(key)
    const formatter = getValueFormatter(key)

    accum.push({
      key,
      name: table.getColumnName(key),
      type: table.getColumnType(key),
      colors: rowColors,
      values: rowIndices.map(i =>
        !isVoid(colData[i]) ? formatter(colData[i]) : null
      ),
    })
    return accum
  }, [])
}

export const getBandTooltipData = (
  bandHoverIndices: BandHoverIndices,
  table: Table,
  xColKey: string,
  yColKey: string,
  bandName: string,
  lowerColumnName: string,
  upperColumnName: string,
  getValueFormatter: (colKey: string) => (x: any) => string,
  fillColKeys: string[],
  colors: string[],
  lineData: LineData
): LegendData => {
  const {
    rowIndices: hoveredRowIndices,
    lowerIndices,
    upperIndices,
  } = bandHoverIndices

  const xColumnName =
    xColKey === VALUE ? `${xColKey}:${bandName}` : table.getColumnName(xColKey)
  const yColumnName =
    yColKey === VALUE ? `${yColKey}:${bandName}` : table.getColumnName(yColKey)
  const sortOrder = lineData
    ? getDataSortOrder(lineData, hoveredRowIndices, null)
    : hoveredRowIndices
  const minOrder = lineData
    ? getDataSortOrder(lineData, lowerIndices, null)
    : lowerIndices
  const maxOrder = lineData
    ? getDataSortOrder(lineData, upperIndices, null)
    : upperIndices
  const xColData = table.getColumn(xColKey, 'number')
  const yColData = table.getColumn(yColKey, 'number')
  const xFormatter = getValueFormatter(xColKey)
  const yFormatter = getValueFormatter(yColKey)

  const tooltipXCol = {
    key: xColKey,
    name: xColumnName,
    type: table.getColumnType(xColKey),
    colors,
    values: hoveredRowIndices.map(i => xFormatter(xColData[i])),
  }

  const tooltipYCol = {
    key: yColKey,
    name: yColumnName,
    type: table.getColumnType(yColKey),
    colors,
    values: orderDataByValue(
      hoveredRowIndices,
      sortOrder,
      hoveredRowIndices.map(i => yFormatter(yColData[i]))
    ),
  }

  const tooltipAdditionalColumns = []

  if (yColKey === VALUE) {
    if (lowerColumnName) {
      tooltipAdditionalColumns.push({
        key: yColKey,
        name: `${yColKey}:${lowerColumnName}`,
        type: table.getColumnType(yColKey),
        colors,
        values: orderDataByValue(
          lowerIndices,
          minOrder,
          lowerIndices.map(i => yFormatter(yColData[i]))
        ),
      })
    }

    if (upperColumnName) {
      tooltipAdditionalColumns.push({
        key: yColKey,
        name: `${yColKey}:${upperColumnName}`,
        type: table.getColumnType(yColKey),
        colors,
        values: orderDataByValue(
          upperIndices,
          maxOrder,
          upperIndices.map(i => yFormatter(yColData[i]))
        ),
      })
    }
  } else {
    if (lowerColumnName) {
      tooltipAdditionalColumns.push({
        key: xColKey,
        name: `${xColKey}:${lowerColumnName}`,
        type: table.getColumnType(xColKey),
        colors,
        values: orderDataByValue(
          lowerIndices,
          minOrder,
          lowerIndices.map(i => xFormatter(xColData[i]))
        ),
      })
    }

    if (upperColumnName) {
      tooltipAdditionalColumns.push({
        key: xColKey,
        name: `${xColKey}:${upperColumnName}`,
        type: table.getColumnType(xColKey),
        colors,
        values: orderDataByValue(
          upperIndices,
          maxOrder,
          upperIndices.map(i => xFormatter(xColData[i]))
        ),
      })
    }
  }

  const fillColumns = getTooltipBandGroupColumns(
    table,
    sortOrder,
    fillColKeys,
    getValueFormatter,
    colors
  )

  if (yColKey === VALUE) {
    return [
      tooltipXCol,
      ...tooltipAdditionalColumns,
      tooltipYCol,
      ...fillColumns,
    ]
  }
  return [tooltipYCol, ...tooltipAdditionalColumns, tooltipXCol, ...fillColumns]
}
