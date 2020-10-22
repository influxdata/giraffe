import {newTable} from '../../../giraffe/src/utils/newTable'
import memoizeOne from 'memoize-one'

const now = Date.now()
const numberOfRecords = 80
const recordsPerLine = 20

const TIME_COL = []
const VALUE_COL = []
const CPU_COL = []

function getRandomNumber(max) {
  return Math.random() * Math.floor(max) - max / 2
}

export const getRandomTable = memoizeOne((maxValue: number) => {
  for (let i = 0; i < numberOfRecords; i += 1) {
    VALUE_COL.push(getRandomNumber(maxValue))
    CPU_COL.push(`cpu${Math.floor(i / recordsPerLine)}`)
    TIME_COL.push(now + (i % recordsPerLine) * 1000 * 60)
  }

  const randomTable = newTable(numberOfRecords)
    .addColumn('_time', 'dateTime:RFC3339', 'time', TIME_COL)
    .addColumn('_value', 'system', 'number', VALUE_COL)
    .addColumn('cpu', 'string', 'string', CPU_COL)

  return randomTable
})
