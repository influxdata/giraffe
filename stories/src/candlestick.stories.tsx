import * as React from 'react'
import {storiesOf} from '@storybook/react'
import {withKnobs, number, select, text, boolean} from '@storybook/addon-knobs'
import {Config, fromFlux, InfluxColors, Plot} from '../../giraffe/src'

import {PlotContainer} from './helpers'
import {CANDLESTICK_THEME_DARK} from '../../giraffe/src/constants/candlestickStyles'
import {CandlestickLayerConfig} from '../../giraffe/src/types'

// todo: random csv
import {
  ohlcCsvSample1,
  ohlcCsvSample1MissingCandles,
  ohlcCsvSampleBinance,
} from './data/ohlc'

type Theme = Required<CandlestickLayerConfig>

const color = (() => {
  const colors = (() => {
    const obj = {}
    Object.keys(InfluxColors).forEach(x => (obj[x] = InfluxColors[x]))
    return obj
  })()

  // todo: type definitions
  return (label: string, ...rest: any[]) => select(label, colors, ...rest)
})()

const editableLayer = (theme: Theme): Theme => ({
  type: theme.type,
  mode: select(
    'Mode',
    {
      candles: 'candles',
      fence: 'fence',
    },
    theme.mode
  ),
  candlePadding: number('padding candle', theme.candlePadding),

  candleRaising: {
    bodyColor: color(
      'candleRaising - bodyColor',
      theme.candleRaising.bodyColor
    ),
    bodyFillOpacity: number(
      'candleRaising - bodyFillOpacity',
      theme.candleRaising.bodyFillOpacity
    ),
    bodyRounding: number(
      'candleRaising - bodyRounding',
      theme.candleRaising.bodyRounding
    ),
    bodyStrokeWidth: number(
      'candleRaising - bodyStrokeWidth',
      theme.candleRaising.bodyStrokeWidth
    ),
    shadowColor: color(
      'candleRaising - shadowColor',
      theme.candleRaising.shadowColor
    ),
    shadowStrokeWidth: number(
      'candleRaising - shadowStrokeWidth',
      theme.candleRaising.shadowStrokeWidth
    ),
  },

  candleDecreasing: {
    bodyColor: color(
      'candleDecreasing - bodyColor',
      theme.candleDecreasing.bodyColor
    ),
    bodyFillOpacity: number(
      'candleDecreasing - bodyFillOpacity',
      theme.candleDecreasing.bodyFillOpacity
    ),
    bodyRounding: number(
      'candleDecreasing - bodyRounding',
      theme.candleDecreasing.bodyRounding
    ),
    bodyStrokeWidth: number(
      'candleDecreasing - bodyStrokeWidth',
      theme.candleDecreasing.bodyStrokeWidth
    ),
    shadowColor: color(
      'candleDecreasing - shadowColor',
      theme.candleDecreasing.shadowColor
    ),
    shadowStrokeWidth: number(
      'candleDecreasing - shadowStrokeWidth',
      theme.candleDecreasing.shadowStrokeWidth
    ),
  },
  xColumnKey: text('xColumn', theme.xColumnKey),
  openColumnKey: text('openColumnKey', theme.openColumnKey),
  highColumnKey: text('highColumnKey', theme.highColumnKey),
  lowColumnKey: text('lowColumnKey', theme.lowColumnKey),
  closeColumnKey: text('closeColumnKey', theme.closeColumnKey),
  window: (() => {
    const detect = boolean('window detect', theme.window === 'detect')
    if (detect) return 'detect'
    return number('window fixed', typeof theme.window === 'number' || 1_000)
  })(),
})

const createStory = (theme: Theme, csv: string) => () => {
  const layer = editableLayer(theme)
  const fromFluxTable = fromFlux(csv).table

  const config: Config = {
    table: fromFluxTable,
    layers: [layer],
  }

  return (
    <>
      <PlotContainer>
        <Plot config={config} />
      </PlotContainer>
    </>
  )
}

storiesOf('Candlestick', module)
  .addDecorator(withKnobs)
  // todo: candlestick fences
  .add(
    'Candlestick simple',
    createStory(CANDLESTICK_THEME_DARK, ohlcCsvSample1)
  )
  .add(
    'Candlestick missing candles',
    createStory(CANDLESTICK_THEME_DARK, ohlcCsvSample1MissingCandles)
  )
  .add(
    'Candlestick binance BTC/USDT',
    createStory(CANDLESTICK_THEME_DARK, ohlcCsvSampleBinance)
  )
