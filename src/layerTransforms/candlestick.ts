import {
  Table,
  CandlestickLayerConfig,
  CandlestickMappings,
  CandlestickScales,
} from '../types'
import {getFillScale} from '../utils/getFillScale'
import {appendGroupingCol} from '../utils/appendGroupingCol'
import {GROUPING} from '../constants/columnKeys'

export const getCandlestickTable = (table: Table, fill: string[]): Table =>
  appendGroupingCol(table, fill, GROUPING)

export const getCandlestickMappings = (
  layerConfig: CandlestickLayerConfig
): CandlestickMappings => ({
  x: layerConfig.x,
  y: layerConfig.y,
  fill: layerConfig.fill,
})

export const getCandlestickScales = (
  table: Table,
  colors: string[]
): CandlestickScales => ({
  fill: getFillScale(table, colors),
})
