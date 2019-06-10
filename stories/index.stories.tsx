import * as React from 'react'
import marked from 'marked'
import {storiesOf} from '@storybook/react'
import {withKnobs, number, select, boolean} from '@storybook/addon-knobs'

import {Config, Plot, MAGMA} from '../src'

import {
  PlotContainer,
  xKnob,
  yKnob,
  fillKnob,
  symbolKnob,
  tableKnob,
  colorSchemeKnob,
  legendFontKnob,
  tickFontKnob,
  showAxesKnob,
  interpolationKnob,
} from './helpers'

// Notes
const histogramReadme = marked(require('../src/components/HistogramLayer.md'))

storiesOf('XY Plot', module)
  .addDecorator(withKnobs)
  .add('Line', () => {
    const table = tableKnob()
    const colors = colorSchemeKnob()
    const legendFont = legendFontKnob()
    const tickFont = tickFontKnob()
    const x = xKnob(table)
    const y = yKnob(table)
    const fill = fillKnob(table, 'cpu')
    const interpolation = interpolationKnob()
    const showAxes = showAxesKnob()
    const lineWidth = number('Line Width', 1)
    const shadeBelow = boolean('Shade Area', false)
    const shadeBelowOpacity = number('Area Opacity', 0.1)
    const hoverDimension = select(
      'Hover Dimension',
      {auto: 'auto', x: 'x', y: 'y', xy: 'xy'},
      'auto'
    )

    const config: Config = {
      table,
      valueFormatters: {[y]: y => `${Math.round(y)}%`},
      legendFont,
      tickFont,
      showAxes,
      layers: [
        {
          type: 'line',
          x,
          y,
          fill,
          interpolation,
          colors,
          lineWidth,
          hoverDimension,
          shadeBelow,
          shadeBelowOpacity,
        },
      ],
    }

    return (
      <div className="story--example">
        <PlotContainer>
          <Plot config={config} />
        </PlotContainer>
      </div>
    )
  })
  .add('Scatterplot', () => {
    const table = tableKnob()
    const colors = colorSchemeKnob()
    const legendFont = legendFontKnob()
    const tickFont = tickFontKnob()
    const x = xKnob(table)
    const y = yKnob(table)
    const fill = fillKnob(table, 'cpu')
    const symbol = symbolKnob(table, 'host')

    const showAxes = showAxesKnob()

    const config: Config = {
      table,
      valueFormatters: {[y]: y => `${Math.round(y)}%`},
      legendFont,
      tickFont,
      showAxes,
      layers: [
        {
          type: 'scatter',
          x,
          y,
          fill: fill,
          symbol: symbol,
          colors,
        },
      ],
    }

    return (
      <div className="story--example">
        <PlotContainer>
          <Plot config={config} />
        </PlotContainer>
      </div>
    )
  })
  .add('Heatmap', () => {
    const table = tableKnob()
    const colors = colorSchemeKnob(MAGMA)
    const legendFont = legendFontKnob()
    const tickFont = tickFontKnob()
    const x = xKnob(table)
    const y = yKnob(table)
    const showAxes = showAxesKnob()

    const config: Config = {
      table,
      legendFont,
      tickFont,
      showAxes,
      valueFormatters: {[y]: y => `${Math.round(y)}%`},
      layers: [{type: 'heatmap', x, y, colors}],
    }

    return (
      <div className="story--example">
        <PlotContainer>
          <Plot config={config} />
        </PlotContainer>
      </div>
    )
  })
  .add(
    'Histogram',
    () => {
      const table = tableKnob()
      const colors = colorSchemeKnob()
      const legendFont = legendFontKnob()
      const tickFont = tickFontKnob()
      const x = xKnob(table, '_value')
      const showAxes = showAxesKnob()
      const binCount = number('Bin Count', 10)

      const config: Config = {
        table,
        legendFont,
        tickFont,
        showAxes,
        valueFormatters: {[x]: x => `${Math.round(x)}%`},
        layers: [{type: 'histogram', x, fill: ['cpu'], colors, binCount}],
      }

      return (
        <div className="story--example">
          <PlotContainer>
            <Plot config={config} />
          </PlotContainer>
        </div>
      )
    },
    {
      readme: {
        content: histogramReadme,
      },
    }
  )
