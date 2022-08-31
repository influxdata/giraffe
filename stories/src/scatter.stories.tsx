import * as React from 'react'
import {storiesOf} from '@storybook/react'
import {withKnobs, text, select} from '@storybook/addon-knobs'

import {Config, Plot, fromFlux, timeFormatter} from '../../giraffe/src'

import {
  PlotContainer,
  xKnob,
  yKnob,
  xScaleKnob,
  yScaleKnob,
  colorSchemeKnob,
  legendFontKnob,
  tickFontKnob,
  showAxesKnob,
  findStringColumns,
  timeZoneKnob,
  tooltipOrientationThresholdKnob,
  tooltipColorizeRowsKnob,
  getCPUTable,
  fillKnob,
  symbolKnob,
} from './helpers'

storiesOf('Scatter', module)
  .addDecorator(withKnobs)
  .add('Static CSV', () => {
    const table = getCPUTable()
    const colors = colorSchemeKnob()
    const legendFont = legendFontKnob()
    const tickFont = tickFontKnob()
    const x = xKnob(table)
    const y = yKnob(table)
    const xScale = xScaleKnob()
    const yScale = yScaleKnob()
    const fill = fillKnob(table, ['cpu'])
    const symbol = symbolKnob(table, ['host'])
    const legendOrientationThreshold = tooltipOrientationThresholdKnob()
    const legendColorizeRows = tooltipColorizeRowsKnob()
    const showAxes = showAxesKnob()

    const config: Config = {
      table,
      valueFormatters: {_value: val => `${Math.round(val)}%`},
      legendFont,
      legendOrientationThreshold,
      legendColorizeRows,
      tickFont,
      showAxes,
      xScale,
      yScale,
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
      <PlotContainer>
        <Plot config={config} />
      </PlotContainer>
    )
  })
  .add('Custom CSV', () => {
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
    const showAxes = showAxesKnob()
    const legendOrientationThreshold = tooltipOrientationThresholdKnob()
    const legendColorizeRows = tooltipColorizeRowsKnob()

    const config: Config = {
      table,
      valueFormatters: {
        _time: timeFormatter({timeZone, format: timeFormat}),
        _value: val => `${Math.round(val)}`,
      },
      legendFont,
      legendOrientationThreshold,
      legendColorizeRows,
      tickFont,
      showAxes,
      xScale,
      yScale,
      layers: [
        {
          type: 'scatter',
          x,
          y,
          fill: findStringColumns(table),
          colors,
        },
      ],
    }

    return (
      <PlotContainer>
        <Plot config={config} />
      </PlotContainer>
    )
  })
