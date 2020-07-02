import {newTable} from '../../../giraffe/src'

const CPU_TIME_COL = [
  1554308748000,
  1554308999000,
  1554309200000,
  1554309600000,
  1554310000000,
  1554311238000,
  1554308748000,
  1554308999000,
  1554309200000,
  1554309600000,
  1554310000000,
  1554311238000,
]

const CPU_VALUE_COL = [
  'yes',
  'yes',
  'yes',
  'no',
  'no',
  'no',
  'maybe',
  'so',
  'so',
  'yes',
  'maybe',
  'maybe',
]

const CPU_CPU_COL = [
  'break0',
  'break0',
  'break0',
  'break0',
  'break0',
  'break0',
  'break1',
  'break1',
  'break1',
  'break1',
  'break1',
  'break1',
]

const CPU_HOST_COL = [
  'rose',
  'rose',
  'rose',
  'rose',
  'rose',
  'rose',
  'rashi',
  'rashi',
  'rashi',
  'rashi',
  'rashi',
  'rashi',
]

export const SERIES = newTable(12)
  .addColumn('_time', 'time', CPU_TIME_COL)
  .addColumn('_value', 'string', CPU_VALUE_COL)
  .addColumn('cpu', 'string', CPU_CPU_COL)
  .addColumn('host', 'string', CPU_HOST_COL)
