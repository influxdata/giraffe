import {newTable} from '../../../giraffe/src'

const now = Date.now()
const numberOfRecords = 80
const recordsPerLine = 20
const maxIntValue = 100

const TIME_COL = []
const VALUE_COL = []
const CPU_COL = []

function getRandomInt(max) {
  return Math.random() * Math.floor(max)
}
for (let i = 0; i < numberOfRecords; i += 1) {
  VALUE_COL.push(getRandomInt(maxIntValue))
  CPU_COL.push(`cpu${Math.floor(i / recordsPerLine)}`)
  TIME_COL.push(now + (i % recordsPerLine) * 1000 * 60)
}

export const stackedLineLayer = newTable(numberOfRecords)
  .addColumn('_time', 'time', TIME_COL)
  .addColumn('_value', 'number', VALUE_COL)
  .addColumn('cpu', 'string', CPU_COL)
