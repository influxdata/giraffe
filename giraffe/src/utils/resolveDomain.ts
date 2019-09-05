import {extent} from 'd3-array'

import {NumericColumnData} from '../types'

export const resolveDomain = (
  data: NumericColumnData,
  preferredDomain?: number[]
): [number, number] => {
  let domain: [number, number]

  if (preferredDomain) {
    domain = [preferredDomain[0], preferredDomain[1]]
  } else {
    domain = extent(data)
  }

  if (domain[0] === domain[1]) {
    // Widen domains of zero width by an arbitrary amount so that they can be
    // divided into bins
    domain[0] = domain[0] - 0.5
    domain[1] = domain[1] + 0.5
  }

  return domain
}
