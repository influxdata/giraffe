import {newTable} from '../../../giraffe/src'

const now = Date.now()
const numberOfRecords = 20
const recordsPerLine = 20
const maxValue = 10

const TIME_COL = []
const VALUE_COL = []
const CPU_COL = []

function getRandomNumber(max) {
  return Math.random() * Math.floor(max)
}
for (let i = 0; i < numberOfRecords; i += 1) {
  VALUE_COL.push(getRandomNumber(maxValue))
  CPU_COL.push(`cpu${Math.floor(i / recordsPerLine)}`)
  TIME_COL.push(now + (i % recordsPerLine) * 1000 * 60)
}

export const singleStatTable = newTable(numberOfRecords)
  .addColumn('_time', 'time', TIME_COL)
  .addColumn('_value', 'number', VALUE_COL)
  .addColumn('cpu', 'string', CPU_COL)
