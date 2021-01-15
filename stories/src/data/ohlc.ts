// todo: modify OHLC function to have selectable source(_time, _value) and target columns(open, ...)
// todo: find way to integrate OHLC function into flux
/*
OHLC data flux query example:

OHLC = (tables=<-, time) => {
  O = tables
    |> aggregateWindow(every: time, fn: first, createEmpty: false)
    |> yield(name: "first")
    |> keep(columns: ["_time", "_value"])
    |> rename(columns: {_value: "open"})

  H = tables
    |> aggregateWindow(every: time, fn: max, createEmpty: false)
    |> yield(name: "max")
    |> keep(columns: ["_time", "_value"])
    |> rename(columns: {_value: "high"})

  L = tables
    |> aggregateWindow(every: time, fn: min, createEmpty: false)
    |> yield(name: "min")
    |> keep(columns: ["_time", "_value"])
    |> rename(columns: {_value: "low"})

  C = tables
    |> aggregateWindow(every: time, fn: last, createEmpty: false)
    |> yield(name: "last")
    |> keep(columns: ["_time", "_value"])
    |> rename(columns: {_value: "close"})

  OH = join(tables: {O,H}, on:["_time"])
  LC = join(tables: {L,C}, on:["_time"])
  OHLC = join(tables: {OH, LC}, on:["_time"])

  return OHLC
}

from(bucket: "my-bucket")
  |> range(start: v.timeRangeStart, stop: v.timeRangeStop)
  |> filter(fn: (r) => r["_measurement"] == "cpu")
  |> filter(fn: (r) => r["_field"] == "usage_system")
  |> filter(fn: (r) => r["cpu"] == "cpu-total")
  |> OHLC(time: 2m)
*/

import {OHLCValue} from '../../../giraffe/src/types'
import {getBinanceOHLC} from './ohlc_Binance_BTCUSDT_1h.csv'

const dataSample1: (OHLCValue | undefined)[] = [
  {open: 50, high: 60, low: 45, close: 47},
  {open: 47, high: 55, low: 33, close: 35},
  {open: 32, high: 49, low: 28, close: 48},
  {open: 50, high: 63, low: 48, close: 56},
  {open: 56, high: 60, low: 53, close: 58},
  {open: 60, high: 67, low: 55, close: 63},
  {open: 70, high: 100, low: 62, close: 100},
  {open: 98, high: 99, low: 18, close: 30},
  {open: 34, high: 40, low: 32, close: 40},
  {open: 40, high: 50, low: 36, close: 48},
  {open: 55, high: 60, low: 43, close: 45},
  {open: 48, high: 52, low: 30, close: 35},
  {open: 37, high: 45, low: 35, close: 40},
  {open: 39, high: 47, low: 37, close: 45},
  {open: 43, high: 73, low: 28, close: 43},
  {open: 45, high: 78, low: 37, close: 63},
  {open: 74, high: 80, low: 40, close: 63},
  {open: 65, high: 68, low: 43, close: 50},
  {open: 53, high: 55, low: 43, close: 48},
  {open: 50, high: 53, low: 18, close: 38},
  {open: 40, high: 42, low: 37, close: 39},
  {open: 40, high: 41, low: 39, close: 40},
  {open: 38, high: 44, low: 36, close: 41},
  {open: 42, high: 47, low: 35, close: 40},
  {open: 38, high: 25, low: 75, close: 68},
  {open: 70, high: 83, low: 27, close: 30},
]

const timeWindow = 10_000

const header = `\
#group,false,false,false,false,false,false,false
#datatype,string,long,double,double,double,double,dateTime:RFC3339
#default,_result,,,,,,
,result,table,open,high,low,close,_time
`

const csvRow = (candle: OHLCValue & {date: Date}) => {
  return `,,0,${candle.open},${candle.high},${candle.low},${
    candle.close
  },${candle.date.toISOString()}`
}

const dataToCSV = (data: (OHLCValue | undefined)[]) => {
  const now = Date.now()

  return (
    header +
    data
      .map((x, i) => x && csvRow({...x, date: new Date(now + timeWindow * i)}))
      .filter(x => x)
      .join('\n')
  )
}

export const ohlcCsvSample1 = dataToCSV(dataSample1)

export const ohlcCsvSample1MissingCandles = dataToCSV(
  dataSample1.map(x => Math.random() > 0.2 && x)
)

export const ohlcCsvSampleBinance =
  header +
  getBinanceOHLC()
    .map(csvRow)
    .join('\n')
