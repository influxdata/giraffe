import {newTable} from '../newTable'

interface SampleTableOptions {
  include_negative?: boolean
  all_negative?: boolean
  decimalPlaces?: number
  maxValue?: number
  numberOfRecords?: number
  recordsPerLine?: number
  hoveredRowIndices?: number[]
}

const turnNegativeRandomly = (num: number) =>
  num * (Math.floor(Math.random() * 2 + 1) === 1 ? 1 : -1)

const getRandomNumber = (max: number, decimalPlaces: number) =>
  Number((Math.random() * Math.floor(max)).toFixed(decimalPlaces))

export const columnKey = 'cpu'

export const createSampleTable = (options: SampleTableOptions) => {
  const {
    include_negative = false,
    all_negative = false,
    decimalPlaces = 2,
    maxValue = 100,
    numberOfRecords = 20,
    recordsPerLine = 5,
  } = options

  const now = Date.now()
  const TIME_COL = []
  const VALUE_COL = []
  const CPU_COL = []

  for (let i = 0; i < numberOfRecords; i += 1) {
    let num = getRandomNumber(maxValue, decimalPlaces)
    if (include_negative) {
      num = all_negative ? Math.abs(num) * -1 : turnNegativeRandomly(num)
    }
    VALUE_COL.push(num)
    CPU_COL.push(`${columnKey}${Math.floor(i / recordsPerLine)}`)
    TIME_COL.push(now + (i % recordsPerLine) * 1000 * 60)
  }
  return newTable(numberOfRecords)
    .addColumn('_time', 'time', TIME_COL)
    .addColumn('_value', 'number', VALUE_COL)
    .addColumn('cpu', 'string', CPU_COL)
}
