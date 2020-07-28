import {scaleLog} from 'd3-scale'

import {Scale} from '../types'

export const getLogScale = (
  domainStart: number,
  domainStop: number,
  rangeStart: number,
  rangeStop: number
): Scale<number, number> => {
  return scaleLog()
    .domain([domainStart, domainStop])
    .range([rangeStart, rangeStop])
}
