import {extent} from 'd3-array'

import {Table, ScatterLayerSpec} from '../types'
import {FILL, SYMBOL} from '../constants/columnKeys'
import {createGroupIDColumn, getNominalColorScale, getSymbolScale} from './'

export const scatterTransform = (
  inputTable: Table,
  xColumnKey: string,
  yColumnKey: string,
  fillColKeys: string[],
  symbolColKeys: string[],
  colors: string[]
): ScatterLayerSpec => {
  const [fillColumn, fillColumnMap] = createGroupIDColumn(
    inputTable,
    fillColKeys
  )

  const [symbolColumn, symbolColumnMap] = createGroupIDColumn(
    inputTable,
    symbolColKeys
  )

  const table = inputTable
    .addColumn(FILL, 'number', fillColumn)
    .addColumn(SYMBOL, 'number', symbolColumn)

  const xCol = table.getColumn(xColumnKey, 'number')
  const yCol = table.getColumn(yColumnKey, 'number')
  const fillScale = getNominalColorScale(fillColumnMap, colors)
  const symbolScale = getSymbolScale(symbolColumnMap)

  return {
    type: 'scatter',
    inputTable,
    table,
    xDomain: extent(xCol),
    yDomain: extent(yCol),
    xColumnKey,
    yColumnKey,
    xColumnType: inputTable.getColumnType(xColumnKey),
    yColumnType: inputTable.getColumnType(yColumnKey),
    scales: {fill: fillScale, symbol: symbolScale},
    columnGroupMaps: {fill: fillColumnMap, symbol: symbolColumnMap},
  }
}
