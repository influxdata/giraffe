import {newTable} from '../../../giraffe/src'
import {getRandomOrFixed, nowOrFixed} from './utils'

const numberOfRecords = 20
const recordsPerLine = 20
const maxValue = 10

export const getSingleStatTable = (fixed: boolean) => {
  const TIME_COL = []
  const VALUE_COL = []
  const CPU_COL = []

  for (let i = 0; i < numberOfRecords; i += 1) {
    VALUE_COL.push(getRandomOrFixed(fixed, i, maxValue))
    CPU_COL.push(`cpu${Math.floor(i / recordsPerLine)}`)
    TIME_COL.push(nowOrFixed(fixed) + (i % recordsPerLine) * 1000 * 60)
  }

  return newTable(numberOfRecords)
    .addColumn('_time', 'dateTime:RFC3339', 'time', TIME_COL)
    .addColumn('_value', 'system', 'number', VALUE_COL)
    .addColumn('cpu', 'string', 'string', CPU_COL)
}
