import {newTable, Table} from '../../../giraffe/src'
import memoizeOne from 'memoize-one'

const now = Date.now()
const numberOfRecords = 20
const recordsPerLine = 20

let TIME_COL: Array<number>
let VALUE_COL: Array<number>
let FIELD_COL: Array<string>

function getRandomNumber(min: number, max: number) {
  return Math.random() * (max - min) + min
}
const createColumns = (minValue: number, maxValue: number, fields: number) => {
  TIME_COL = []
  VALUE_COL = []
  FIELD_COL = []
  for (let i = 0; i < numberOfRecords * fields; i += 1) {
    VALUE_COL.push(getRandomNumber(minValue, maxValue))
    TIME_COL.push(now + ((i % recordsPerLine) % fields) * 1000 * 60)
    FIELD_COL.push(gaugeMiniTableGetField(Math.floor(i / numberOfRecords)))
  }
}

/** return field name for given index */
export const gaugeMiniTableGetField = (i: number) => `_field_${i}`

export const gaugeMiniTable = memoizeOne(
  (minValue: number, maxValue: number, fields: number): Table => {
    createColumns(minValue, maxValue, fields)
    return newTable(numberOfRecords * fields)
      .addColumn('_time', 'dateTime:RFC3339', 'time', TIME_COL)
      .addColumn('_value', 'system', 'number', VALUE_COL)
      .addColumn('_field', 'string', 'string', FIELD_COL)
  }
)
