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
  'eenie',
  'eenie',
  'eenie',
  'meenie',
  'meenie',
  'meenie',
  'miney',
  'mo',
  'mo',
  'eenie',
  'miney',
  'miney',
]

const CPU_CPU_COL = [
  'cpu0',
  'cpu0',
  'cpu0',
  'cpu0',
  'cpu0',
  'cpu0',
  'cpu1',
  'cpu1',
  'cpu1',
  'cpu1',
  'cpu1',
  'cpu1',
]

const CPU_HOST_COL = [
  'host1',
  'host1',
  'host1',
  'host1',
  'host1',
  'host1',
  'host2',
  'host2',
  'host2',
  'host2',
  'host2',
  'host2',
]

export const SERIES = newTable(12)
  .addColumn('_time', 'time', CPU_TIME_COL)
  .addColumn('_value', 'string', CPU_VALUE_COL)
  .addColumn('cpu', 'string', CPU_CPU_COL)
  .addColumn('host', 'string', CPU_HOST_COL)
