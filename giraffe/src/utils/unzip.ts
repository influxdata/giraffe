import {isLength} from './isLength'

const isArrayLikeObject = value => {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof value !== 'function' &&
    isLength(value.length)
  )
}

const baseProperty = key => {
  return object => (object == null ? undefined : object[key])
}

export const unzip = (array: Array<any>) => {
  if (!(Array.isArray(array) && array.length)) {
    return []
  }
  let length = 0
  array = array.filter(group => {
    if (isArrayLikeObject(group)) {
      length = Math.max(group.length, length)
      return true
    }
  })
  let index = -1
  const result = new Array(length)
  while (++index < length) {
    result[index] = array.map(baseProperty(index))
  }
  return result
}
