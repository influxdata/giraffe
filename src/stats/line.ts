import {
  Table,
  LineLayerConfig,
  LineMappings,
  LineScales,
  SizedConfig,
} from '../types'
import {getFillScale} from '../utils/getFillScale'
import {appendGroupingCol} from '../utils/appendGroupingCol'
import {FILL_COL_KEY} from '../constants'

export const lineStat = (
  config: SizedConfig,
  layer: LineLayerConfig
): {table: Table; mappings: LineMappings; scales: LineScales} => {
  const table = appendGroupingCol(config.table, layer.fill, FILL_COL_KEY)

  return {
    table,
    mappings: {x: layer.x, y: layer.y, fill: layer.fill},
    scales: {fill: getFillScale(table, layer.colors)},
  }
}
