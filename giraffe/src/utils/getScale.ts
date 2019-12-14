import {getLogScale} from './getLogScale'
import {getLinearScale} from './getLinearScale'

import {ScaleFactory} from '../types'

export const getScale = (scale: string): ScaleFactory => {
  switch (scale) {
    case 'linear':
      return getLinearScale
    case 'log':
      return getLogScale
    default:
      return getLinearScale
  }
}
