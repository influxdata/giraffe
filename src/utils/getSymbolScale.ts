import {scaleOrdinal} from 'd3-scale'
import {SymbolType, symbols} from 'd3-shape'
import {Table, Scale} from '../types'
import {SYMBOL_COL_KEY} from '../constants'

export const getSymbolScale = (table: Table): Scale<string, SymbolType> => {
  const symbolCol = table.columns[SYMBOL_COL_KEY].data as string[]

  const uniqueValues = Array.from(new Set(symbolCol))

  const scale = scaleOrdinal<string, SymbolType>()
    .domain(uniqueValues)
    .range(symbols)

  return scale
}
