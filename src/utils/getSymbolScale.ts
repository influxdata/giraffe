import {scaleOrdinal} from 'd3-scale'
import {Table, Scale} from '../types'
import {SYMBOL} from '../constants/columnKeys'

export enum SymbolType {
  Circle = 'circle',
  Triangle = 'triangle',
  Square = 'square',
}

export const getSymbolScale = (table: Table): Scale<string, SymbolType> => {
  const symbolCol = table.getColumn(SYMBOL, 'string')
  const uniqueValues = Array.from(new Set(symbolCol))

  const symbolTypes = Object.keys(SymbolType).map(
    s => SymbolType[s]
  ) as SymbolType[]

  const scale = scaleOrdinal<string, SymbolType>()
    .domain(uniqueValues)
    .range(symbolTypes)

  return scale
}
