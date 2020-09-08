export const styleReducer = (
  classes: object,
  accumulator: string,
  current: string
): string => {
  if (classes[current]) {
    return accumulator
      ? `${accumulator} ${classes[current]}`
      : `${classes[current]}`
  }
  return accumulator ? `${accumulator} ${current}` : `${current}`
}
