import {
  Table,
  ScatterLayerConfig,
  ScatterMappings,
  ScatterScales,
  SizedConfig,
} from '../types'
import {getFillScale2} from '../utils/getFillScale'
import {getSymbolScale} from '../utils/getSymbolScale'
import {appendGroupCol} from '../utils/appendGroupCol'

export const scatterStat = (
  config: SizedConfig,
  layer: ScatterLayerConfig
): {table: Table; mappings: ScatterMappings; scales: ScatterScales} => {
  const table = appendGroupCol(config.table, layer.group)

  const {x, y, group, fill, symbol} = layer

  return {
    table: table,
    mappings: {x, y, group, fill, symbol},
    scales: {
      fill: getFillScale2(table, layer.fill, layer.colors),
      symbol: getSymbolScale(table, layer.symbol),
    },
  }
}
