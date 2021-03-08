import {newTable} from '../../../giraffe/src'
import {getRandomOrFixed, nowOrFixed} from './utils'

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

function getRandomString(fixed: boolean, i: number) {
  function getRandomAlphabetChar(ii: number) {
    const index = Math.floor(
      getRandomOrFixed(fixed, ii + i, alphabet.length - 1)
    )
    return alphabet[index]
  }

  const stringLength = getRandomOrFixed(fixed, i, maxStringLength)
  let randomString = ''

  for (let i = 0; i <= stringLength; i++) {
    randomString += getRandomAlphabetChar(i)
  }

  return randomString
}

export const getStackedLineTable = (fixed: boolean) => {
  const TIME_COL = []
  const VALUE_COL = []
  const CPU_COL = []
  const TEST_COL_A = []
  const TEST_COL_B = []
  const TEST_COL_C = []
  const TEST_COL_D = []

  for (let i = 0; i < numberOfRecords; i += 1) {
    VALUE_COL.push(getRandomOrFixed(fixed, i, maxValue))
    CPU_COL.push(`cpu${Math.floor(i / recordsPerLine)}`)
    TIME_COL.push(nowOrFixed(fixed) + (i % recordsPerLine) * 1000 * 60)
    TEST_COL_A.push(getRandomString(fixed, i * 4 + 0))
    TEST_COL_B.push(getRandomString(fixed, i * 4 + 1))
    TEST_COL_C.push(getRandomString(fixed, i * 4 + 2))
    TEST_COL_D.push(getRandomString(fixed, i * 4 + 3))
  }

  return newTable(numberOfRecords)
    .addColumn('_time', 'dateTime:RFC3339', 'time', TIME_COL)
    .addColumn('_value', 'system', 'number', VALUE_COL)
    .addColumn('cpu', 'string', 'string', CPU_COL)
    .addColumn('test_col_a', 'string', 'string', TEST_COL_A)
    .addColumn('test_col_b', 'string', 'string', TEST_COL_B)
    .addColumn('test_col_c', 'string', 'string', TEST_COL_C)
    .addColumn('test_col_d', 'string', 'string', TEST_COL_D)
}
