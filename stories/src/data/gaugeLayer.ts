import {newTable, Table} from '../../../giraffe/src'
import memoizeOne from 'memoize-one'

const now = Date.now()
const numberOfRecords = 20
const recordsPerLine = 20

let TIME_COL: Array<number>
let VALUE_COL: Array<number>

function getRandomNumber(min: number, max: number) {
  return Math.random() * (max - min) + min
}
const createColumns = (minValue: number, maxValue: number) => {
  TIME_COL = []
  VALUE_COL = []
  for (let i = 0; i < numberOfRecords; i += 1) {
    VALUE_COL.push(getRandomNumber(minValue, maxValue))
    TIME_COL.push(now + (i % recordsPerLine) * 1000 * 60)
  }
}

export const gaugeTable = memoizeOne(
  (minValue: number, maxValue: number): Table => {
    createColumns(minValue, maxValue)
    return newTable(numberOfRecords)
      .addColumn('_time', 'dateTime:RFC3339', 'time', TIME_COL)
      .addColumn('_value', 'system', 'number', VALUE_COL)
  }
)
