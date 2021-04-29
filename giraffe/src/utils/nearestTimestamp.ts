export const nearestTimestamp = (timestamps, rawValue) => {
  if (timestamps.length === 0) {
    return rawValue
  }

  if (timestamps.length === 1) {
    return timestamps[0]
  }

  const midPoint = timestamps.length / 2
  const firstHalf = timestamps.slice(0, midPoint)
  const secondHalf = timestamps.slice(midPoint)

  const firstPivotPoint = firstHalf[firstHalf.length - 1]
  const secondPivotPoint = secondHalf[0]

  const firstHalfDistance = Math.abs(firstPivotPoint - rawValue)
  const secondHalfDistance = Math.abs(secondPivotPoint - rawValue)

  if (firstHalfDistance > secondHalfDistance) {
    return nearestTimestamp(secondHalf, rawValue)
  }

  return nearestTimestamp(firstHalf, rawValue)
}
