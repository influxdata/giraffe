import {scaleOrdinal} from 'd3-scale'
import * as chroma from 'chroma-js'

import {Table, Scale} from '../types'
import {getGroupKey} from './getGroupKey'

export const getFillScale = (
  table: Table,
  fillColKeys: string[],
  colors: string[]
): Scale<number, string> => {
  if (!fillColKeys.length) {
    return (_i: number) => colors[0]
  }

  const domain = new Set()

  for (let i = 0; i < table.length; i++) {
    domain.add(getGroupKey(fillColKeys.map(k => table.columns[k].data[i])))
  }

  const groupKeyFillScale = getColorScale([...domain], colors)

  const fillScale = (i: number) => {
    const values = fillColKeys.map(colKey => table.columns[colKey].data[i])
    const groupKey = getGroupKey(values)
    const fill = groupKeyFillScale(groupKey)

    return fill
  }

  return fillScale
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
