import {scaleUtc} from 'd3-scale'
import {ticks} from 'd3-array'

import {Formatter, FormatterType} from '../types'

const TICK_DENSITY = 0.5

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
  const numTicks = Math.round((length / sampleTickWidth) * TICK_DENSITY)

  return Math.max(numTicks, 2)
}

const getTimeTicks = (
  [d0, d1]: number[],
  length: number,
  numTicks: number
): number[] => {
  return scaleUtc()
    .domain([d0, d1])
    .range([0, length])
    .ticks(numTicks)
    .map(d => d.getTime())
}
