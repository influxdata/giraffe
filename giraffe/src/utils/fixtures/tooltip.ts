import {newTable} from '../newTable'

interface SampleTableOptions {
  include_negative?: boolean
  all_negative?: boolean
  decimalPlaces?: number
  maxValue?: number
  numberOfRecords?: number
  recordsPerLine?: number
}

const getRandomNumber = (
  max: number,
  decimalPlaces: number,
  include_negative?: boolean
) => {
  const result = include_negative
    ? Number((Math.random() * (2 * max + 1) - max).toFixed(decimalPlaces))
    : Number((Math.random() * max).toFixed(decimalPlaces))

  return result === -0 ? 0 : result // eslint-disable-line no-compare-neg-zero
}

export const COLUMN_KEY = 'cpu'

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
      num = all_negative
        ? Math.abs(num) * -1
        : getRandomNumber(maxValue, decimalPlaces, true)
    }
    VALUE_COL.push(num)
    CPU_COL.push(`${COLUMN_KEY}${Math.floor(i / recordsPerLine)}`)
    TIME_COL.push(now + (i % recordsPerLine) * 1000 * 60)
  }
  return newTable(numberOfRecords)
    .addColumn('_time', 'time', TIME_COL)
    .addColumn('_value', 'number', VALUE_COL)
    .addColumn('cpu', 'string', CPU_COL)
}
