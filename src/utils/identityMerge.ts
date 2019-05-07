/*
  Given a source and target object, produce an object that is logically
  equivalent to the target, preserving the reference identity of nodes in the
  source when possible.
*/
export const identityMerge = <S extends object, T extends object>(
  source: S,
  target: T
): T => {
  const wrappedSource = {root: source}
  const wrappedTarget = {root: target}
  const paths = enumeratePaths(wrappedTarget)
  const result: any = {}

  for (const path of paths) {
    const sourceValue = getByPath(wrappedSource, path)
    const targetValue = getByPath(wrappedTarget, path)

    if (isEqual(sourceValue, targetValue)) {
      setByPath(result, path, sourceValue)
    } else {
      setByPath(result, path, targetValue)
    }
  }

  return result.root
}

type Path = string[]

export const enumeratePaths = (
  target: any,
  pathToTarget: Path = [],
  acc: Path[] = []
): Path[] => {
  if (typeof target === 'string') {
    return acc
  }

  for (const key of Object.keys(target)) {
    const currentPath = [...pathToTarget, key]

    acc.push(currentPath)
    enumeratePaths(target[key], currentPath, acc)
  }

  return acc
}

export const getByPath = (target: any, path: Path): any => {
  if (!path.length) {
    return
  }

  try {
    let i = 0
    let currentTarget = target[path[i]]

    while (currentTarget !== undefined) {
      if (i === path.length - 1) {
        return currentTarget
      }

      i += 1
      currentTarget = currentTarget[path[i]]
    }
  } catch {}
}

export const setByPath = (target: any, path: Path, value: any): void => {
  if (!path.length) {
    throw new Error('invalid path')
  }

  if (typeof target !== 'object') {
    throw new Error('target of setByPath must be object')
  }

  if (path.length === 1) {
    target[path[0]] = value
  }

  let i = -1
  let currentTarget = target

  while (i < path.length - 2) {
    let nextTarget = currentTarget[path[i + 1]]

    if (typeof nextTarget !== 'object') {
      const isArrayKey = isNaN(+path[i + 1])

      currentTarget[path[i + 1]] = isArrayKey ? {} : []
      nextTarget = currentTarget[path[i + 1]]
    }

    i += 1
    currentTarget = nextTarget
  }

  currentTarget[path[i + 1]] = value
}

export const isEqual = (a: any, b: any): boolean => {
  switch (typeof b) {
    case 'number':
    case 'boolean':
    case 'string':
    case 'function':
      return a === b
    default: {
      const aKeys = Object.keys(a)
      const bKeys = Object.keys(b)

      return (
        aKeys.length === bKeys.length && aKeys.every(k => isEqual(a[k], b[k]))
      )
    }
  }
}
