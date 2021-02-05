import {pairs} from 'd3-array'
import {
  CandlestickLayerConfig,
  NumericColumnData,
  OHLCValue,
  Table,
} from '../types'
import {Sorting} from './array'

const {ascending} = Sorting

// Window auto-detection will select n-th smallest distance based on collection size,
// to ensure skipping possible anomalies with smaller window size
const WINDOW_DETECT_NTH_SMALLEST_DIST_PERCENT = 5

type OHLCColumns = {
  xColumnKey: string
  openColumnKey: string
  highColumnKey: string
  lowColumnKey: string
  closeColumnKey: string
}

export type Range = [number, number]

export type OHLCResultEntry = {
  windowStart: number
  xRange: Range
  yRange: Range
  entriesTableIndexes: number[]
  value: OHLCValue
}

export const getOhlcValues = (
  table: Table,
  columns: OHLCColumns,
  window: number
): OHLCResultEntry[] => {
  const {
    xColumnKey,
    openColumnKey,
    highColumnKey,
    lowColumnKey,
    closeColumnKey,
  } = columns
  const xCol = table.getColumn(xColumnKey, 'number')

  const obj: {
    [key: number]: number[]
  } = {}
  for (let i = 0; i < table.length; i++) {
    const x = xCol[i]
    const xKey = Math.round(x / window) * window

    const targetArray = obj[xKey]
    if (targetArray) {
      targetArray.push(i)
    } else {
      obj[xKey] = [i]
    }
  }

  const openCol = table.getColumn(openColumnKey, 'number')
  const highCol = table.getColumn(highColumnKey, 'number')
  const lowCol = table.getColumn(lowColumnKey, 'number')
  const closeCol = table.getColumn(closeColumnKey, 'number')

  return Object.entries(obj)
    .map(([a, b]) => [+a, b] as const)
    .map(([windowStart, entriesTableIndexes]) => {
      let close = 0
      let high = -Infinity
      let low = Infinity
      let open = 0

      let xMin = Infinity
      let xMax = -Infinity
      let yMin = Infinity
      let yMax = -Infinity

      entriesTableIndexes.forEach(i => {
        const x = xCol[i]
        const o = openCol[i]
        const h = highCol[i]
        const l = lowCol[i]
        const c = closeCol[i]

        xMin = Math.min(xMin, x)
        xMax = Math.max(xMax, x)
        yMin = Math.min(yMin, o, h, l, c)
        yMax = Math.max(yMax, o, h, l, c)

        if (xMin === x) {
          open = o
        }
        if (xMax === x) {
          close = c
        }
        high = Math.max(high, h)
        low = Math.min(low, l)
      })

      return {
        windowStart,
        entriesTableIndexes,
        xRange: [xMin, xMax],
        yRange: [yMin, yMax],
        value: {
          open,
          high,
          low,
          close,
        },
      }
    })
}

export const calculateWindow = (
  window: number | 'detect',
  xCol: NumericColumnData
): number => {
  return typeof window === 'number'
    ? window
    : pairs([...xCol].sort(ascending))
        .map(([x, y]) => y - x)
        .filter(x => x !== 0 && !Number.isNaN(x))
        .sort(ascending)[
        Math.floor(
          (xCol.length * WINDOW_DETECT_NTH_SMALLEST_DIST_PERCENT) / 100
        )
      ]
}
