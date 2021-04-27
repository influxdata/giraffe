import {newTable} from './newTable'
import {LayerTypes} from '../types'
import memoizeOne from 'memoize-one'

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
export const POINT_KEY = 'disk'
export const HOST_KEY = 'host'

const defaultNumberOfRecords = 80
const defaultRecordsPerLine = 20

export const makeColumnName = (length: number) => {
  let result = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

type ColumnsArg = number | Array<string>

interface RandomFillColumns {
  columnNames: Array<string>
  columnValues: Array<Array<string>>
}

export const getRandomTable = memoizeOne(
  (
    maxValue: number,
    includeNegative: boolean,
    numberOfRecords: number = defaultNumberOfRecords,
    recordsPerLine: number = defaultRecordsPerLine,
    fillColumns?: ColumnsArg,
    fillColumnNameLength?: number
  ) => {
    const timeColumn = []
    const valueColumn = []
    const cpuColumn = []
    const randomFillColumns = {
      columnNames: [],
      columnValues: [],
    } as RandomFillColumns
    const now = Date.now()

    for (let i = 0; i < numberOfRecords; i += 1) {
      valueColumn.push(getRandomNumber(maxValue, 2, includeNegative))
      cpuColumn.push(`cpu${Math.floor(i / recordsPerLine)}`)
      timeColumn.push(now + (i % recordsPerLine) * 1000 * 60)
    }

    if (!fillColumns) {
      randomFillColumns.columnNames.push('cpu')
      randomFillColumns.columnValues.push(cpuColumn)
    }

    if (typeof fillColumns === 'number') {
      const nameLength =
        typeof fillColumnNameLength === 'number' &&
        fillColumnNameLength === fillColumnNameLength
          ? fillColumnNameLength
          : 4
      for (let j = 0; j < fillColumns; j += 1) {
        const randomFillColumn = []
        const randomFillColumnName = makeColumnName(nameLength)
        for (let k = 0; k < numberOfRecords; k += 1) {
          randomFillColumn.push(
            `${randomFillColumnName}${Math.floor(k / recordsPerLine)}`
          )
        }
        randomFillColumns.columnNames.push(randomFillColumnName)
        randomFillColumns.columnValues.push(randomFillColumn)
      }
    }

    if (Array.isArray(fillColumns)) {
      for (let j = 0; j < fillColumns.length; j += 1) {
        const randomFillColumn = []
        const fillColumnName = fillColumns[j]
        for (let k = 0; k < numberOfRecords; k += 1) {
          randomFillColumn.push(
            `${fillColumnName}${Math.floor(k / recordsPerLine)}`
          )
        }
        randomFillColumns.columnNames.push(fillColumnName)
        randomFillColumns.columnValues.push(randomFillColumn)
      }
    }

    let table = newTable(numberOfRecords)
      .addColumn('_time', 'dateTime:RFC3339', 'time', timeColumn)
      .addColumn('_value', 'system', 'number', valueColumn)

    randomFillColumns.columnNames.forEach(
      (name, index) =>
        (table = table.addColumn(
          name,
          'string',
          'string',
          randomFillColumns.columnValues[index]
        ))
    )
    return table
  }
)

export interface SampleTableOptions {
  include_negative?: boolean
  all_negative?: boolean
  decimalPlaces?: number
  maxValue?: number
  numberOfRecords?: number
  recordsPerLine?: number
  plotType?: string
}

export const createSampleTable = (options: SampleTableOptions) => {
  const {
    include_negative = false,
    all_negative = false,
    decimalPlaces = 2,
    maxValue = 100,
    numberOfRecords = 20,
    recordsPerLine = 5,
    plotType = 'line',
  } = options

  const now = Date.now()
  const TIME_COL = []
  const VALUE_COL = []
  const CPU_COL = []
  const SYMBOL_COL = []
  const DISK_COL = []
  const HOST_COL = []

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
    if (plotType === LayerTypes.Scatter) {
      SYMBOL_COL.push(i % 2)
      DISK_COL.push(`disk-${i % recordsPerLine}`)
      HOST_COL.push(`host-${i % 2}`)
    }
  }
  const table = newTable(numberOfRecords)
    .addColumn('_time', 'dateTime:RFC3339', 'time', TIME_COL)
    .addColumn('_value', 'system', 'number', VALUE_COL)

  if (plotType === LayerTypes.Scatter) {
    return table
      .addColumn(POINT_KEY, 'string', 'string', DISK_COL)
      .addColumn('__symbol', 'string', 'string', SYMBOL_COL)
      .addColumn(HOST_KEY, 'string', 'string', HOST_COL)
  }
  return table.addColumn(COLUMN_KEY, 'string', 'string', CPU_COL)
}
