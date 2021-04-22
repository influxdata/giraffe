import * as React from 'react'
import {storiesOf} from '@storybook/react'
import {withKnobs, number, select, boolean, text} from '@storybook/addon-knobs'

import {Config, Plot, timeFormatter} from '../../giraffe/src'
import {getRandomTable} from './data/randomTable'

import {
  PlotContainer,
  xKnob,
  yKnob,
  xScaleKnob,
  yScaleKnob,
  fillKnob,
  findStringColumns,
  colorSchemeKnob,
  legendFontKnob,
  tickFontKnob,
  showAxesKnob,
  interpolationKnob,
  timeZoneKnob,
  tooltipOrientationThresholdKnob,
  tooltipColorizeRowsKnob,
} from './helpers'

const maxValue = Math.random() * Math.floor(200)

storiesOf('Static Legend', module)
  .addDecorator(withKnobs)
  .add('Legend with random fill column names', () => {
    const lines = number('Number of graph lines', 4)
    const fillColumnsCount = number('Number of fill columns', 5)
    const fillColumnNameLength = number('Length of fill column names', 4)
    const staticLegendHeightRatio = number('Static Legend Height', 0.2, {
      range: true,
      min: 0,
      max: 1,
      step: 0.01,
    })
    const fixedWidthText = text('Fixed Width', '')
    const fixedHeightText = text('Fixed Height', '')
    const fixedWidth = !fixedWidthText ? null : Number(fixedWidthText)
    const fixedHeight = !fixedHeightText ? null : Number(fixedHeightText)
    const legendHide = boolean('Hide Tooltip?', false)
    const staticLegendHide = boolean('Hide Static Legend?', false)
    const fixedPlotSize = {}
    if (typeof fixedHeight === 'number' && typeof fixedWidth === 'number') {
      fixedPlotSize['height'] = fixedHeight
      fixedPlotSize['width'] = fixedWidth
    }
    const table = getRandomTable(
      maxValue,
      lines * 20,
      20,
      fillColumnsCount,
      fillColumnNameLength
    )
    const colors = colorSchemeKnob()
    const legendOrientationThreshold = tooltipOrientationThresholdKnob(20)
    const staticLegendOrientationThreshold = number(
      'Static Legend Orientation Threshold',
      20
    )
    const legendColorizeRows = tooltipColorizeRowsKnob()
    const staticLegendColorizeRows = boolean(
      'Static Legend Colorize Rows?',
      true
    )
    const legendFont = legendFontKnob()
    const staticLegendFont = text('Static Legend Font', '12px sans-serif')
    const staticLegendBorder = text('Static Legend Border', '1px solid orange')
    const staticLegendBackgroundColor = text(
      'Static Legend Background Color',
      'transparent'
    )
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
    const position = select(
      'Line Position',
      {stacked: 'stacked', overlaid: 'overlaid'},
      'overlaid'
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
      xScale,
      yScale,
      tickFont,
      showAxes,
      legendColorizeRows,
      legendFont,
      legendHide,
      legendOpacity,
      legendOrientationThreshold,
      staticLegend: {
        backgroundColor: staticLegendBackgroundColor,
        border: staticLegendBorder,
        colorizeRows: staticLegendColorizeRows,
        font: staticLegendFont || legendFont,
        heightRatio: staticLegendHeightRatio,
        hide: staticLegendHide,
        orientationThreshold: staticLegendOrientationThreshold,
      },
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
  .add('Legend with random custom fill column names', () => {
    const lines = number('Number of graph lines', 4)
    const fillColumnsText = text('fillColumns', 'cluster,host,machine,cpu')
    const fillColumnNames = fillColumnsText.split(',')
    const staticLegendHeightRatio = number('Static Legend Height', 0.2, {
      range: true,
      min: 0,
      max: 1,
      step: 0.01,
    })
    const fixedWidthText = text('Fixed Width', '')
    const fixedHeightText = text('Fixed Height', '')
    const fixedWidth = !fixedWidthText ? null : Number(fixedWidthText)
    const fixedHeight = !fixedHeightText ? null : Number(fixedHeightText)
    const legendHide = boolean('Hide Tooltip?', false)
    const staticLegendHide = boolean('Hide Static Legend?', false)
    const fixedPlotSize = {}
    if (typeof fixedHeight === 'number' && typeof fixedWidth === 'number') {
      fixedPlotSize['height'] = fixedHeight
      fixedPlotSize['width'] = fixedWidth
    }
    const table = getRandomTable(maxValue, 20 * lines, 20, fillColumnNames)
    const colors = colorSchemeKnob()
    const legendOrientationThreshold = tooltipOrientationThresholdKnob(20)
    const staticLegendOrientationThreshold = number(
      'Static Legend Orientation Threshold',
      20
    )
    const legendColorizeRows = tooltipColorizeRowsKnob()
    const staticLegendColorizeRows = boolean(
      'Static Legend Colorize Rows?',
      true
    )
    const legendFont = legendFontKnob()
    const staticLegendFont = text('Static Legend Font', '12px sans-serif')
    const staticLegendBorder = text('Static Legend Border', '1px solid orange')
    const staticLegendBackgroundColor = text(
      'Static Legend Background Color',
      'transparent'
    )
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
    const position = select(
      'Line Position',
      {stacked: 'stacked', overlaid: 'overlaid'},
      'overlaid'
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
      xScale,
      yScale,
      tickFont,
      showAxes,
      legendColorizeRows,
      legendFont,
      legendHide,
      legendOpacity,
      legendOrientationThreshold,
      staticLegend: {
        backgroundColor: staticLegendBackgroundColor,
        border: staticLegendBorder,
        colorizeRows: staticLegendColorizeRows,
        font: staticLegendFont || legendFont,
        heightRatio: staticLegendHeightRatio,
        hide: staticLegendHide,
        orientationThreshold: staticLegendOrientationThreshold,
      },
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
