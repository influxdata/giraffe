// Libraries
import {scaleUtc} from 'd3-scale'
import {ticks} from 'd3-array'
import memoizeOne from 'memoize-one'

// Types
import {AxisTicks, Formatter, FormatterType} from '../types'

// Constants
import {TIME, VALUE} from '../constants/columnKeys'

// Utils
import {getTextMetrics} from './getTextMetrics'

/*
  Minimum spacing defined as:
    I. when there are less than 4 ticks:
      for each tick, spacing is one-quarter of the length of a tick
      thusly: 0.25, 0.50, 0.75 of a tick's length as spacing for 1, 2, and 3 ticks respectively
    II. when there are 4 to 10 ticks:
      sum of all tick lengths is shorter than total available space by at least one tick's length
    III. when there are more than 10 ticks:
      for every group of up to 10 ticks there is spacing equal at least 1 tick's length
    IV. length of a tick is:
         vertical axis - the average of the height and width of a span that wraps the formatted last tick in the range
         horizontal axis - the width of a span that wraps the formatted last tick in the range
*/
const hasMinimumSpacing = (
  rangeLength: number,
  timeTickLength: number,
  ticks: AxisTicks
): boolean => {
  const fractionalSpaceAsPadding = 0.25
  const totalLength = ticks.length * timeTickLength
  if (ticks.length < 4) {
    const padding = totalLength * fractionalSpaceAsPadding
    if (totalLength < rangeLength - padding) {
      return true
    }
    return false
  } else if (ticks.length <= 10) {
    if (totalLength < rangeLength - timeTickLength) {
      return true
    }
    return false
  } else if (
    totalLength <
    rangeLength - Math.ceil(ticks.length / 10) * timeTickLength
  ) {
    return true
  }
  return false
}

/*
  Optimal number of ticks is defined as:
  I. allow d3 to choose the ticks and
  II. meets minimum spacing requirements checked by hasMinimumSpacing
*/
const getOptimalTicks = (
  [d0, d1]: number[],
  rangeLength: number,
  tickLength: number
): number[] => {
  const maxNumTicks = Math.floor(rangeLength / tickLength)
  let optimalTicks = ticks(d0, d1, maxNumTicks)

  for (
    let counter = 1;
    counter < maxNumTicks &&
    !hasMinimumSpacing(rangeLength, tickLength, optimalTicks);
    counter += 1
  ) {
    optimalTicks = ticks(d0, d1, maxNumTicks - counter)
  }
  return optimalTicks
}

/*
  Same as getOptimalTicks but for Date objects
*/
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
    !hasMinimumSpacing(rangeLength, timeTickLength, optimalTicks);
    counter += 1
  ) {
    optimalTicks = scaledTime.ticks(maxNumTicks - counter)
  }
  return optimalTicks
}

export const getTicks = (
  domain: number[],
  rangeLength: number,
  tickSize: number,
  columnKey: string
): number[] => {
  return columnKey === TIME
    ? getOptimalTimeTicks(domain, rangeLength, tickSize).map(d => d.getTime())
    : getOptimalTicks(domain, rangeLength, tickSize)
}

const getMemoizedVerticalTicks = memoizeOne(
  (
    domain: number[],
    rangeLength: number,
    tickSize: number,
    columnKey: string
  ) => getTicks(domain, rangeLength, tickSize, columnKey)
)
export const getVerticalTicks = memoizeOne(
  (
    domain: number[],
    rangeLength: number,
    tickFont: string,
    formatter: Formatter
  ): number[] => {
    const sampleTick = formatter(domain[1])
    const tickTextMetrics = getTextMetrics(tickFont, sampleTick)

    const maxTickHeight = 5 * tickTextMetrics.height
    const tickHeight = Math.min(
      tickTextMetrics.height + tickTextMetrics.width / 2,
      maxTickHeight
    )
    const columnKey =
      formatter._GIRAFFE_FORMATTER_TYPE === FormatterType.Time ? TIME : VALUE

    return getMemoizedVerticalTicks(domain, rangeLength, tickHeight, columnKey)
  }
)

const getMemoizedHorizontalTicks = memoizeOne(
  (
    domain: number[],
    rangeLength: number,
    tickSize: number,
    columnKey: string
  ) => getTicks(domain, rangeLength, tickSize, columnKey)
)
export const getHorizontalTicks = memoizeOne(
  (
    domain: number[],
    rangeLength: number,
    tickFont: string,
    formatter: Formatter
  ): number[] => {
    const sampleTick = formatter(domain[1])
    const tickTextMetrics = getTextMetrics(tickFont, sampleTick)

    const columnKey =
      formatter._GIRAFFE_FORMATTER_TYPE === FormatterType.Time ? TIME : VALUE

    return getMemoizedHorizontalTicks(
      domain,
      rangeLength,
      tickTextMetrics.width,
      columnKey
    )
  }
)
