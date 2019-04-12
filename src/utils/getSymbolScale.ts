import {Table, Scale} from '../types'
import {assert} from './assert'
import {GROUP_COL_KEY} from '../constants'
import {scaleOrdinal} from 'd3-scale'
import {SymbolType, symbols, symbolCircle} from 'd3-shape'

// TODO pass in the symbols you'd like to use, as in color array.
export const getSymbolScale = (
  table: Table,
  symbolColKeys: string[]
): Scale<string, SymbolType> => {
  if (!symbolColKeys.length) {
    return (_i: string) => symbolCircle
  }

  const groupKeyCol = table.columns[GROUP_COL_KEY]

  assert('expected table to have a column of group keys', !!groupKeyCol)

  const domain = {}

  for (let i = 0; i < table.length; i++) {
    domain[groupKeyCol.data[i] as string] = true
  }

  const scale = scaleOrdinal<string, SymbolType>()
    .domain(Object.keys(domain))
    .range(symbols)

  return scale
}
