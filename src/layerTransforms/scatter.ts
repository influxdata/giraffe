import {Table, ScatterLayerConfig, ScatterMappings} from '../types'
import {getFillScale} from '../utils/getFillScale'
import {getSymbolScale} from '../utils/getSymbolScale'
import {appendGroupingCol} from '../utils/appendGroupingCol'
import {SYMBOL_COL_KEY, FILL_COL_KEY} from '../constants'

export const getScatterTable = (
  table: Table,
  fill: string[],
  symbol: string[]
): Table => {
  const withFillCol = appendGroupingCol(table, fill, FILL_COL_KEY)
  const withSymbolCol = appendGroupingCol(withFillCol, symbol, SYMBOL_COL_KEY)

  return withSymbolCol
}

export const getScatterMappings = (
  layerConfig: ScatterLayerConfig
): ScatterMappings => ({
  x: layerConfig.x,
  y: layerConfig.y,
  fill: layerConfig.fill,
  symbol: layerConfig.symbol,
})

export const getScatterScales = (table: Table, colors: string[]) => ({
  fill: getFillScale(table, colors),
  symbol: getSymbolScale(table),
})
