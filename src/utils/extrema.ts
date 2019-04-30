export const minBy = <T>(f: (x: T) => number, xs: T[]): T => {
  let minX = null
  let minDistance = Infinity

  for (const x of xs) {
    const distance = f(x)

    if (distance < minDistance) {
      minX = x
      minDistance = distance
    }
  }

  return minX
}

export const maxBy = <T>(f: (x: T) => number, xs: T[]): T => {
  let maxX = null
  let maxDistance = -Infinity

  for (const x of xs) {
    const distance = f(x)

    if (distance > maxDistance) {
      maxX = x
      maxDistance = distance
    }
  }

  return maxX
}
