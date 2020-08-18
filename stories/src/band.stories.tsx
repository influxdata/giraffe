import * as React from 'react'
import {storiesOf} from '@storybook/react'
import {withKnobs, number, select, text} from '@storybook/addon-knobs'

import {Config, Plot, timeFormatter, fromFlux} from '../../giraffe/src'
import {findStringColumns} from './helpers'
import {cpu1, cpu2, mem1, mem2} from './data/bandCSV'

import {
  PlotContainer,
  xScaleKnob,
  yScaleKnob,
  fillKnob,
  colorSchemeKnob,
  legendFontKnob,
  tickFontKnob,
  showAxesKnob,
  interpolationKnob,
  timeZoneKnob,
} from './helpers'

storiesOf('Band Chart', module)
  .addDecorator(withKnobs)
  .add('Static CSV', () => {
    const staticData = select(
      'Static CSV',
      {
        cpu1,
        cpu2,
        mem1,
        mem2,
      },
      cpu2
    )
    const colors = colorSchemeKnob()
    const legendFont = legendFontKnob()
    const tickFont = tickFontKnob()
    const valueAxisLabel = text('Value Axis Label', '')
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
        'hh:mm a': 'hh:mm a',
        'HH:mm': 'HH:mm',
        'HH:mm:ss': 'HH:mm:ss',
        'HH:mm:ss ZZ': 'HH:mm:ss ZZ',
        'HH:mm:ss.sss': 'HH:mm:ss.sss',
        'MMMM D, YYYY HH:mm:ss': 'MMMM D, YYYY HH:mm:ss',
        'dddd, MMMM D, YYYY HH:mm:ss': 'dddd, MMMM D, YYYY HH:mm:ss',
      },
      'YYYY-MM-DD HH:mm:ss ZZ'
    )
    const fromFluxTable = fromFlux(staticData).table
    const fill = fillKnob(fromFluxTable, findStringColumns(fromFluxTable))

    const interpolation = interpolationKnob()
    const showAxes = showAxesKnob()
    const lineWidth = number('Line Width', 1)
    const lineOpacity = number('Line Opacity', 1)
    const shadeOpacity = number('Area Opacity', 0.1)
    const hoverDimension = select(
      'Hover Dimension',
      {auto: 'auto', x: 'x', y: 'y', xy: 'xy'},
      'auto'
    )

    const config: Config = {
      fluxResponse: staticData,
      valueFormatters: {
        _time: timeFormatter({timeZone, format: timeFormat}),
        _value: val =>
          typeof val === 'number'
            ? `${val.toFixed(2)}${
                valueAxisLabel ? ` ${valueAxisLabel}` : valueAxisLabel
              }`
            : val,
      },
      xScale,
      yScale,
      legendFont,
      tickFont,
      showAxes,
      layers: [
        {
          type: 'band',
          x: '_time',
          y: '_value',
          fill,
          interpolation,
          colors,
          lineWidth,
          lineOpacity,
          hoverDimension,
          shadeOpacity,
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
    const customCSV = text('Paste CSV here:', '')
    const colors = colorSchemeKnob()
    const legendFont = legendFontKnob()
    const tickFont = tickFontKnob()
    const valueAxisLabel = text('Value Axis Label', '')
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
        'hh:mm a': 'hh:mm a',
        'HH:mm': 'HH:mm',
        'HH:mm:ss': 'HH:mm:ss',
        'HH:mm:ss ZZ': 'HH:mm:ss ZZ',
        'HH:mm:ss.sss': 'HH:mm:ss.sss',
        'MMMM D, YYYY HH:mm:ss': 'MMMM D, YYYY HH:mm:ss',
        'dddd, MMMM D, YYYY HH:mm:ss': 'dddd, MMMM D, YYYY HH:mm:ss',
      },
      'YYYY-MM-DD HH:mm:ss ZZ'
    )
    const fromFluxTable = fromFlux(customCSV).table
    const fill = fillKnob(fromFluxTable, findStringColumns(fromFluxTable))

    const interpolation = interpolationKnob()
    const showAxes = showAxesKnob()
    const lineWidth = number('Line Width', 1)
    const lineOpacity = number('Line Opacity', 1)
    const shadeOpacity = number('Area Opacity', 0.1)
    const hoverDimension = select(
      'Hover Dimension',
      {auto: 'auto', x: 'x', y: 'y', xy: 'xy'},
      'auto'
    )

    const config: Config = {
      fluxResponse: customCSV,
      valueFormatters: {
        _time: timeFormatter({timeZone, format: timeFormat}),
        _value: val =>
          typeof val === 'number'
            ? `${val.toFixed(2)}${
                valueAxisLabel ? ` ${valueAxisLabel}` : valueAxisLabel
              }`
            : val,
      },
      xScale,
      yScale,
      legendFont,
      tickFont,
      showAxes,
      layers: [
        {
          type: 'band',
          x: '_time',
          y: '_value',
          fill,
          interpolation,
          colors,
          lineWidth,
          lineOpacity,
          hoverDimension,
          shadeOpacity,
        },
      ],
    }

    return (
      <PlotContainer>
        <Plot config={config} />
      </PlotContainer>
    )
  })
