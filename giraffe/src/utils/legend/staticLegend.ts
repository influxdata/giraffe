import {
  DomainLabel,
  Formatter,
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

import {getDataSortOrder} from './sort'

export const convertLineSpec = (
  staticLegend: StaticLegend,
  spec: LineLayerSpec,
  getColumnFormatter: (colKey: string) => Formatter,
  valueColumnKey: string,
  position: LinePosition
): LegendData => {
  const {valueAxis} = staticLegend
  const valueFormatter = getColumnFormatter(valueColumnKey)
  const mappings = spec?.columnGroupMaps?.fill?.mappings
  const latestValueIndices = spec?.columnGroupMaps?.latestIndices
  const lineValues = spec.table.getColumn(valueColumnKey)
  const fillIndices = spec.table.getColumn(FILL)
  const lineData: LineData = spec?.lineData

  const domainLabel = valueAxis === 'x' ? DomainLabel.X : DomainLabel.Y
  const sortOrder = getDataSortOrder(
    lineData,
    Object.values(latestValueIndices[domainLabel]),
    position,
    domainLabel
  )

  const colors = sortOrder.map(index => lineData[`${fillIndices[index]}`].fill)
  const values = sortOrder.map(index => {
    const latestValue = lineValues[index]
    if (latestValue === latestValue) {
      return valueFormatter(latestValue)
    }
    return ''
  })

  const {columnKeys} = spec.columnGroupMaps.fill
  if (!Array.isArray(columnKeys)) {
    return null
  }

  const valueColumn = {
    key: valueColumnKey,
    name: `Latest ${valueColumnKey}`,
    type: spec.table.getColumnType(valueColumnKey),
    colors,
    values,
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
    const column: string[] = mappings.map(fillColumn => {
      const fillFormatter = getColumnFormatter(key)
      return fillFormatter(fillColumn[key])
    })

    return {
      key,
      name: key,
      type: spec.table.getColumnType(key),
      values: column,
      colors,
    }
  })

  return [valueColumn, ...additionalColumns, ...fillColumns]
}
