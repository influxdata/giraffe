import {scaleUtc} from 'd3-scale'
import {ticks} from 'd3-array'

import {ColumnType} from '../types'
import {getTimeTickFormatter} from './getTickFormatter'
import {TextMetrics} from './getTextMetrics'

const TICK_DENSITY = 0.2

export const getTicks = (
  domain: number[],
  length: number,
  orientation: 'vertical' | 'horizontal',
  columnType: ColumnType,
  textMetrics: TextMetrics
): number[] => {
  let sampleTick

  if (columnType === 'time') {
    sampleTick = getTimeTickFormatter(domain)(domain[1])
  } else {
    sampleTick = String(domain[1])
  }

  const charLength =
    orientation === 'vertical' ? textMetrics.charHeight : textMetrics.charWidth

  const numTicks = getNumTicks(sampleTick, length, charLength)

  if (columnType === 'time') {
    return getTimeTicks(domain, length, numTicks)
  }

  return ticks(domain[0], domain[1], numTicks)
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
