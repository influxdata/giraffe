import {Table, Scale} from '../types'
import {scaleOrdinal} from 'd3-scale'
import {SymbolType, symbols, symbolCircle} from 'd3-shape'
import {SYMBOL_COL_KEY} from '../constants'

// TODO pass in the symbols you'd like to use, as in color array.
export const getSymbolScale = (
  table: Table,
  symbolColKeys: string[]
): Scale<string, SymbolType> => {
  if (!symbolColKeys.length) {
    return (_i: string) => symbolCircle
  }
  const symbolCol = table.columns[symbolColKeys[0]].data as string[]

  const symbolSet = Array.from(new Set(symbolCol))

  const scale = scaleOrdinal<string, SymbolType>()
    .domain(symbolSet)
    .range(symbols)

  return scale
}

export const getSymbolScale2 = (table: Table): Scale<string, SymbolType> => {
  const symbolCol = table.columns[SYMBOL_COL_KEY].data as string[]

  const uniqueValues = Array.from(new Set(symbolCol))

  const scale = scaleOrdinal<string, SymbolType>()
    .domain(uniqueValues)
    .range(symbols)

  return scale
}
