import {get} from './get'
import {isLength} from './isLength'
import {isSymbol} from './isSymbol'
import {isString} from './isString'

const baseSortBy = (array, comparer) => {
  let {length} = array

  array.sort(comparer)
  while (length--) {
    array[length] = array[length].value
  }
  return array
}

const identity = value => value

const compareAscending = (value, other) => {
  if (value !== other) {
    const valIsDefined = value !== undefined
    const valIsNull = value === null
    const valIsReflexive = value === value
    const valIsSymbol = isSymbol(value)

    const othIsDefined = other !== undefined
    const othIsNull = other === null
    const othIsReflexive = other === other
    const othIsSymbol = isSymbol(other)

    const val =
      typeof value === 'string' ? value.localeCompare(other) : value - other

    if (
      (!othIsNull && !othIsSymbol && !valIsSymbol && val > 0) ||
      (valIsSymbol &&
        othIsDefined &&
        othIsReflexive &&
        !othIsNull &&
        !othIsSymbol) ||
      (valIsNull && othIsDefined && othIsReflexive) ||
      (!valIsDefined && othIsReflexive) ||
      !valIsReflexive
    ) {
      return 1
    }
    if (
      (!valIsNull && !valIsSymbol && !othIsSymbol && val < 0) ||
      (othIsSymbol &&
        valIsDefined &&
        valIsReflexive &&
        !valIsNull &&
        !valIsSymbol) ||
      (othIsNull && valIsDefined && valIsReflexive) ||
      (!othIsDefined && valIsReflexive) ||
      !othIsReflexive
    ) {
      return -1
    }
  }
  return 0
}

const compareMultiple = (object, other, orders) => {
  let index = -1
  const objCriteria = object.criteria
  const othCriteria = other.criteria
  const length = objCriteria.length
  const ordersLength = orders.length

  while (++index < length) {
    const order = index < ordersLength ? orders[index] : null
    const cmpFn =
      order && typeof order === 'function' ? order : compareAscending
    const result = cmpFn(objCriteria[index], othCriteria[index])
    if (result) {
      if (order && typeof order !== 'function') {
        return result * (order == 'desc' ? -1 : 1)
      }
      return result
    }
  }
  return object.index - other.index
}

const isArrayLike = value => {
  return value != null && typeof value !== 'function' && isLength(value.length)
}

const baseFor = (object, iteratee, keysFunc) => {
  const iterable = Object(object)
  const props = keysFunc(object)
  let {length} = props
  let index = -1

  while (length--) {
    const key = props[++index]
    if (iteratee(iterable[key], key, iterable) === false) {
      break
    }
  }
  return object
}

const baseForOwn = (object, iteratee) => {
  return object && baseFor(object, iteratee, Object.keys)
}

const baseEach = (collection, iteratee) => {
  if (collection == null) {
    return collection
  }
  if (!isArrayLike(collection)) {
    return baseForOwn(collection, iteratee)
  }
  const length = collection.length
  const iterable = Object(collection)
  let index = -1

  while (++index < length) {
    if (iteratee(iterable[index], index, iterable) === false) {
      break
    }
  }
  return collection
}

const baseOrderBy = (collection, iteratees, orders) => {
  if (iteratees.length) {
    iteratees = iteratees.map(iteratee => {
      if (Array.isArray(iteratee)) {
        return value =>
          get(value, iteratee.length === 1 ? iteratee[0] : iteratee)
      }

      return iteratee
    })
  } else {
    iteratees = [identity]
  }

  let criteriaIndex = -1
  let eachIndex = -1

  const result = Array.isArray(collection) ? new Array(collection.length) : []

  baseEach(collection, value => {
    const criteria = iteratees.map(iteratee => {
      if (isString(iteratee)) {
        return typeof value === 'function' ? value(iteratee) : value[iteratee]
      }
      return iteratee(value)
    })

    result[++eachIndex] = {
      criteria,
      index: ++criteriaIndex,
      value,
    }
  })

  return baseSortBy(result, (object, other) =>
    compareMultiple(object, other, orders)
  )
}

type OrderByIteratees =
  | Function
  | Array<string>
  | Array<Function>
  | Array<Array<string>>
  | Array<object>

export const orderBy = <X>(
  collection: Array<X> | object,
  iteratees: OrderByIteratees,
  orders: Array<string>
): Array<X> => {
  if (collection == null) {
    return []
  }
  if (!Array.isArray(iteratees)) {
    iteratees = iteratees == null ? [] : [iteratees]
  }
  if (!Array.isArray(orders)) {
    orders = orders == null ? [] : [orders]
  }
  return baseOrderBy(collection, iteratees, orders)
}
