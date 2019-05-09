import {range} from 'd3-array'
import {scaleOrdinal} from 'd3-scale'
import {interpolateRgbBasis} from 'd3-interpolate'

import {Table, Scale} from '../types'
import {getGroupColumn} from './getGroupColumn'
import {FILL_COL_KEY} from '../constants'

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

export const getFillScaleForScatter = (
  table: Table,
  colors: string[]
): Scale<string, string> => {
  const fillCol = table.columns[FILL_COL_KEY].data as string[]

  const fillSet = Array.from(new Set(fillCol))

  return getColorScale(fillSet, colors)
}

/*
  Get a scale that maps elements of the domain to a color according to the
  color scheme passed as `colors`.
*/
const getColorScale = (
  domain: string[],
  colors: string[]
): Scale<string, string> => {
  let scaleRange = []

  if (domain.length <= colors.length) {
    scaleRange = colors.slice(0, domain.length)
  } else {
    const interpolator = interpolateRgbBasis(colors)

    scaleRange = range(domain.length).map(k =>
      interpolator(k / (domain.length - 1))
    )
  }

  const scale = scaleOrdinal<string>()
    .domain(domain)
    .range(scaleRange)

  return scale
}
