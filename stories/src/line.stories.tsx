import * as React from 'react'
import {storiesOf} from '@storybook/react'
import {boolean, number, select, text, withKnobs} from '@storybook/addon-knobs'

import {Config, Plot, fromFlux, timeFormatter} from '../../giraffe/src'
import {
  binaryPrefixFormatter,
  siPrefixFormatter,
} from '../../giraffe/src/utils/formatters'
import {stackedLineTable} from './data/stackedLineLayer'
import {getRandomTable} from '../../giraffe/src/utils/fixtures/randomTable'

import {
  PlotContainer,
  colorMappingKnob,
  colorSchemeKnob,
  fillKnob,
  findStringColumns,
  getCPUTable,
  interpolationKnob,
  legendFontKnob,
  showAxesKnob,
  tickFontKnob,
  timeZoneKnob,
  tooltipColorizeRowsKnob,
  tooltipHideKnob,
  tooltipOrientationThresholdKnob,
  xKnob,
  xScaleKnob,
  yKnob,
  yScaleKnob,
} from './helpers'

import {fluxCSVAirData, tooltipFalsyValues} from './data/fluxCSV'
import {
  formattableNumbersBillions,
  formattableNumbersMillions,
  formattableNumbersThousands,
  formattableNumbersTrillions,
} from './data/formatterCSV'

const maxValue = Math.random() * Math.floor(200)

storiesOf('Line', module)
  .addDecorator(withKnobs)
  .add('Line', () => {
    const table = getCPUTable()
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
    const fill = fillKnob(table, ['cpu'])
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
    const legendHide = tooltipHideKnob()

    const config: Config = {
      table,
      valueFormatters: {
        _time: timeFormatter({timeZone, format: timeFormat}),
        _value: val => `${Math.round(val)}%`,
      },
      legendFont,
      legendOpacity,
      legendOrientationThreshold,
      legendColorizeRows,
      legendHide,
      tickFont,
      showAxes,
      xScale,
      yScale,
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
      <PlotContainer>
        <Plot config={config} />
      </PlotContainer>
    )
  })
  .add('Stacked Line Layer', () => {
    const table = stackedLineTable
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
    const fill = fillKnob(table, ['cpu'])
    const position = select(
      'Line Position',
      {stacked: 'stacked', overlaid: 'overlaid'},
      'stacked'
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
      legendFont,
      tickFont,
      showAxes,
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
  .add('y domain controlled mode', () => {
    const lines = number('Number of graph lines', 4)
    const fillColumnsCount = number('Number of fill columns', 5)
    const fillColumnNameLength = number('Length of fill column names', 4)

    const fixedWidthText = text('Fixed Width', '')
    const fixedHeightText = text('Fixed Height', '')
    const fixedWidth = !fixedWidthText ? -1 : Number(fixedWidthText)
    const fixedHeight = !fixedHeightText ? -1 : Number(fixedHeightText)

    const fixedPlotSize = {}
    if (fixedHeight > 0 && fixedWidth > 0) {
      fixedPlotSize['height'] = fixedHeight
      fixedPlotSize['width'] = fixedWidth
    }

    const yDomainMin = number('yDomain min', -1)
    const yDomainMax = number('yDomain max', -1)
    const isValidYDomain = yDomainMin > 0 && yDomainMax > 0
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
    const yTickStartText = text('yTickStart', '')
    const yTickStepText = text('yTickStep', '')
    const yTickStart = !yTickStartText ? null : Number(yTickStartText)
    const yTickStep = !yTickStepText ? null : Number(yTickStepText)
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
  .add(
    'Static CSV with Color Mapping',
    () => {
      const staticData = select('Static CSV', {fluxCSVAirData}, fluxCSVAirData)
      let table = fromFlux(staticData).table
      const colors = colorSchemeKnob()
      const colorMap = colorMappingKnob()
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
        staticLegend: {},
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
            colorMapping: JSON.parse(colorMap),
          },
        ],
      }

      return (
        <PlotContainer>
          <Plot config={config} />
        </PlotContainer>
      )
    },
    {
      knobs: {
        escapeHTML: false,
      },
    }
  )
  .add('InfluxData Cloud UI number formatter', () => {
    const formattableNumbersCSV = select(
      'Formattable Numbers',
      {
        thousands: formattableNumbersThousands,
        millions: formattableNumbersMillions,
        billions: formattableNumbersBillions,
        trillions: formattableNumbersTrillions,
      },
      formattableNumbersThousands
    )
    const table = fromFlux(formattableNumbersCSV).table
    const format = boolean('Format Large Numbers?', true)
    const base = select('Base', {2: '2', 10: '10', none: ''}, '')
    const significantDigits = number('Signifcant Digits', 6)
    const trimZeros = boolean('Trim Zeros', true)
    const prefix = text('Prefix', '')
    const suffix = text('Suffix', '')
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
      fluxResponse: formattableNumbersCSV,
      valueFormatters: {
        _time: timeFormatter({timeZone, format: timeFormat}),
        _value:
          base === '2'
            ? binaryPrefixFormatter({
                prefix,
                suffix,
                significantDigits: significantDigits ?? 0,
                trimZeros,
                format,
              })
            : siPrefixFormatter({
                prefix,
                suffix,
                significantDigits: significantDigits ?? 0,
                trimZeros,
                format,
              }),
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
