import {ticks} from 'd3-array'

import {TICK_CHAR_WIDTH} from '../constants'

export const getTicks = ([d0, d1]: number[], length: number): number[] => {
  const approxTickWidth =
    Math.max(String(d0).length, String(d1).length) * TICK_CHAR_WIDTH

  const TICK_DENSITY = 0.3
  const numTicks = Math.round((length / approxTickWidth) * TICK_DENSITY)
  const result = ticks(d0, d1, numTicks)

  return result
}
