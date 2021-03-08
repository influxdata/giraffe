import { newTable } from '../../../giraffe/src/utils/newTable'
import memoizeOne from 'memoize-one'
import { getRandomOrFixed, nowOrFixed } from "./utils"

const defaultNumberOfRecords = 80
const defaultRecordsPerLine = 20

export const getRandomTable = memoizeOne(
  (
    fixed: boolean,
    maxValue: number = 200,
    numberOfRecords: number = defaultNumberOfRecords,
    recordsPerLine: number = defaultRecordsPerLine
  ) => {
    const timeColumn = []
    const valueColumn = []
    const cpuColumn = []

    for (let i = 0; i < numberOfRecords; i += 1) {
      valueColumn.push(getRandomOrFixed(fixed, i, maxValue))
      cpuColumn.push(`cpu${Math.floor(i / recordsPerLine)}`)
      timeColumn.push(nowOrFixed(fixed) + (i % recordsPerLine) * 1000 * 60)
    }

    return newTable(numberOfRecords)
      .addColumn('_time', 'dateTime:RFC3339', 'time', timeColumn)
      .addColumn('_value', 'system', 'number', valueColumn)
      .addColumn('cpu', 'string', 'string', cpuColumn)
  }
)
