import {
  Table,
  LineLayerConfig,
  LineMappings,
  LineScales,
  SizedConfig,
} from '../types'
import {getFillScale} from '../utils/getFillScale'
import {appendGroupCol} from '../utils/appendGroupCol'

export const lineStat = (
  config: SizedConfig,
  layer: LineLayerConfig
): {table: Table; mappings: LineMappings; scales: LineScales} => {
  const table = appendGroupCol(config.table, layer.fill)

  return {
    table,
    mappings: {x: layer.x, y: layer.y, fill: layer.fill},
    scales: {fill: getFillScale(table, layer.fill, layer.colors)},
  }
}
