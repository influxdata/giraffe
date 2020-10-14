import {newTable} from '../newTable'

const now = Date.now()
const numberOfLines = 1_000
const dataPointsPerLine = 1_000
const numberOfRecords = numberOfLines * dataPointsPerLine
const maxValue = 100

function getRandomNumber(max: number) {
  return Math.random() * Math.floor(max)
}

function getRandomColor() {
  return Math.floor(Math.random() * 255)
}
const lineData = {}
const TIME_COL = []
const VALUE_COL = []
const CPU_COL = []

for (let lineNumber = 0; lineNumber < numberOfLines; lineNumber += 1) {
  lineData[lineNumber] = {
    // prettier-ignore
    fill: `rgb(${getRandomColor()}, ${getRandomColor()}, ${getRandomColor()})`,
    xs: [],
    ys: [],
  }
  for (let dataPoint = 0; dataPoint < dataPointsPerLine; dataPoint += 1) {
    const time = now + (dataPoint % dataPointsPerLine) * 1000 * 60
    const randomNumber = getRandomNumber(maxValue)
    const index = lineNumber * numberOfLines + dataPointsPerLine

    lineData[lineNumber].xs.push(time)
    TIME_COL.push(time)

    lineData[lineNumber].ys.push(randomNumber)
    VALUE_COL.push(randomNumber)
    CPU_COL.push(`cpu${Math.floor(index / dataPointsPerLine)}`)
  }
}

const largeTable = newTable(numberOfRecords)
  .addColumn('_time', 'dateTime:RFC3339', 'time', TIME_COL)
  .addColumn('_value', 'system', 'number', VALUE_COL)
  .addColumn('cpu', 'string', 'string', CPU_COL)

export {largeTable, lineData}
