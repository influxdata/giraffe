export const isDefined = (x?: any) =>
  x !== null && x !== undefined && !Number.isNaN(x)
