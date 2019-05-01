/*
  Check whether two objects are equal, where equality is defined as meeting all
  of the following conditions:

  - The two objects must have the exact same keys
  - If the value for a key is an array, every item in that array must be
    shallow equal (i.e. `===`) in both objects
  - If the value for a key is not an array, it must be shallow equal in both
    objects

  This function is designed for a very particular use case where we don't need
  to check for the true deep equality of two objects, but shallow equality
  checking is insufficient.
*/
export const isMostlyEqual = (a: object, b: object): boolean => {
  const aKeys = Object.keys(a)
  const bKeys = Object.keys(b)

  if (aKeys.length !== bKeys.length) {
    return false
  }

  return Object.keys(a).every(key => {
    const aValue = a[key]
    const bValue = b[key]

    if ((aValue && !bValue) || (bValue && !aValue)) {
      return false
    }

    if (Array.isArray(aValue)) {
      return (
        aValue.length === bValue.length &&
        aValue.every((x, i) => x === bValue[i])
      )
    }

    return aValue === bValue
  })
}
