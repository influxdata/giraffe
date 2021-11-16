import * as React from 'react'
import {storiesOf} from '@storybook/react'
import {withKnobs, number, select, boolean, text} from '@storybook/addon-knobs'

import {Config, Plot, fromFlux, timeFormatter} from '../../giraffe/src'
import {getRandomTable} from '../../giraffe/src/utils/fixtures/randomTable'

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
import {columnAlignment} from './data/staticLegend'

const maxValue = Math.random() * Math.floor(200)
let callCounter = 0

storiesOf('Static Legend', module)
  .addDecorator(withKnobs)
  .add('Line Graph with random fill column names', () => {
    const lines = number('Number of graph lines', 4)
    const fillColumnsCount = number('Number of fill columns', 5)
    const fillColumnNameLength = number('Length of fill column names', 4)
    const staticLegendHeightRatio = number('Static Legend Height', 0.2, {
      range: true,
      min: 0,
      max: 1,
      step: 0.01,
    })

    const fixedWidth = number('Fixed Width', -1)
    const fixedHeight = number('Fixed Height', -1)
    const legendHide = boolean('Hide Tooltip?', false)
    const staticLegendHide = boolean('Hide Static Legend?', false)

    const fixedPlotSize = {}
    if (fixedHeight > 0 && fixedWidth > 0) {
      fixedPlotSize['height'] = fixedHeight
      fixedPlotSize['width'] = fixedWidth
    }
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
  .add('Line Graph with random custom fill column names', () => {
    const lines = number('Number of graph lines', 4)
    const fillColumnsText = text('fillColumns', 'cluster,host,machine,cpu')
    const fillColumnNames = fillColumnsText.split(',')
    const staticLegendHeightRatio = number('Static Legend Height', 0.2, {
      range: true,
      min: 0,
      max: 1,
      step: 0.01,
    })

    const fixedWidth = number('Fixed Width', -1)
    const fixedHeight = number('Fixed Height', -1)
    const legendHide = boolean('Hide Tooltip?', false)
    const staticLegendHide = boolean('Hide Static Legend?', false)
    const fixedPlotSize = {}
    if (fixedHeight > 0 && fixedWidth > 0) {
      fixedPlotSize['height'] = fixedHeight
      fixedPlotSize['width'] = fixedWidth
    }
    const includeNegativeNumbers = boolean('Include negative numbers ?', false)
    const position = select(
      'Line Position',
      {stacked: 'stacked', overlaid: 'overlaid'},
      'overlaid'
    )
    const table = getRandomTable(
      maxValue,
      includeNegativeNumbers,
      20 * lines,
      20,
      fillColumnNames
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
  .add('Band Plot with static CSV', () => {
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
    const staticLegendHeightRatio = number('Static Legend Height', 0.2, {
      range: true,
      min: 0,
      max: 1,
      step: 0.01,
    })

    const fixedWidth = number('Fixed Width', -1)
    const fixedHeight = number('Fixed Height', -1)
    const legendHide = boolean('Hide Tooltip?', false)
    const staticLegendHide = boolean('Hide Static Legend?', false)
    const fixedPlotSize = {}
    if (fixedHeight > 0 && fixedWidth > 0) {
      fixedPlotSize['height'] = fixedHeight
      fixedPlotSize['width'] = fixedWidth
    }
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
      'hh:mm a'
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
  .add('Column Alignment', () => {
    let table = fromFlux(columnAlignment).table
    const staticLegendHeightRatio = number('Static Legend Height', 0.2, {
      range: true,
      min: 0,
      max: 1,
      step: 0.01,
    })

    const fixedWidth = number('Fixed Width', -1)
    const fixedHeight = number('Fixed Height', -1)
    const legendHide = boolean('Hide Tooltip?', false)
    const staticLegendHide = boolean('Hide Static Legend?', false)
    const fixedPlotSize = {}
    if (fixedHeight > 0 && fixedWidth > 0) {
      fixedPlotSize['height'] = fixedHeight
      fixedPlotSize['width'] = fixedWidth
    }
    const position = select(
      'Line Position',
      {stacked: 'stacked', overlaid: 'overlaid'},
      'overlaid'
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

    const config: Config = {
      ...fixedPlotSize,
      fluxResponse: columnAlignment,
      valueFormatters: {
        _time: timeFormatter({timeZone, format: timeFormat}),
      },
      yDomain: [0, 5],
      onResetYDomain: () => {},
      onSetYDomain: () => {},
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
  .add('Custom CSV', () => {
    const csv = text('Past CSV here:', '')
    let table = fromFlux(csv).table
    const staticLegendHeightRatio = number('Static Legend Height', 0.2, {
      range: true,
      min: 0,
      max: 1,
      step: 0.01,
    })

    const fixedWidth = number('Fixed Width', -1)
    const fixedHeight = number('Fixed Height', -1)
    const legendHide = boolean('Hide Tooltip?', false)
    const staticLegendHide = boolean('Hide Static Legend?', false)
    const fixedPlotSize = {}
    if (fixedHeight > 0 && fixedWidth > 0) {
      fixedPlotSize['height'] = fixedHeight
      fixedPlotSize['width'] = fixedWidth
    }
    const position = select(
      'Line Position',
      {stacked: 'stacked', overlaid: 'overlaid'},
      'overlaid'
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

    const config: Config = {
      ...fixedPlotSize,
      fluxResponse: csv,
      valueFormatters: {
        _time: timeFormatter({timeZone, format: timeFormat}),
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
  .add('render effect', () => {
    const lines = number('Number of graph lines', 4)
    const fillColumnsCount = number('Number of fill columns', 7)
    const fillColumnNameLength = number('Length of fill column names', 4)

    const STATIC_LEGEND_HEIGHT_RATIO_NOT_SET = 0
    let staticLegendHeightRatio = STATIC_LEGEND_HEIGHT_RATIO_NOT_SET
    staticLegendHeightRatio = number(
      'Static Legend Height',
      staticLegendHeightRatio,
      {
        range: true,
        min: 0,
        max: 1,
        step: 0.01,
      }
    )

    const fixedWidth = number('Fixed Width', -1)
    const fixedHeight = number('Fixed Height', -1)
    const legendHide = boolean('Hide Tooltip?', false)
    const staticLegendHide = boolean('Hide Static Legend?', false)

    const fixedPlotSize = {}
    if (fixedHeight > 0 && fixedWidth > 0) {
      fixedPlotSize['height'] = fixedHeight
      fixedPlotSize['width'] = fixedWidth
    }
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

    const renderEffect = args => {
      if (staticLegendHeightRatio === STATIC_LEGEND_HEIGHT_RATIO_NOT_SET) {
        callCounter += 1

        // eslint-disable-next-line
        console.log('staticLegend.renderEffect: call counter', callCounter)
        // eslint-disable-next-line
        console.log('staticLegend.renderEffect: arguments', args)
        // eslint-disable-next-line
        console.log(
          'staticLegend.renderEffect: heightRatio',
          staticLegendHeightRatio
        )
      }
    }

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
        renderEffect,
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
