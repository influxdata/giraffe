import {isString} from './isString'
import {getJavaScriptTag} from './getJavaScriptTag'

const isRegExp = (value: any): boolean => {
  return (
    typeof value === 'object' &&
    value !== null &&
    getJavaScriptTag(value) == '[object RegExp]'
  )
}

export const replace = (
  original?: string,
  pattern?: string | RegExp,
  replacement?: string
): string => {
  if (
    isString(original) &&
    (isString(pattern) || isRegExp(pattern)) &&
    isString(replacement)
  ) {
    return original.replace(pattern, replacement)
  }
  return `${original}`
}
