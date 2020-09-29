import {newTable} from '../../../giraffe/src'

const now = Date.now()
const numberOfRecords = 80
const recordsPerLine = 20
const maxValue = 100
const maxStringLength = 120

const alphabet = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
]

const TIME_COL = []
const VALUE_COL = []
const CPU_COL = []
const TEST_COL_A = []
const TEST_COL_B = []
const TEST_COL_C = []
const TEST_COL_D = []

function getRandomNumber(max) {
  return Math.random() * Math.floor(max)
}

function getRandomAlphabetChar() {
  const index = Math.floor(Math.random() * (alphabet.length - 1))
  return alphabet[index]
}

function getRandomString() {
  const stringLength = getRandomNumber(maxStringLength)
  let randomString = ''

  for (let i = 0; i <= stringLength; i++) {
    randomString += getRandomAlphabetChar()
  }

  return randomString
}

for (let i = 0; i < numberOfRecords; i += 1) {
  VALUE_COL.push(getRandomNumber(maxValue))
  CPU_COL.push(`cpu${Math.floor(i / recordsPerLine)}`)
  TIME_COL.push(now + (i % recordsPerLine) * 1000 * 60)
  TEST_COL_A.push(getRandomString())
  TEST_COL_B.push(getRandomString())
  TEST_COL_C.push(getRandomString())
  TEST_COL_D.push(getRandomString())
}

export const stackedLineTable = newTable(numberOfRecords)
  .addColumn('_time', 'dateTime:RFC3339', 'time', TIME_COL)
  .addColumn('_value', 'system', 'number', VALUE_COL)
  .addColumn('cpu', 'string', 'string', CPU_COL)
  .addColumn('test_col_a', 'string', 'string', TEST_COL_A)
  .addColumn('test_col_b', 'string', 'string', TEST_COL_B)
  .addColumn('test_col_c', 'string', 'string', TEST_COL_C)
  .addColumn('test_col_d', 'string', 'string', TEST_COL_D)
