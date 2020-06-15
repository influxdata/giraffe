import {getJavaScriptTag} from './getJavaScriptTag'

export const isSymbol = (value: any): boolean => {
  const type = typeof value
  return (
    type == 'symbol' ||
    (type === 'object' &&
      value != null &&
      getJavaScriptTag(value) == '[object Symbol]')
  )
}
