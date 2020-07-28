import {getJavaScriptTag} from './getJavaScriptTag'

const isObjectLike = (value: any): boolean => {
  return typeof value === 'object' && value !== null
}

export const isNumber = (value: any): boolean => {
  return (
    typeof value === 'number' ||
    (isObjectLike(value) && getJavaScriptTag(value) == '[object Number]')
  )
}
