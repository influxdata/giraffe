import {isSymbol} from './isSymbol'

const INFINITY = 1 / 0
const reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/
const reIsPlainProp = /^\w*$/
const charCodeOfDot = '.'.charCodeAt(0)
const reEscapeChar = /\\(\\)?/g
const rePropName = RegExp(
  // Match anything that isn't a dot or bracket.
  '[^.[\\]]+' +
    '|' +
    // Or match property names within brackets.
    '\\[(?:' +
    // Match a non-string expression.
    '([^"\'][^[]*)' +
    '|' +
    // Or match strings (supports escaping characters).
    '(["\'])((?:(?!\\2)[^\\\\]|\\\\.)*?)\\2' +
    ')\\]' +
    '|' +
    // Or match "" as the space between consecutive dots or empty brackets.
    '(?=(?:\\.|\\[\\])(?:\\.|\\[\\]|$))',
  'g'
)
const MAX_MEMOIZE_SIZE = 500

const memoize = (func, resolver) => {
  if (
    typeof func !== 'function' ||
    (resolver != null && typeof resolver !== 'function')
  ) {
    throw new TypeError('Expected a function')
  }
  const memoized = (...args) => {
    const key = resolver ? resolver(...args) : args[0]
    const cache = memoized.cache

    if (cache.has(key)) {
      return cache.get(key)
    }
    const result = func(...args)
    memoized.cache = cache.set(key, result) || cache
    return result
  }
  memoized.cache = new (memoize.Cache || Map)()
  return memoized
}

memoize.Cache = Map

const memoizeCapped = func => {
  const result = memoize(func, key => {
    const {cache} = result
    if (cache.size === MAX_MEMOIZE_SIZE) {
      cache.clear()
    }
    return key
  })
  return result
}

const stringToPath = memoizeCapped(string => {
  const result = []
  if (string.charCodeAt(0) === charCodeOfDot) {
    result.push('')
  }
  string.replace(rePropName, (match, expression, quote, subString) => {
    let key = match
    if (quote) {
      key = subString.replace(reEscapeChar, '$1')
    } else if (expression) {
      key = expression.trim()
    }
    result.push(key)
  })
  return result
})

const toKey = (value: string): string => {
  if (typeof value === 'string' || isSymbol(value)) {
    return value
  }
  const result = `${value}`
  return result == '0' && 1 / value == -INFINITY ? '-0' : result
}

const isKey = (value: any, object: any): boolean => {
  if (Array.isArray(value)) {
    return false
  }
  const type = typeof value
  if (
    type === 'number' ||
    type === 'boolean' ||
    value == null ||
    isSymbol(value)
  ) {
    return true
  }

  return (
    reIsPlainProp.test(value) ||
    !reIsDeepProp.test(value) ||
    (object != null && value in Object(object))
  )
}

const castPath = (value: any, object: any): Array<string> => {
  if (Array.isArray(value)) {
    return value
  }
  return isKey(value, object) ? [value] : stringToPath(value)
}

const baseGet = (object: any, path: any) => {
  path = castPath(path, object)

  let index = 0
  const length = path.length

  while (object != null && index < length) {
    object = object[toKey(path[index++])]
  }
  return index && index == length ? object : undefined
}

export const get = (object?: any, path?: any, defaultValue?: any) => {
  const result = object == null ? undefined : baseGet(object, path)
  return result === undefined ? defaultValue : result
}
