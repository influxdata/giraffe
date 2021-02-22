import * as React from 'react'
import {storiesOf} from '@storybook/react'
import {withKnobs, number, select, text, boolean} from '@storybook/addon-knobs'
import {Config, fromFlux, InfluxColors, Plot} from '../../giraffe/src'

import {PlotContainer} from './helpers'
import {CANDLESTICK_THEME_DARK} from '../../giraffe/src/constants/candlestickStyles'
import {CandlestickLayerConfig, CandleStyle} from '../../giraffe/src/types'

import {
  ohlcCsvSample1,
  ohlcCsvSample1MissingCandles,
  ohlcCsvSampleBinance,
} from './data/ohlc'

type Theme = Required<CandlestickLayerConfig>

const knobGroups = {
  basics: 'basics',
  sizing: 'sizing',
  colors: 'colors',
  table: 'table',
}

const color = (() => {
  const colors = (() => {
    const obj = {}
    Object.keys(InfluxColors).forEach(x => (obj[x] = InfluxColors[x]))
    return obj
  })()

  return (label: string, ...rest: any[]) => select(label, colors, ...rest)
})()

const candleStyle = (
  candleName: string,
  candleDefaults: Partial<CandleStyle>,
  candleDefaultsFallback?: CandleStyle
): CandleStyle => ({
  bodyColor: color(
    `${candleName} bodyColor`,
    candleDefaults.bodyColor ?? candleDefaultsFallback.bodyColor,
    knobGroups.colors
  ),
  bodyFillOpacity: number(
    `${candleName} bodyFillOpacity`,
    candleDefaults.bodyFillOpacity ?? candleDefaultsFallback.bodyFillOpacity,
    {},
    knobGroups.colors
  ),
  bodyRounding: number(
    `${candleName} bodyRounding`,
    candleDefaults.bodyRounding ?? candleDefaultsFallback.bodyRounding,
    {},
    knobGroups.sizing
  ),
  bodyStrokeWidth: number(
    `${candleName} bodyStrokeWidth`,
    candleDefaults.bodyStrokeWidth ?? candleDefaultsFallback.bodyStrokeWidth,
    {},
    knobGroups.sizing
  ),
  shadowColor: color(
    `${candleName} shadowColor`,
    candleDefaults.shadowColor ?? candleDefaultsFallback.shadowColor,
    knobGroups.colors
  ),
  shadowStrokeWidth: number(
    `${candleName} shadowStrokeWidth`,
    candleDefaults.shadowStrokeWidth ??
      candleDefaultsFallback.shadowStrokeWidth,
    {},
    knobGroups.sizing
  ),
})

const editableLayer = (theme: Theme): Theme => ({
  type: theme.type,
  mode: select(
    'Mode',
    {
      candles: 'candles',
      fence: 'fence',
    },
    theme.mode,
    knobGroups.basics
  ),
  candlePadding: number(
    'padding candle',
    theme.candlePadding,
    {},
    knobGroups.sizing
  ),

  candleRaising: candleStyle('candleRaising', theme.candleRaising),
  candleRaisingHover: candleStyle(
    'candleRaisingHover',
    theme.candleRaisingHover,
    theme.candleRaising
  ),
  candleDecreasing: candleStyle('candleDecreasing', theme.candleDecreasing),
  candleDecreasingHover: candleStyle(
    'candleDecreasingHover',
    theme.candleDecreasingHover,
    theme.candleDecreasing
  ),
  xColumnKey: text('xColumn', theme.xColumnKey, knobGroups.table),
  openColumnKey: text('openColumnKey', theme.openColumnKey, knobGroups.table),
  highColumnKey: text('highColumnKey', theme.highColumnKey, knobGroups.table),
  lowColumnKey: text('lowColumnKey', theme.lowColumnKey, knobGroups.table),
  closeColumnKey: text(
    'closeColumnKey',
    theme.closeColumnKey,
    knobGroups.table
  ),
  window: (() => {
    const detect = boolean(
      'window detect',
      theme.window === 'detect',
      knobGroups.basics
    )
    if (detect) return 'detect'
    return number(
      'window fixed',
      typeof theme.window === 'number' || 1_000,
      {},
      knobGroups.basics
    )
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
  .add(
    'Candlestick simple',
    createStory(CANDLESTICK_THEME_DARK, ohlcCsvSample1)
  )
  .add(
    'Candlestick simple fence',
    createStory({...CANDLESTICK_THEME_DARK, mode: 'fence'}, ohlcCsvSample1)
  )
  .add(
    'Candlestick missing candles',
    createStory(CANDLESTICK_THEME_DARK, ohlcCsvSample1MissingCandles)
  )
  .add(
    'Candlestick binance BTC/USDT',
    createStory(CANDLESTICK_THEME_DARK, ohlcCsvSampleBinance)
  )
