import {CandlestickLayerConfig} from '../types'
import {InfluxColors} from './colorSchemes'

export const CANDLESTICK_THEME_DARK: Required<CandlestickLayerConfig> = {
  type: 'candlestick',
  mode: 'candles',
  xColumnKey: '_time',
  openColumnKey: 'open',
  highColumnKey: 'high',
  lowColumnKey: 'low',
  closeColumnKey: 'close',

  window: 'detect',

  candlePadding: 10,

  candleRaising: {
    bodyColor: InfluxColors.Krypton,
    bodyFillOpacity: 1,
    bodyRounding: 4,
    bodyStrokeWidth: 2,
    shadowColor: InfluxColors.Krypton,
    shadowStrokeWidth: 2,
  },
  candleRaisingHover: {
    bodyFillOpacity: 0.9,
    bodyStrokeWidth: 6,
    shadowStrokeWidth: 6,
  },
  candleDecreasing: {
    bodyColor: InfluxColors.Curacao,
    bodyFillOpacity: 0,
    bodyRounding: 0,
    bodyStrokeWidth: 2,
    shadowColor: InfluxColors.Curacao,
    shadowStrokeWidth: 2,
  },
  candleDecreasingHover: {
    bodyFillOpacity: 0.3,
    bodyStrokeWidth: 6,
    shadowStrokeWidth: 6,
  },
}
