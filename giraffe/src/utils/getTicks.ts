import {scaleUtc} from 'd3-scale'
import {ticks} from 'd3-array'

import {Formatter, FormatterType} from '../types'

export const getTicks = (
  domain: number[],
  rangeLength: number,
  charLength: number,
  formatter?: Formatter
): number[] => {
  const sampleTick = formatter(domain[1])
  const numTicks = getNumTicks(sampleTick, rangeLength, charLength)
  switch (formatter._GIRAFFE_FORMATTER_TYPE) {
    case FormatterType.Time:
      return getTimeTicks(domain, rangeLength, numTicks)

    default:
      return ticks(domain[0], domain[1], numTicks)
  }
}

const getNumTicks = (
  sampleTick: string,
  length: number,
  charLength: number
): number => {
  const sampleTickWidth = sampleTick.length * charLength
  return Math.round(length / sampleTickWidth)
}

const getTimeTicks = (
  [d0, d1]: number[],
  length: number,
  numTicks: number
): number[] => {
  const results = scaleUtc()
    .domain([d0, d1])
    .range([0, length])
    .ticks(numTicks)
    .map(d => d.getTime())
  if (results.length > numTicks) {
    // added this to force D3 to use the numTicks since
    // D3 treats the numTicks as a suggestion rather than a source
    return results.slice(0, numTicks)
  }
  return results
}
