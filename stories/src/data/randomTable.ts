import {newTable} from '../../../giraffe/src/utils/newTable'
import memoizeOne from 'memoize-one'

const now = Date.now()
const defaultNumberOfRecords = 80
const defaultRecordsPerLine = 20

function getRandomNumber(max) {
  return Math.random() * Math.floor(max) - max / 2
}

export const getRandomTable = memoizeOne(
  (
    maxValue: number,
    numberOfRecords: number = defaultNumberOfRecords,
    recordsPerLine: number = defaultRecordsPerLine
  ) => {
    const timeColumn = []
    const valueColumn = []
    const cpuColumn = []

    for (let i = 0; i < numberOfRecords; i += 1) {
      valueColumn.push(getRandomNumber(maxValue))
      cpuColumn.push(`cpu${Math.floor(i / recordsPerLine)}`)
      timeColumn.push(now + (i % recordsPerLine) * 1000 * 60)
    }

    return newTable(numberOfRecords)
      .addColumn('_time', 'dateTime:RFC3339', 'time', timeColumn)
      .addColumn('_value', 'system', 'number', valueColumn)
      .addColumn('cpu', 'string', 'string', cpuColumn)
  }
)
