// utilities for fixing data sources of stories for regression testing

export const getRandomOrFixed: {
  (fixed: boolean, index: number, minValue: number, maxValue: number): number
  (fixed: boolean, index: number, maxValue: number): number
} = (fixed: boolean, index: number, minValue: number, maxValue?: number) => {
  if (maxValue === undefined) {
    return getRandomOrFixed(fixed, index, 0, minValue)
  }

  if (fixed) {
    return ((Math.sin(index) + 1) / 2) * (maxValue - minValue) + minValue
  } else {
    return Math.random() * (maxValue - minValue) + minValue
  }
}

export const nowOrFixed = (fixed: boolean) => {
  return fixed ? 0 : Date.now()
}
