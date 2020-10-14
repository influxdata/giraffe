import * as React from 'react'
import {storiesOf} from '@storybook/react'
import {withKnobs, number, select, text} from '@storybook/addon-knobs'

import {Config, Plot, timeFormatter, fromFlux} from '../../giraffe/src'
import {findStringColumns, zoomBrushKnobs} from './helpers'
import {
  colors6,
  cpu1,
  cpu2,
  graphEdge1,
  hoverAlignment1,
  hoverAlignment2,
  mem1,
  mem2,
  noLowerAndUpper,
  same3,
} from './data/bandCSV'

import {
  PlotContainer,
  xScaleKnob,
  yScaleKnob,
  colorSchemeKnob,
  legendFontKnob,
  tickFontKnob,
  showAxesKnob,
  interpolationKnob,
  timeZoneKnob,
  tooltipOrientationThresholdKnob,
} from './helpers'

storiesOf('Band Chart', module)
  .addDecorator(withKnobs)
  .add('Static CSV', () => {
    const staticData = select(
      'Static CSV',
      {
        colors6,
        cpu1,
        cpu2,
        graphEdge1,
        hoverAlignment1,
        hoverAlignment2,
        mem1,
        mem2,
        noLowerAndUpper,
        same3,
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
    const interpolation = interpolationKnob()
    const showAxes = showAxesKnob()
    const lineWidth = number('Line Width', 3)
    const lineOpacity = number('Line Opacity', 0.7)
    const shadeOpacity = number('Shade Opacity', 0.3)
    const hoverDimension = select(
      'Hover Dimension',
      {auto: 'auto', x: 'x', y: 'y', xy: 'xy'},
      'auto'
    )
    const upperColumnName = text('upperColumnName', 'max')
    const mainColumnName = text('mainColumnName', 'mean')
    const lowerColumnName = text('lowerColumnName', 'min')
    const legendOpacity = number('Legend Opacity', 1.0, {
      range: true,
      min: 0,
      max: 1.0,
      step: 0.05,
    })
    const legendOrientationThreshold = tooltipOrientationThresholdKnob()
    const {zoomBrushColor, zoomBrushOpacity} = zoomBrushKnobs()

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
      legendOpacity,
      legendOrientationThreshold,
      layers: [
        {
          type: 'band',
          x: '_time',
          y: '_value',
          fill: findStringColumns(fromFluxTable),
          interpolation,
          colors,
          lineWidth,
          lineOpacity,
          hoverDimension,
          shadeOpacity,
          upperColumnName,
          mainColumnName,
          lowerColumnName,
        },
      ],
      zoomBrushColor,
      zoomBrushOpacity,
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
    const interpolation = interpolationKnob()
    const showAxes = showAxesKnob()
    const lineWidth = number('Line Width', 3)
    const lineOpacity = number('Line Opacity', 0.7)
    const shadeOpacity = number('Shade Opacity', 0.3)
    const hoverDimension = select(
      'Hover Dimension',
      {auto: 'auto', x: 'x', y: 'y', xy: 'xy', none: ''},
      'auto'
    )
    const upperColumnName = text('upperColumnName', '')
    const mainColumnName = text('mainColumnName', '')
    const lowerColumnName = text('lowerColumnName', '')
    const legendOpacity = number('Legend Opacity', 1.0, {
      range: true,
      min: 0,
      max: 1.0,
      step: 0.05,
    })
    const legendOrientationThreshold = tooltipOrientationThresholdKnob()

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
      legendOpacity,
      legendOrientationThreshold,
      layers: [
        {
          type: 'band',
          x: '_time',
          y: '_value',
          fill: findStringColumns(fromFluxTable),
          interpolation,
          colors,
          lineWidth,
          lineOpacity,
          hoverDimension,
          shadeOpacity,
          upperColumnName,
          mainColumnName,
          lowerColumnName,
        },
      ],
    }

    return (
      <PlotContainer>
        <Plot config={config} />
      </PlotContainer>
    )
  })
