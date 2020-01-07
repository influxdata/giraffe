// Libraries
import {scaleUtc} from 'd3-scale'
import {ticks} from 'd3-array'
import memoizeOne from 'memoize-one'

// Types
import {Formatter, FormatterType} from '../types'

// Utils
import {getTextMetrics} from './getTextMetrics'

const getNumTicks = (
  sampleTick: string,
  length: number,
  charLength: number
): number => {
  const sampleTickWidth = sampleTick.length * charLength
  return sampleTickWidth === 0 ? 0 : Math.round(length / sampleTickWidth)
}

const getOptimalTimeTicks = (
  [d0, d1]: number[],
  rangeLength: number,
  timeTickLength: number
): Date[] => {
  const maxUseableLength = rangeLength - timeTickLength
  const scaledTime = scaleUtc()
    .domain([d0, d1])
    .range([0, rangeLength])

  const maxNumTicks = Math.floor(rangeLength / timeTickLength)

  let optimalTicks = scaledTime.ticks(maxNumTicks)
  let counter = 1

  while (
    counter < maxNumTicks &&
    optimalTicks.length * timeTickLength > maxUseableLength
  ) {
    optimalTicks = scaledTime.ticks(maxNumTicks - counter)
    counter += 1
  }
  return optimalTicks
}

const getTimeTicksMemoized = memoizeOne(
  ([d0, d1]: number[], length: number, timeTickLength: number): number[] => {
    const timeTicks = getOptimalTimeTicks([d0, d1], length, timeTickLength)
    return timeTicks.map(d => d.getTime())
  }
)

export const getTicks = (
  domain: number[],
  rangeLength: number,
  charLength: number,
  tickFont: string,
  formatter: Formatter
): number[] => {
  const sampleTick = formatter(domain[1])
  const tickTextMetrics = getTextMetrics(tickFont, sampleTick)
  const numTicks = getNumTicks(sampleTick, rangeLength, charLength)
  switch (formatter._GIRAFFE_FORMATTER_TYPE) {
    case FormatterType.Time:
      return getTimeTicksMemoized(domain, rangeLength, tickTextMetrics.width)

    default:
      return ticks(domain[0], domain[1], numTicks)
  }
}
