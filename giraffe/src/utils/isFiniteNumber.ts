import {isNumber} from './isNumber'

export const isFiniteNumber = (value: any) =>
  value === value && isNumber(value) && Math.abs(value) !== Infinity
