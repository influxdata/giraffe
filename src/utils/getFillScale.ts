import {scaleOrdinal} from 'd3-scale'
import * as chroma from 'chroma-js'

import {Table, Scale} from '../types'
import {getGroupColumn} from './getGroupColumn'

export const getFillScale = (
  table: Table,
  fillColKeys: string[],
  colors: string[]
): Scale<string, string> => {
  if (!fillColKeys.length) {
    return (_i: string) => colors[0]
  }

  const groupKeyCol = getGroupColumn(table)

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
