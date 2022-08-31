import * as React from 'react'
import {storiesOf} from '@storybook/react'
import {withKnobs, number} from '@storybook/addon-knobs'

import {Config, Plot, MAGMA} from '../../giraffe/src'

import {
  PlotContainer,
  colorSchemeKnob,
  getCPUTable,
  legendFontKnob,
  showAxesKnob,
  tickFontKnob,
  tooltipColorizeRowsKnob,
  tooltipOrientationThresholdKnob,
  xKnob,
  xScaleKnob,
  yKnob,
  yScaleKnob,
} from './helpers'

storiesOf('Rect', module)
  .addDecorator(withKnobs)
  .add('Heatmap', () => {
    const table = getCPUTable()
    const colors = colorSchemeKnob(MAGMA)
    const legendFont = legendFontKnob()
    const tickFont = tickFontKnob()
    const x = xKnob(table)
    const y = yKnob(table)
    const xScale = xScaleKnob()
    const yScale = yScaleKnob()
    const showAxes = showAxesKnob()
    const legendOrientationThreshold = tooltipOrientationThresholdKnob()
    const legendColorizeRows = tooltipColorizeRowsKnob()

    const config: Config = {
      table,
      legendFont,
      legendOrientationThreshold,
      legendColorizeRows,
      xScale,
      yScale,
      tickFont,
      showAxes,
      valueFormatters: {_value: val => `${Math.round(val)}%`},
      layers: [{type: 'heatmap', x, y, colors}],
    }

    return (
      <PlotContainer>
        <Plot config={config} />
      </PlotContainer>
    )
  })
  .add('Histogram', () => {
    const table = getCPUTable()
    const colors = colorSchemeKnob()
    const legendFont = legendFontKnob()
    const tickFont = tickFontKnob()
    const x = xKnob(table, '_value')
    const xScale = xScaleKnob()
    const yScale = yScaleKnob()
    const showAxes = showAxesKnob()
    const binCount = number('Bin Count', 10)
    const legendOrientationThreshold = tooltipOrientationThresholdKnob()
    const legendColorizeRows = tooltipColorizeRowsKnob()

    const config: Config = {
      table,
      legendFont,
      legendOrientationThreshold,
      legendColorizeRows,
      tickFont,
      showAxes,
      xScale,
      yScale,
      valueFormatters: {[x]: x => `${Math.round(x)}%`},
      layers: [{type: 'histogram', x, fill: ['cpu'], colors, binCount}],
    }

    return (
      <PlotContainer>
        <Plot config={config} />
      </PlotContainer>
    )
  })
