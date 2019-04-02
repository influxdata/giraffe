import {scaleOrdinal} from 'd3-scale'
import * as chroma from 'chroma-js'

import {Table, Scale} from '../types'
import {assert} from './assert'
import {GROUP_COL_KEY} from '../constants'

export const getFillScale = (
  table: Table,
  fillColKeys: string[],
  colors: string[]
): Scale<string, string> => {
  if (!fillColKeys.length) {
    return (_i: string) => colors[0]
  }

  const groupKeyCol = table.columns[GROUP_COL_KEY]

  assert('expected table to have a column of group keys', !!groupKeyCol)

  const domain = {}

  for (let i = 0; i < table.length; i++) {
    domain[groupKeyCol.data[i] as string] = true
  }

  return getColorScale(Object.keys(domain), colors)
}

/*
  Get a scale that maps elements of the domain to a color according to the
  color scheme passed as `colors`.
*/
const getColorScale = (
  domain: string[],
  colors: string[]
): Scale<string, string> => {
  const range = chroma
    .scale(colors)
    .mode('lch')
    .colors(domain.length)

  const scale = scaleOrdinal<string>()
    .domain(domain)
    .range(range)

  return scale
}
