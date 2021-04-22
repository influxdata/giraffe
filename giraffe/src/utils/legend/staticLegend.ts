import {
  Formatter,
  LegendData,
  LineLayerSpec,
  LineData,
  StaticLegend,
} from '../../types'

const peek = (arr: number[]): number => {
  if (Array.isArray(arr) && arr.length >= 1) {
    return arr[arr.length - 1]
  }
  return NaN
}

export const convertLineSpec = (
  staticLegend: StaticLegend,
  spec: LineLayerSpec,
  getColumnFormatter: (colKey: string) => Formatter,
  valueColumnKey: string
): LegendData => {
  const {valueAxis} = staticLegend
  const valueFormatter = getColumnFormatter(valueColumnKey)
  const mappings = spec?.columnGroupMaps?.fill?.mappings
  const lineData: LineData = spec?.lineData

  const colors = Object.values(lineData).map(line => line.fill)

  const propertyName = valueAxis === 'x' ? 'xs' : 'ys'

  const values = Object.values(lineData).map(line => {
    const latestValue = peek(line[propertyName])
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

  const legendColumns = columnKeys.map(key => {
    // TODO: should be using formatter from config
    const column: string[] = mappings.map(fillColumn => fillColumn[key])

    return {
      key,
      name: key,
      type: spec.table.getColumnType(key),
      values: column,
      colors,
    }
  })

  const result = [valueColumn, ...legendColumns]

  return result
}
