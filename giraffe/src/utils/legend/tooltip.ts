import {
  BandLayerSpec,
  BandLineMap,
  DomainLabel,
  LatestIndexMap,
  LegendColumn,
  LegendData,
  LinePosition,
  NumericColumnData,
  Scale,
  Table,
} from '../../types'
import {
  FILL,
  LINE_COUNT,
  STACKED_LINE_CUMULATIVE,
  TIME,
  VALUE,
} from '../../constants/columnKeys'

import {isVoid} from '../isVoid'
import {createLatestBandIndices, getTooltipBandGroupColumns} from './band'
import {formatLegendValues} from './format'
import {sortBandLines, sortIndicesByValueColumn} from './sort'

const orderDataByValue = (
  originalOrder: number[],
  nextOrder: number[],
  data: Array<any>
) => {
  const dataMap = {}
  originalOrder.forEach((place, index) => (dataMap[place] = data[index]))
  return nextOrder.map(place => dataMap[place])
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
  stackedDomainValueColumn?: NumericColumnData
): LegendData => {
  const lineValues =
    xColKey === VALUE ? table.getColumn(xColKey) : table.getColumn(yColKey)
  const sortOrder = sortIndicesByValueColumn(
    position === 'stacked' ? stackedDomainValueColumn : lineValues,
    hoveredRowIndices
  )
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
    const stackedDomainValues = stackedDomainValueColumn
      ? stackedDomainValueColumn
      : []
    tooltipAdditionalColumns.push({
      key: `_${STACKED_LINE_CUMULATIVE}`,
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
      key: `_${LINE_COUNT}`,
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

export const getBandTooltipData = (
  bandHoverIndices: BandLineMap,
  xColKey: string,
  yColKey: string,
  bandName: string,
  lowerColumnName: string,
  upperColumnName: string,
  getValueFormatter: (colKey: string) => (x: any) => string,
  fillColKeys: string[],
  spec: BandLayerSpec
): LegendData => {
  const {bandLineMap, lineData, table} = spec

  const groupColData = table.getColumn(FILL, 'number')
  const bandDimension = yColKey === TIME ? DomainLabel.Y : DomainLabel.X
  const {rowLines: rowIndices} = bandHoverIndices
  const hoveredLinesMap: LatestIndexMap = {}
  rowIndices.forEach(index => {
    hoveredLinesMap[groupColData[index]] = index
  })

  const hoveredIndices = createLatestBandIndices(
    lineData,
    bandLineMap,
    bandDimension,
    hoveredLinesMap
  )
  const bandValues =
    xColKey === VALUE ? table.getColumn(xColKey) : table.getColumn(yColKey)

  const sortedBandLineMap = sortBandLines(
    bandValues,
    bandLineMap,
    hoveredIndices
  )
  const {
    upperLines: sortedUpperLines,
    rowLines: sortedRowLines,
    lowerLines: sortedLowerLines,
  } = sortedBandLineMap

  const colors = sortedRowLines.map(line => lineData[line].fill)

  const xColumnName =
    xColKey === VALUE ? `${xColKey}:${bandName}` : table.getColumnName(xColKey)
  const yColumnName =
    yColKey === VALUE ? `${yColKey}:${bandName}` : table.getColumnName(yColKey)
  const xColData = table.getColumn(xColKey, 'number')
  const yColData = table.getColumn(yColKey, 'number')
  const xFormatter = getValueFormatter(xColKey)
  const yFormatter = getValueFormatter(yColKey)

  const tooltipXCol = {
    key: xColKey,
    name: xColumnName,
    type: table.getColumnType(xColKey),
    colors,
    values: formatLegendValues(
      xColData,
      sortedRowLines.map(line => hoveredIndices[line]),
      xFormatter
    ),
  }

  const tooltipYCol = {
    key: yColKey,
    name: yColumnName,
    type: table.getColumnType(yColKey),
    colors,
    values: formatLegendValues(
      yColData,
      sortedRowLines.map(line => hoveredIndices[line]),
      yFormatter
    ),
  }

  const tooltipAdditionalColumns = []

  if (yColKey === VALUE) {
    if (upperColumnName) {
      tooltipAdditionalColumns.push({
        key: yColKey,
        name: `${yColKey}:${upperColumnName}`,
        type: table.getColumnType(yColKey),
        colors,
        values: formatLegendValues(
          yColData,
          sortedUpperLines.map(line => hoveredIndices[line]),
          yFormatter
        ),
      })
    }

    if (lowerColumnName) {
      tooltipAdditionalColumns.push({
        key: yColKey,
        name: `${yColKey}:${lowerColumnName}`,
        type: table.getColumnType(yColKey),
        colors,
        values: formatLegendValues(
          yColData,
          sortedLowerLines.map(line => hoveredIndices[line]),
          yFormatter
        ),
      })
    }
  } else {
    if (upperColumnName) {
      tooltipAdditionalColumns.push({
        key: xColKey,
        name: `${xColKey}:${upperColumnName}`,
        type: table.getColumnType(xColKey),
        colors,
        values: formatLegendValues(
          xColData,
          sortedUpperLines.map(line => hoveredIndices[line]),
          xFormatter
        ),
      })
    }

    if (lowerColumnName) {
      tooltipAdditionalColumns.push({
        key: xColKey,
        name: `${xColKey}:${lowerColumnName}`,
        type: table.getColumnType(xColKey),
        colors,
        values: formatLegendValues(
          xColData,
          sortedLowerLines.map(line => hoveredIndices[line]),
          xFormatter
        ),
      })
    }
  }

  const fillColumns = getTooltipBandGroupColumns(
    table,
    sortedRowLines.map(line => hoveredIndices[line]),
    fillColKeys,
    getValueFormatter,
    colors
  )

  if (yColKey === VALUE) {
    return [
      tooltipXCol,
      tooltipYCol,
      ...tooltipAdditionalColumns,
      ...fillColumns,
    ]
  }
  return [tooltipYCol, tooltipXCol, ...tooltipAdditionalColumns, ...fillColumns]
}
