import * as React from 'react'
import {storiesOf} from '@storybook/react'
import {withKnobs, number, select, boolean, text} from '@storybook/addon-knobs'

import {Config, Plot, timeFormatter, fromFlux} from '../../giraffe/src'
import {getRandomTable} from '../../giraffe/src/utils/fixtures/randomTable'

import {
  PlotContainer,
  colorSchemeKnob,
  fillKnob,
  findStringColumns,
  interpolationKnob,
  legendFontKnob,
  showAxesKnob,
  tickFontKnob,
  timeZoneKnob,
  tooltipColorizeRowsKnob,
  tooltipOrientationThresholdKnob,
  xKnob,
  xScaleKnob,
  yKnob,
  yScaleKnob,
} from './helpers'

import {tooltipFalsyValues} from './data/fluxCSV'

const maxValue = Math.random() * Math.floor(200)

storiesOf('Line Graph', module)
  .addDecorator(withKnobs)
  .add('y domain controlled mode', () => {
    const lines = number('Number of graph lines', 4)
    const fillColumnsCount = number('Number of fill columns', 5)
    const fillColumnNameLength = number('Length of fill column names', 4)

    const fixedWidth = number('Fixed Width')
    const fixedHeight = number('Fixed Height')

    const fixedPlotSize = {}
    if (typeof fixedHeight === 'number' && typeof fixedWidth === 'number') {
      fixedPlotSize['height'] = fixedHeight
      fixedPlotSize['width'] = fixedWidth
    }

    const yDomainMin = number('yDomain min')
    const yDomainMax = number('yDomain max')
    const isValidYDomain =
      typeof yDomainMin === 'number' && typeof yDomainMax === 'number'
    const includeYDomainZoom = boolean('includeYDomainZoom', false)
    const includeOnSetYDomain = boolean(
      'include onSetYDomain empty function ?',
      false
    )
    const includeOnResetYDomain = boolean(
      'include onResetYDomain empty function ?',
      false
    )

    const includeNegativeNumbers = boolean('Include negative numbers ?', false)
    const position = select(
      'Line Position',
      {stacked: 'stacked', overlaid: 'overlaid'},
      'overlaid'
    )
    const table = getRandomTable(
      maxValue,
      includeNegativeNumbers,
      lines * 20,
      20,
      fillColumnsCount,
      fillColumnNameLength
    )
    const colors = colorSchemeKnob()
    const legendFont = legendFontKnob()
    const tickFont = tickFontKnob()
    const x = xKnob(table)
    const y = yKnob(table)
    const valueAxisLabel = text('Value Axis Label', 'foo')
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
    const fill = fillKnob(table, findStringColumns(table))
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
    const legendOpacity = number('Legend Opacity', 1.0, {
      range: true,
      min: 0,
      max: 1.0,
      step: 0.05,
    })
    const legendOrientationThreshold = tooltipOrientationThresholdKnob()
    const legendColorizeRows = tooltipColorizeRowsKnob()
    const config: Config = {
      ...fixedPlotSize,
      table,
      valueFormatters: {
        _time: timeFormatter({timeZone, format: timeFormat}),
        _value: val =>
          `${val.toFixed(2)}${
            valueAxisLabel ? ` ${valueAxisLabel}` : valueAxisLabel
          }`,
      },
      yDomain: isValidYDomain ? [yDomainMin, yDomainMax] : null,
      includeYDomainZoom,
      onSetYDomain: includeOnSetYDomain ? () => {} : null,
      onResetYDomain: includeOnResetYDomain ? () => {} : null,
      xScale,
      yScale,
      tickFont,
      legendFont,
      legendOpacity,
      legendOrientationThreshold,
      legendColorizeRows,
      showAxes,
      layers: [
        {
          type: 'line',
          x,
          y,
          fill,
          position,
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
  .add('User defined ticks', () => {
    let table = getRandomTable(maxValue, false)
    const xTickStart = number('xTickStart', new Date().getTime())
    const xTickStep = number('xTickStep', 200_000)
    const xTotalTicks = number('xTotalTicks', 5)
    const yTickStart = number('yTickStart')
    const yTickStep = number('yTickStep')
    const yTotalTicks = number('yTotalTicks', 8)
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
      'HH:mm:ss'
    )
    const legendFont = legendFontKnob()
    const tickFont = tickFontKnob()
    const valueAxisLabel = text('Value Axis Label', 'foo')
    const colors = colorSchemeKnob()
    const x = xKnob(table)
    const y = yKnob(table)
    const xScale = xScaleKnob()
    const yScale = yScaleKnob()

    const timeZone = timeZoneKnob()
    const fill = fillKnob(table, ['cpu'])
    const position = select(
      'Line Position',
      {stacked: 'stacked', overlaid: 'overlaid'},
      'overlaid'
    )
    const interpolation = interpolationKnob()
    const lineWidth = number('Line Width', 1)
    const shadeBelow = boolean('Shade Area', false)
    const shadeBelowOpacity = number('Area Opacity', 0.1)
    const hoverDimension = select(
      'Hover Dimension',
      {auto: 'auto', x: 'x', y: 'y', xy: 'xy'},
      'auto'
    )
    const legendOpacity = number('Legend Opacity', 1.0, {
      range: true,
      min: 0,
      max: 1.0,
      step: 0.05,
    })
    const legendOrientationThreshold = tooltipOrientationThresholdKnob()
    const legendColorizeRows = tooltipColorizeRowsKnob()

    const config: Config = {
      table,
      valueFormatters: {
        _time: timeFormatter({timeZone, format: timeFormat}),
        _value: val =>
          `${val.toFixed(2)}${
            valueAxisLabel ? ` ${valueAxisLabel}` : valueAxisLabel
          }`,
      },
      xScale,
      yScale,
      xTickStart,
      xTickStep,
      xTotalTicks,
      yTickStart,
      yTickStep,
      yTotalTicks,
      legendFont,
      tickFont,
      legendOpacity,
      legendOrientationThreshold,
      legendColorizeRows,
      layers: [
        {
          type: 'line',
          x,
          y,
          fill,
          position,
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
  .add('Static CSV', () => {
    const staticData = select(
      'Static CSV',
      {tooltipFalsyValues},
      tooltipFalsyValues
    )
    let table = fromFlux(staticData).table
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
    const legendOrientationThreshold = tooltipOrientationThresholdKnob()

    const legendColorizeRows = tooltipColorizeRowsKnob()

    const config: Config = {
      fluxResponse: staticData,
      valueFormatters: {
        _time: timeFormatter({timeZone, format: timeFormat}),
        _value: val => `${Math.round(val)}`,
      },
      legendFont,
      tickFont,
      showAxes,
      xScale,
      yScale,
      legendOrientationThreshold,
      legendColorizeRows,
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
    const legendOrientationThreshold = tooltipOrientationThresholdKnob()

    const legendColorizeRows = tooltipColorizeRowsKnob()

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
      legendOrientationThreshold,
      legendColorizeRows,
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
