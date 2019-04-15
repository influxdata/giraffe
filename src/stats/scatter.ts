import {
  Table,
  ScatterLayerConfig,
  ScatterMappings,
  ScatterScales,
  SizedConfig,
} from '../types'
import {getFillScale} from '../utils/getFillScale'
import {getSymbolScale} from '../utils/getSymbolScale'
import {appendGroupCol} from '../utils/appendGroupCol'

export const scatterStat = (
  config: SizedConfig,
  layer: ScatterLayerConfig
): {table: Table; mappings: ScatterMappings; scales: ScatterScales} => {
  const table = appendGroupCol(config.table, layer.fill)
  const {x, y, fill, symbol} = layer
  return {
    table: table,
    mappings: {x, y, fill, symbol},
    scales: {
      fill: getFillScale(table, layer.fill, layer.colors),
      symbol: getSymbolScale(table, layer.symbol),
    },
  }
}
