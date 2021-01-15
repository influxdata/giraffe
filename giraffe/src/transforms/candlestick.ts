import {pairs} from 'd3-array'
import {CandlestickLayerConfig, CandlestickLayerSpec, Table} from '../types'
import {Sorting} from '../utils/array'

// Window auto-detection will select n-th smallest distance based on collection size,
// to ensure skipping possible anomalies with smaller window size
const WINDOW_DETECT_NTH_SMALLEST_DIST_PERCENT = 5

const {ascending} = Sorting

export const candlestickTransform = (
  inputTable: Table,
  layerConfig: Required<CandlestickLayerConfig>
): CandlestickLayerSpec => {
  const {
    xColumnKey,
    openColumnKey,
    highColumnKey,
    lowColumnKey,
    closeColumnKey,
  } = layerConfig

  const xCol = inputTable.getColumn(xColumnKey, 'number')

  const openCol = inputTable.getColumn(openColumnKey, 'number')
  const highCol = inputTable.getColumn(highColumnKey, 'number')
  const lowCol = inputTable.getColumn(lowColumnKey, 'number')
  const closeCol = inputTable.getColumn(closeColumnKey, 'number')

  let xKeyMin = Infinity
  let xKeyMax = -Infinity
  let yMin = Infinity
  let yMax = -Infinity

  // distence between two values
  const window =
    typeof layerConfig.window === 'number'
      ? layerConfig.window
      : pairs([...xCol].sort(ascending))
          .map(([x, y]) => y - x)
          .filter(x => x !== 0 && !Number.isNaN(x))
          .sort(ascending)[
          Math.floor(
            (xCol.length * WINDOW_DETECT_NTH_SMALLEST_DIST_PERCENT) / 100
          )
        ]

  // key is index rastered by window (value/window)
  // [x0, x1] range of candle for selecting open/close
  const valuesWithOrigX: {
    [key: number]: {
      candle: CandlestickLayerSpec['values'][0]
      xRange: [number, number]
    }
  } = {}
  for (let i = 0; i < inputTable.length; i++) {
    const x = xCol[i]
    const xKey = Math.round(x / window)

    const open = openCol[i]
    const high = highCol[i]
    const low = lowCol[i]
    const close = closeCol[i]

    xKeyMin = Math.min(xKeyMin, xKey)
    xKeyMax = Math.max(xKeyMax, xKey)
    yMin = Math.min(yMin, open, high, low, close)
    yMax = Math.max(yMax, open, high, low, close)

    // todo: filtering NaN ?
    const candle = {open, high, low, close}
    if (valuesWithOrigX[xKey]) {
      const {candle: candle2, xRange: x2Range} = valuesWithOrigX[xKey]
      // merge candles
      valuesWithOrigX[xKey] = {
        candle: {
          close: x2Range[1] >= x ? candle2.close : candle.close,
          open: x2Range[0] < x ? candle2.open : candle.open,
          high: Math.max(candle2.high, candle.high),
          low: Math.min(candle2.low, candle.low),
        },
        xRange: [Math.min(x, ...x2Range), Math.max(x, ...x2Range)],
      }
    } else {
      valuesWithOrigX[xKey] = {candle, xRange: [x, x]}
    }
  }

  const values = Object.fromEntries(
    Object.entries(valuesWithOrigX).map(([x, y]) => [x, y.candle])
  )

  const xMin = (xKeyMin - 0.5) * window
  const xMax = (xKeyMax + 0.5) * window

  // todo
  const res = {
    type: 'candlestick',
    inputTable,
    values,
    calculatedWindow: window,
    xDomain: [xMin, xMax],
    yDomain: [yMin, yMax],
    xColumnKey,
    xColumnType: inputTable.getColumnType(xColumnKey),
  } as CandlestickLayerSpec
  return res as any
}
