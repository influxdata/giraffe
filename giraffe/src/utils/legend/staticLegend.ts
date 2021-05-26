import {
  BandLayerSpec,
  ColumnData,
  DomainLabel,
  Formatter,
  LayerSpec,
  LegendData,
  LineData,
  LineLayerSpec,
  LinePosition,
  StaticLegend,
} from '../../types'
import {
  FILL,
  LINE_COUNT,
  STACKED_LINE_CUMULATIVE,
} from '../../constants/columnKeys'

import {getTooltipBandGroupColumns} from './band'
import {getDataSortOrder} from './sort'

export const formatColumnValuesAsLatest = (
  values: ColumnData,
  indexes: Array<number>,
  formatter: Formatter
): Array<string> => {
  if (!Array.isArray(indexes)) {
    return []
  }
  return indexes.map(index => {
    const latestValue = values[index]
    if (latestValue === latestValue) {
      return formatter(latestValue)
    }
    return ''
  })
}

export const getLegendData = (
  layerType: string,
  staticLegend: StaticLegend,
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
        staticLegend,
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
  staticLegend: StaticLegend,
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
  const {valueAxis} = staticLegend
  const valueFormatter = getColumnFormatter(valueColumnKey)
  const latestValueIndices = spec?.columnGroupMaps?.latestIndices
  const lineValues = spec.table.getColumn(valueColumnKey)
  const fillIndices = spec.table.getColumn(FILL)
  const lineData: LineData = spec?.lineData

  const domainLabel = valueAxis === 'x' ? DomainLabel.X : DomainLabel.Y
  const sortOrder = getDataSortOrder(
    lineData,
    Object.values(latestValueIndices),
    domainLabel
  )

  const colors = sortOrder.map(index => lineData[`${fillIndices[index]}`].fill)

  const valueColumn = {
    key: valueColumnKey,
    name: `Latest ${valueColumnKey}`,
    type: spec.table.getColumnType(valueColumnKey),
    colors,
    values: formatColumnValuesAsLatest(lineValues, sortOrder, valueFormatter),
  }

  const additionalColumns = []
  if (position === 'stacked') {
    const stackedDomainValues = spec.stackedDomainValueColumn ?? []
    additionalColumns.push({
      key: valueColumnKey,
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
      key: valueColumnKey,
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
  const fillIndices = spec.table.getColumn(FILL)
  const lineData: LineData = spec?.lineData

  const bandValues = spec.table.getColumn(valueColumnKey)
  const {bandName, upperColumnName, lowerColumnName} = spec
  const {bandIndexMap} = spec
  const {upperIndices, rowIndices, lowerIndices} = bandIndexMap

  const colors = getDataSortOrder(
    lineData,
    rowIndices.map(index => latestIndices[index])
  ).map(index => lineData[`${fillIndices[index]}`].fill)

  const rowValuesColumn = {
    key: valueColumnKey,
    name: `Latest ${valueColumnKey}:${bandName}`,
    type: spec.table.getColumnType(valueColumnKey),
    colors,
    values: formatColumnValuesAsLatest(
      bandValues,
      getDataSortOrder(
        lineData,
        rowIndices.map(index => latestIndices[index])
      ),
      valueFormatter
    ),
  }

  const upperValuesColumn = {
    key: valueColumnKey,
    name: `${valueColumnKey}:${upperColumnName}`,
    type: spec.table.getColumnType(valueColumnKey),
    colors,
    values: formatColumnValuesAsLatest(
      bandValues,
      getDataSortOrder(
        lineData,
        upperIndices.map(index => latestIndices[index])
      ),
      valueFormatter
    ),
  }

  const lowerValuesColumn = {
    key: valueColumnKey,
    name: `${valueColumnKey}:${lowerColumnName}`,
    type: spec.table.getColumnType(valueColumnKey),
    colors,
    values: formatColumnValuesAsLatest(
      bandValues,
      getDataSortOrder(
        lineData,
        lowerIndices.map(index => latestIndices[index])
      ),
      valueFormatter
    ),
  }

  const fillColumns = getTooltipBandGroupColumns(
    spec.table,
    getDataSortOrder(
      lineData,
      rowIndices.map(index => latestIndices[index])
    ),
    columnKeys,
    getColumnFormatter,
    colors
  )

  return [rowValuesColumn, upperValuesColumn, lowerValuesColumn, ...fillColumns]
}
