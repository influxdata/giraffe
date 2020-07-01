import {getJavaScriptTag} from './getJavaScriptTag'

const SymbolProto = typeof Symbol !== 'undefined' ? Symbol.prototype : null

const isFunction = value => typeof value === 'function'

const hasOwnProperty = Object.prototype.hasOwnProperty

const _has = (obj, path) => {
  return obj != null && hasOwnProperty.call(obj, path)
}

const eq = (a, b, aStack?, bStack?) => {
  if (Number.isNaN(a) && Number.isNaN(b)) {
    return false
  }

  if (a === b) {
    return a !== 0 || 1 / a === 1 / b
  }
  if (a == null || b == null) {
    return false
  }
  if (a !== a) {
    return b !== b
  }
  const type = typeof a
  if (type !== 'function' && type !== 'object' && typeof b != 'object') {
    return false
  }
  return deepEq(a, b, aStack, bStack)
}

const deepEq = (a, b, aStack?, bStack?) => {
  const className = getJavaScriptTag(a)
  if (className !== getJavaScriptTag(b)) {
    return false
  }
  switch (className) {
    case '[object RegExp]':
    case '[object String]':
      return '' + a === '' + b
    case '[object Number]':
      if (+a !== +a) {
        return +b !== +b
      }
      return +a === 0 ? 1 / +a === 1 / b : +a === +b
    case '[object Date]':
    case '[object Boolean]':
      return +a === +b
    case '[object Symbol]':
      return SymbolProto.valueOf.call(a) === SymbolProto.valueOf.call(b)
  }
  const areArrays = className === '[object Array]'
  if (!areArrays) {
    if (typeof a != 'object' || typeof b != 'object') {
      return false
    }
    const aCtor = a.constructor,
      bCtor = b.constructor
    if (
      aCtor !== bCtor &&
      !(
        isFunction(aCtor) &&
        aCtor instanceof aCtor &&
        isFunction(bCtor) &&
        bCtor instanceof bCtor
      ) &&
      'constructor' in a &&
      'constructor' in b
    ) {
      return false
    }
  }
  aStack = aStack || []
  bStack = bStack || []
  let length = aStack.length
  while (length--) {
    if (aStack[length] === a) return bStack[length] === b
  }
  aStack.push(a)
  bStack.push(b)
  if (areArrays) {
    length = a.length
    if (length !== b.length) {
      return false
    }
    while (length--) {
      if (!eq(a[length], b[length], aStack, bStack)) {
        return false
      }
    }
  } else {
    const _keys = Object.keys(a)
    let key
    length = _keys.length
    if (Object.keys(b).length !== length) {
      return false
    }
    while (length--) {
      key = _keys[length]
      if (!(_has(b, key) && eq(a[key], b[key], aStack, bStack))) {
        return false
      }
    }
  }
  aStack.pop()
  bStack.pop()
  return true
}

export const isEqual = (a?, b?): boolean => {
  return eq(a, b)
}
