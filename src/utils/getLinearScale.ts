import {scaleLinear} from 'd3-scale'

import {Scale} from '../types'

export const getLinearScale = (
  domainStart: number,
  domainStop: number,
  rangeStart: number,
  rangeStop: number
): Scale<number, number> => {
  return scaleLinear()
    .domain([domainStart, domainStop])
    .range([rangeStart, rangeStop])
}
