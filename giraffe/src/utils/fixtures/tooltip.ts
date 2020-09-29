import {newTable} from '../newTable'
import {LayerTypes} from '../../types'

interface SampleTableOptions {
  include_negative?: boolean
  all_negative?: boolean
  decimalPlaces?: number
  maxValue?: number
  numberOfRecords?: number
  recordsPerLine?: number
  plotType?: string
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
export const POINT_KEY = 'disk'
export const HOST_KEY = 'host'

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
