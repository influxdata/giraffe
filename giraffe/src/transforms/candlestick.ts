import {CandlestickLayerConfig, CandlestickLayerSpec, Table} from '../types'
import {calculateWindow, getOhlcValues} from '../utils/ohlc'

export const candlestickTransform = (
  inputTable: Table,
  layerConfig: Required<CandlestickLayerConfig>
): CandlestickLayerSpec => {
  const {xColumnKey, openColumnKey} = layerConfig

  const xCol = inputTable.getColumn(xColumnKey, 'number')

  // distence between two values
  const window = calculateWindow(layerConfig.window, xCol)

  const values = getOhlcValues(inputTable, layerConfig, window)

  let xMin = values[0].windowStart
  let xMax = values[0].windowStart
  let yMin = Infinity
  let yMax = -Infinity

  values.forEach(({windowStart, yRange}) => {
    if (windowStart < xMin) {
      xMin = windowStart
    } else if (windowStart > xMax) {
      xMax = windowStart
    }

    yMin = Math.min(yMin, yRange[0])
    yMax = Math.max(yMax, yRange[1])
  })

  // xMax is window start but we want to show whole window
  xMax += window

  const yColumnKey = openColumnKey

  const res: CandlestickLayerSpec = {
    type: 'candlestick',
    inputTable,
    table: inputTable,
    values,
    calculatedWindow: window,
    xDomain: [xMin, xMax],
    yDomain: [yMin, yMax],
    xColumnKey,
    xColumnType: inputTable.getColumnType(xColumnKey),
    yColumnKey,
    yColumnType: inputTable.getColumnType(yColumnKey),
  }
  return res
}
