import {Table} from '../types'
import {FILL} from '../constants/columnKeys'

export type CandlestickData = {
  [groupKey: string]: CandlestickDataItem
}

export type CandlestickDataItem = {
  xs: number[] | Float64Array
  starts: number[] | Float64Array
  ends: number[] | Float64Array
  maxs: number[] | Float64Array
  mins: number[] | Float64Array
  ups: boolean[]
  colors: string
}

export const collectCandlestickData = (
  table: Table,
  xColKey: string,
  yColKey: string,
  colors: string[]
): CandlestickData => {
  const xCol = table.getColumn(xColKey, 'number') as number[]
  const yCol = table.getColumn(yColKey, 'number') as number[]
  const groupCol = table.getColumn(FILL, 'string')

  const groupSize = 6
  const result = {}

  for (let i = 0; i < table.length; i += groupSize) {
    const groupKey = groupCol[i]

    if (!result[groupKey]) {
      result[groupKey] = {
        xs: [],
        starts: [],
        ends: [],
        maxs: [],
        mins: [],
        ups: [],
        colors: colors,
      }
    }

    result[groupKey].xs.push(xCol[i])
    result[groupKey].starts.push(yCol[i])
    result[groupKey].ends.push(yCol[i + groupSize - 1])
    result[groupKey].maxs.push(getMax(yCol.slice(i, i + groupSize - 1)))
    result[groupKey].mins.push(getMin(yCol.slice(i, i + groupSize - 1)))
    result[groupKey].ups.push(yCol[i + groupSize - 1] > yCol[i])
  }

  return result as CandlestickData
}

const getMax = (arr: number[] | Float64Array) => {
  let max = arr[0]

  arr.forEach(val => {
    if (val > max) {
      max = val
    }
  })

  return max
}

const getMin = (arr: number[] | Float64Array) => {
  let min = arr[0]

  arr.forEach(val => {
    if (val < min) {
      min = val
    }
  })

  return min
}

export const simplifyCandlestickData = (
  candleStickDataItem: CandlestickDataItem,
  xScale,
  yScale
): CandlestickDataItem => {
  return {
    xs: scaleCandlestick(candleStickDataItem.xs, xScale),
    colors: candleStickDataItem.colors,
    ends: scaleCandlestick(candleStickDataItem.ends, yScale),
    starts: scaleCandlestick(candleStickDataItem.starts, yScale),
    ups: candleStickDataItem.ups,
    maxs: scaleCandlestick(candleStickDataItem.maxs, yScale),
    mins: scaleCandlestick(candleStickDataItem.mins, yScale),
  }
}

const scaleCandlestick = (arr, scale) => {
  return arr.map(val => scale(val))
}
