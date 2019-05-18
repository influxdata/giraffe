import {scaleOrdinal} from 'd3-scale'
import {SymbolType, symbols} from 'd3-shape'
import {Table, Scale} from '../types'
import {SYMBOL} from '../constants/columnKeys'

export const getSymbolScale = (table: Table): Scale<string, SymbolType> => {
  const symbolCol = table.getColumn(SYMBOL, 'string')

  const uniqueValues = Array.from(new Set(symbolCol))

  const scale = scaleOrdinal<string, SymbolType>()
    .domain(uniqueValues)
    .range(symbols)

  return scale
}
