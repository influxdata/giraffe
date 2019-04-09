import {scaleUtc} from 'd3-scale'
import {ticks} from 'd3-array'

import {TICK_CHAR_WIDTH} from '../constants'
import {ColumnType} from '../types'
import {getTimeTickFormatter} from './getTickFormatter'

export const getTicks = (
  domain: number[],
  length: number,
  columnType: ColumnType
): number[] => {
  let sampleTick

  if (columnType === 'time') {
    sampleTick = getTimeTickFormatter(domain)(domain[1])
  } else {
    sampleTick = String(domain[1])
  }

  const numTicks = getNumTicks(sampleTick, length)

  if (columnType === 'time') {
    return getTimeTicks(domain, length, numTicks)
  }

  return ticks(domain[0], domain[1], numTicks)
}

const getNumTicks = (sampleTick: string, length): number => {
  const TICK_DENSITY = 0.2
  const sampleTickWidth = sampleTick.length * TICK_CHAR_WIDTH
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
