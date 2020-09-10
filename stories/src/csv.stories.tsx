import * as React from 'react'
import {storiesOf} from '@storybook/react'
import {withKnobs, number, select, boolean, text} from '@storybook/addon-knobs'

import {Config, Plot, timeFormatter, fromFlux} from '../../giraffe/src'

import {
  PlotContainer,
  colorSchemeKnob,
  findStringColumns,
  interpolationKnob,
  legendFontKnob,
  showAxesKnob,
  tickFontKnob,
  timeZoneKnob,
  xKnob,
  xScaleKnob,
  yKnob,
  yScaleKnob,
} from './helpers'

storiesOf('CSV from Flux', module)
  .addDecorator(withKnobs)
  .add('Line Graph from CSV', () => {
    const csv = text('Paste CSV here:', '')
    let table = fromFlux(csv).table
    const colors = colorSchemeKnob()
    const legendFont = legendFontKnob()
    const tickFont = tickFontKnob()
    const x = xKnob(table)
    const y = yKnob(table)
    const xScale = xScaleKnob()
    const yScale = yScaleKnob()
    const timeZone = timeZoneKnob()
    const timeFormat = select(
      'Time Format',
      {
        'DD/MM/YYYY HH:mm:ss.sss': 'DD/MM/YYYY HH:mm:ss.sss',
        'MM/DD/YYYY HH:mm:ss.sss': 'MM/DD/YYYY HH:mm:ss.sss',
        'YYYY/MM/DD HH:mm:ss': 'YYYY/MM/DD HH:mm:ss',
        'YYYY-MM-DD HH:mm:ss ZZ': 'YYYY-MM-DD HH:mm:ss ZZ',
        'YYYY-MM-DD HH:mm:ss a ZZ': 'YYYY-MM-DD HH:mm:ss a ZZ',
        'hh:mm a': 'hh:mm a',
        'hh:mm': 'hh:mm',
        'HH:mm': 'HH:mm',
        'HH:mm:ss': 'HH:mm:ss',
        'HH:mm:ss ZZ': 'HH:mm:ss ZZ',
        'HH:mm:ss.sss': 'HH:mm:ss.sss',
        'MMMM D, YYYY HH:mm:ss': 'MMMM D, YYYY HH:mm:ss',
        'dddd, MMMM D, YYYY HH:mm:ss': 'dddd, MMMM D, YYYY HH:mm:ss',
      },
      'YYYY-MM-DD HH:mm:ss ZZ'
    )
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
      fluxResponse: csv,
      valueFormatters: {
        _time: timeFormatter({timeZone, format: timeFormat}),
        _value: val => `${Math.round(val)}`,
      },
      legendFont,
      tickFont,
      showAxes,
      xScale,
      yScale,
      layers: [
        {
          type: 'line',
          x,
          y,
          fill: findStringColumns(table),
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
      <PlotContainer>
        <Plot config={config} />
      </PlotContainer>
    )
  })
