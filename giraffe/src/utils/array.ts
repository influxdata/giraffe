export const Sorting = {
  ascending: (a: number, b: number) => a - b,
  descending: (a: number, b: number) => b - a,
}

export const pairs = <T>(arr: T[]): [T, T][] => {
  const pairs: [T, T][] = []

  const maxI = arr.length - 1
  for (let i = 0; i < maxI; i++) {
    pairs.push([arr[i], arr[i + 1]])
  }

  return pairs
}
