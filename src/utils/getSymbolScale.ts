import {scaleOrdinal} from 'd3-scale'
import {Table, Scale} from '../types'
import {SYMBOL} from '../constants/columnKeys'

export type SymbolType = 'circle' | 'triangle' | 'square'

export const getSymbolScale = (table: Table): Scale<string, SymbolType> => {
  const symbolCol = table.getColumn(SYMBOL, 'string')
  const uniqueValues = Array.from(new Set(symbolCol))

  const symbolTypes = ['circle', 'triangle', 'square'] as SymbolType[]

  const scale = scaleOrdinal<string, SymbolType>()
    .domain(uniqueValues)
    .range(symbolTypes)

  return scale
}
