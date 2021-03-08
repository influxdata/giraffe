import {newTable} from '../../../giraffe/src'
import {getRandomOrFixed, nowOrFixed} from './utils'

const numberOfRecords = 40
const recordsPerLine = 20
const maxValue = 100

const fieldName = 'usage_system'
const measurementName = 'cpu'

export const getBandTable = (fixed: boolean) => {
  const TIME_COL = []
  const VALUE_COL = []
  const CPU_COL = []
  const FIELD_COL = []
  const MEASUREMENT_COL = []

  for (let i = 0; i < numberOfRecords; i += 1) {
    FIELD_COL.push(fieldName)
    MEASUREMENT_COL.push(measurementName)
    VALUE_COL.push(getRandomOrFixed(fixed, i, maxValue))
    CPU_COL.push(`cpu${Math.floor(i / recordsPerLine)}`)
    TIME_COL.push(nowOrFixed(fixed) + (i % recordsPerLine) * 1000 * 60)
  }

  return newTable(numberOfRecords)
    .addColumn('_field', 'string', 'string', FIELD_COL)
    .addColumn('_measurement', 'string', 'string', MEASUREMENT_COL)
    .addColumn('_time', 'dateTime:RFC3339', 'time', TIME_COL)
    .addColumn('_value', 'system', 'number', VALUE_COL)
    .addColumn('cpu', 'string', 'string', CPU_COL)
}
