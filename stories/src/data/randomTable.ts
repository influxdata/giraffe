import {newTable} from '../../../giraffe/src/utils/newTable'
import memoizeOne from 'memoize-one'

const now = Date.now()
const defaultNumberOfRecords = 80
const defaultRecordsPerLine = 20

function getRandomNumber(max) {
  return Math.random() * Math.floor(max) - max / 2
}

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

    for (let i = 0; i < numberOfRecords; i += 1) {
      valueColumn.push(getRandomNumber(maxValue))
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
