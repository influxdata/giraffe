import {LegendData, LineData} from '../../types'
import {FILL} from '../../constants/columnKeys'

export const convertLineSpec = (config, spec, columnFormatter): LegendData => {
  const staticLegendConfig = config.staticLegend
  const tooltipLayer = staticLegendConfig.layer ?? 0
  const layerConfig = config.layers[tooltipLayer]

  const valueAxis = staticLegendConfig.valueAxis ?? 'y'

  const valueKey = layerConfig[valueAxis]
  const valueFormatter = columnFormatter(valueKey)

  const mappings = spec?.columnGroupMaps?.fill?.mappings

  const lineData: LineData = spec?.lineData

  const colors = Object.values(lineData).map(value => value?.fill)

  const peek = (arr: number[]): number => {
    const len = arr.length
    if (len >= 1) {
      return arr[len - 1]
    }
    return 0
  }

  const dimension = valueAxis === 'x' ? 'xs' : 'ys'

  const values = Object.values(lineData).map(line =>
    valueFormatter(peek(line[dimension]))
  )

  const objKeys = spec?.columnGroupMaps?.fill?.columnKeys

  if (!objKeys) {
    return null
  }

  const legendLines = objKeys.map(key => {
    const values: string[] = mappings.map(dataLine => dataLine[key])

    return {
      key,
      name: key,
      type: spec.table.getColumnType(FILL),
      values,
      colors,
    }
  })

  const valueLine = {
    key: valueKey,
    name: `Latest ${valueKey}`,
    type: spec.table.getColumnType(valueKey),
    colors,
    values,
  }

  const result = [valueLine, ...legendLines]

  return result
}
