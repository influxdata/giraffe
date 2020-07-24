type Iteratee = (value: any) => string

export const groupBy = (data: Array<any>, iteratee: Iteratee) => {
  const result = {}

  data.forEach(value => {
    const index = iteratee(value)
    if (!Array.isArray(result[index])) {
      result[index] = []
    }
    result[index].push(value)
  })
  return result
}
