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

/*
  Optimal spacing defined as:
    I. when there are less than four ticks:
      for each tick, spacing is one-quarter of the length of a tick
      thusly: 0.25, 0.50, 0.75 of a tick's length as spacing for one, two, and three ticks respectively
    II. when there are four or more ticks:
      sum of all tick lengths is shorter than total available space by at least one tick's length
    III. Based on rules I and II, we call d3 with the suggested number of ticks, and
      allow d3 to determine the actual number of ticks and spacing
*/
const hasOptimalSpacing = (
  rangeLength: number,
  timeTickLength: number,
  ticks: Date[]
): boolean => {
  const fractionalSpaceAsPadding = 0.25
  const totalLength = ticks.length * timeTickLength
  if (ticks.length < 4) {
    const padding = totalLength * fractionalSpaceAsPadding
    if (totalLength < rangeLength - padding) {
      return true
    }
    return false
  } else if (totalLength < rangeLength - timeTickLength) {
    return true
  }
  return false
}

const getOptimalTimeTicks = (
  [d0, d1]: number[],
  rangeLength: number,
  timeTickLength: number
): Date[] => {
  const scaledTime = scaleUtc()
    .domain([d0, d1])
    .range([0, rangeLength])
  const maxNumTicks = Math.floor(rangeLength / timeTickLength)
  let optimalTicks = scaledTime.ticks(maxNumTicks)

  for (
    let counter = 1;
    counter < maxNumTicks &&
    !hasOptimalSpacing(rangeLength, timeTickLength, optimalTicks);
    counter += 1
  ) {
    optimalTicks = scaledTime.ticks(maxNumTicks - counter)
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
