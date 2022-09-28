export const isDefined = (x?: any) =>
  x !== null && x !== undefined && !Number.isNaN(x)

export const isDefinedOrNaN = (x?: any) => x !== null && x !== undefined
