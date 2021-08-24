import {isSymbol} from './isSymbol'

const INFINITY = 1 / 0
const MAX_INTEGER = 1.7976931348623157e308
const NotANumber = 0 / 0
const reTrim = /^\s+|\s+$/g
const reIsBadHex = /^[-+]0x[0-9a-f]+$/i
const reIsBinary = /^0b[01]+$/i
const reIsOctal = /^0o[0-7]+$/i
const freeParseInt = parseInt

const isObject = (value: any): boolean => {
  const type = typeof value
  return value != null && (type === 'object' || type === 'function')
}

const toNumber = (value: any): number => {
  if (typeof value === 'number') {
    return value
  }
  if (isSymbol(value)) {
    return NotANumber
  }
  if (isObject(value)) {
    const other = typeof value.valueOf === 'function' ? value.valueOf() : value
    value = isObject(other) ? `${other}` : other
  }
  if (typeof value !== 'string') {
    return value === 0 ? value : +value
  }
  value = value.replace(reTrim, '')
  const isBinary = reIsBinary.test(value)

  if (isBinary || reIsOctal.test(value)) {
    if (freeParseInt(value.slice(2), isBinary ? 2 : 8)) {
      return reIsBadHex.test(value)
    }
    return NotANumber
  }
  return +value
}

const toFinite = (value: any): number => {
  if (!value) {
    return value === 0 ? value : 0
  }
  value = toNumber(value)
  if (value === INFINITY || value === -INFINITY) {
    const sign = value < 0 ? -1 : 1
    return sign * MAX_INTEGER
  }
  return value === value ? value : 0
}

const baseRange = (start: number, end: number, step: number): Array<number> => {
  let index = 0
  let length = Math.max(Math.ceil((end - start) / (step || 1)), 0)
  const result = new Array(length)

  while (length) {
    length -= 1
    result[index] = start
    index += 1
    start += step
  }
  return result
}

const createRange = () => {
  return (start: number, end: number, step = 1) => {
    // Ensure the sign of `-0` is preserved.
    start = toFinite(start)
    if (end === undefined) {
      end = start
      start = 0
    } else {
      end = toFinite(end)
    }

    if (step === undefined) {
      step = -1
      if (start < end) {
        step = 1
      }
    } else {
      step = toFinite(step)
    }

    return baseRange(start, end, step)
  }
}

export const range = createRange()
