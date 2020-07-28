import {getJavaScriptTag} from './getJavaScriptTag'

export const isString = (value: any): boolean => {
  const type = typeof value
  return (
    type === 'string' ||
    (type === 'object' &&
      value != null &&
      !Array.isArray(value) &&
      getJavaScriptTag(value) == '[object String]')
  )
}
