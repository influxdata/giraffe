import {newTable} from '../../../giraffe/src'
import {getRandomOrFixed, nowOrFixed} from './utils'

const numberOfRecords = 20
const recordsPerLine = 20

export const getGaugeTable = (
  fixed: boolean,
  minValue: number,
  maxValue: number
) => {
  const TIME_COL: Array<number> = []
  const VALUE_COL: Array<number> = []

  for (let i = 0; i < numberOfRecords; i += 1) {
    VALUE_COL.push(getRandomOrFixed(fixed, i, minValue, maxValue))
    TIME_COL.push(nowOrFixed(fixed) + (i % recordsPerLine) * 1000 * 60)
  }

  return newTable(numberOfRecords)
    .addColumn('_time', 'dateTime:RFC3339', 'time', TIME_COL)
    .addColumn('_value', 'system', 'number', VALUE_COL)
}
