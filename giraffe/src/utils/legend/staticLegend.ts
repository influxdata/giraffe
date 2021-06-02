import {
  BandLayerSpec,
  Formatter,
  LayerSpec,
  LegendData,
  LineData,
  LineLayerSpec,
  LinePosition,
} from '../../types'
import {
  FILL,
  LINE_COUNT,
  STACKED_LINE_CUMULATIVE,
} from '../../constants/columnKeys'

import {getTooltipBandGroupColumns} from './band'
import {formatLegendValues} from './format'
import {sortBandLines, sortIndicesByValueColumn} from './sort'

export const getLegendData = (
  layerType: string,
  spec: LayerSpec,
  valueColumnKey: string,
  getFormatter?: (columnKey: string) => Formatter
): LegendData => {
  switch (layerType) {
    case 'line':
      const position = Array.isArray(
        (spec as LineLayerSpec).stackedDomainValueColumn
      )
        ? 'stacked'
        : 'overlaid'
      return convertLineSpec(
        spec as LineLayerSpec,
        valueColumnKey,
        getFormatter,
        position
      )

    case 'band':
      return convertBandSpec(
        spec as BandLayerSpec,
        valueColumnKey,
        getFormatter
      )

    default:
      return []
  }
}

export const convertLineSpec = (
  spec: LineLayerSpec,
  valueColumnKey: string,
  getColumnFormatter: (colKey: string) => Formatter,
  position: LinePosition
): LegendData => {
  const columnKeys = spec?.columnGroupMaps?.fill?.columnKeys
  if (!Array.isArray(columnKeys)) {
    return null
  }
  const mappings = spec?.columnGroupMaps?.fill?.mappings
  const valueFormatter = getColumnFormatter(valueColumnKey)
  const latestValueIndices = spec?.columnGroupMaps?.latestIndices
  const lineValues = spec.table.getColumn(valueColumnKey)
  const fillIndices = spec.table.getColumn(FILL)
  const lineData: LineData = spec?.lineData
  const stackedDomainValues = spec.stackedDomainValueColumn ?? []

  const sortOrder = sortIndicesByValueColumn(
    position === 'stacked' ? stackedDomainValues : lineValues,
    Object.values(latestValueIndices)
  )

  const colors = sortOrder.map(index => lineData[`${fillIndices[index]}`].fill)

  const valueColumn = {
    key: valueColumnKey,
    name: `Latest ${valueColumnKey}`,
    type: spec.table.getColumnType(valueColumnKey),
    colors,
    values: formatLegendValues(lineValues, sortOrder, valueFormatter),
  }

  const additionalColumns = []
  if (position === 'stacked') {
    additionalColumns.push({
      key: `_${STACKED_LINE_CUMULATIVE}`,
      name: STACKED_LINE_CUMULATIVE,
      type: spec.table.getColumnType(valueColumnKey),
      colors,
      values: sortOrder.map(index =>
        valueFormatter(stackedDomainValues[index])
      ),
    })

    const lineCountByGroupId = {}
    sortOrder
      .map(index => fillIndices[index])
      .sort()
      .forEach((groupId, key) => {
        lineCountByGroupId[`${groupId}`] = key + 1
      })
    additionalColumns.push({
      key: `_${LINE_COUNT}`,
      name: LINE_COUNT,
      type: spec.table.getColumnType(valueColumnKey),
      colors,
      values: sortOrder.map(
        index => lineCountByGroupId[`${fillIndices[index]}`]
      ),
    })
  }

  const fillColumns = columnKeys.map(key => {
    const fillColumn: string[] = sortOrder.map(index => {
      const columns = mappings[`${fillIndices[index]}`]
      const fillFormatter = getColumnFormatter(key)
      return fillFormatter(columns[key])
    })

    return {
      key,
      name: key,
      type: spec.table.getColumnType(key),
      values: fillColumn,
      colors,
    }
  })

  return [valueColumn, ...additionalColumns, ...fillColumns]
}

export const convertBandSpec = (
  spec: BandLayerSpec,
  valueColumnKey: string,
  getColumnFormatter: (colKey: string) => Formatter
): LegendData => {
  const columnKeys = spec?.columnGroupMaps?.fill?.columnKeys
  if (!Array.isArray(columnKeys)) {
    return null
  }
  const valueFormatter = getColumnFormatter(valueColumnKey)
  const {latestIndices} = spec?.columnGroupMaps
  const lineData: LineData = spec?.lineData

  const bandValues = spec.table.getColumn(valueColumnKey)
  const {bandName, upperColumnName, lowerColumnName} = spec
  const {bandLineMap} = spec

  const sortedBandLineMap = sortBandLines(
    bandValues,
    bandLineMap,
    latestIndices
  )
  const {
    upperLines: sortedUpperLines,
    rowLines: sortedRowLines,
    lowerLines: sortedLowerLines,
  } = sortedBandLineMap

  const colors = sortedRowLines.map(line => lineData[line].fill)

  const rowValuesColumn = {
    key: valueColumnKey,
    name: `Latest ${valueColumnKey}:${bandName}`,
    type: spec.table.getColumnType(valueColumnKey),
    colors,
    values: formatLegendValues(
      bandValues,
      sortedRowLines.map(line => latestIndices[line]),
      valueFormatter
    ),
  }

  const tooltipAdditionalColumns = []

  if (upperColumnName) {
    tooltipAdditionalColumns.push({
      key: valueColumnKey,
      name: `${valueColumnKey}:${upperColumnName}`,
      type: spec.table.getColumnType(valueColumnKey),
      colors,
      values: formatLegendValues(
        bandValues,
        sortedUpperLines.map(line => latestIndices[line]),
        valueFormatter
      ),
    })
  }

  if (lowerColumnName) {
    tooltipAdditionalColumns.push({
      key: valueColumnKey,
      name: `${valueColumnKey}:${lowerColumnName}`,
      type: spec.table.getColumnType(valueColumnKey),
      colors,
      values: formatLegendValues(
        bandValues,
        sortedLowerLines.map(line => latestIndices[line]),
        valueFormatter
      ),
    })
  }

  const fillColumns = getTooltipBandGroupColumns(
    spec.table,
    sortedRowLines.map(line => latestIndices[line]),
    columnKeys,
    getColumnFormatter,
    colors
  )

  return [rowValuesColumn, ...tooltipAdditionalColumns, ...fillColumns]
}
