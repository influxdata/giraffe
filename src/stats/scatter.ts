import {
  Table,
  ScatterLayerConfig,
  ScatterMappings,
  ScatterScales,
  SizedConfig,
} from '../types'
import {getFillScale2} from '../utils/getFillScale'
import {getSymbolScale2} from '../utils/getSymbolScale'
import {appendGroupingCol} from '../utils/appendGroupingCol'
import {SYMBOL_COL_KEY, FILL_COL_KEY} from '../constants'

export const scatterStat = (
  config: SizedConfig,
  layer: ScatterLayerConfig
): {table: Table; mappings: ScatterMappings; scales: ScatterScales} => {
  let table = appendGroupingCol(config.table, layer.fill, FILL_COL_KEY)

  table = appendGroupingCol(table, layer.symbol, SYMBOL_COL_KEY)

  const {x, y, fill, symbol} = layer

  return {
    table: table,
    mappings: {x, y, fill, symbol},
    scales: {
      fill: getFillScale2(table, layer.colors),
      symbol: getSymbolScale2(table),
    },
  }
}
