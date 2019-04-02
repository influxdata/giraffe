import {Table, LineLayerConfig, LineMappings, LineScales} from '../types'
import {getFillScale} from '../utils/getFillScale'
import {appendGroupCol} from '../utils/appendGroupCol'

export const lineStat = (
  inTable: Table,
  layer: LineLayerConfig,
  _xDomain: number[],
  _yDomain: number[]
): {table: Table; mappings: LineMappings; scales: LineScales} => {
  const table = appendGroupCol(inTable, layer.fill)

  return {
    table,
    mappings: {x: layer.x, y: layer.y, fill: layer.fill},
    scales: {fill: getFillScale(table, layer.fill, layer.colors)},
  }
}
