import * as React from 'react'
import {storiesOf} from '@storybook/react'
import {withKnobs, number, select, boolean, text} from '@storybook/addon-knobs'
// import {CPUString} from './data/cpuString'
import {SERIES} from './data/mosaicDataSet'

import {
  Config,
  Plot,
  MAGMA,
  timeFormatter,
  LASER,
  LayerConfig,
} from '../../giraffe/src'
import {stackedLineTable} from './data/stackedLineLayer'
import {singleStatTable} from './data/singleStatLayer'

import {
  PlotContainer,
  xKnob,
  yKnob,
  xScaleKnob,
  yScaleKnob,
  fillKnob,
  symbolKnob,
  tableKnob,
  colorSchemeKnob,
  legendFontKnob,
  tickFontKnob,
  showAxesKnob,
  interpolationKnob,
  timeZoneKnob,
} from './helpers'

storiesOf('XY Plot', module)
  .addDecorator(withKnobs)
  .add('Stacked Line Layer', () => {
    const table = tableKnob(stackedLineTable)
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
    const fill = fillKnob(table, 'cpu')
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
  .add('Line', () => {
    const table = tableKnob()
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
      valueFormatters: {
        _time: timeFormatter({timeZone, format: timeFormat}),
        _value: val => `${Math.round(val)}%`,
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
  .add('Line Layer + Single Stat', () => {
    const includeSingleStatLayer = boolean('Single Stat', true)
    const decimalPlaces = Number(text('Decimal Places', '2'))
    const textOpacity = number('Single Stat Opacity', 1, {
      range: true,
      min: 0,
      max: 1,
      step: 0.01,
    })
    const viewBoxWidth = number('SVG viewBox width', 55, {
      range: true,
      min: 0,
      max: 1000,
      step: 1,
    })
    const viewBoxX = number('SVG viewBox x', 0, {
      range: true,
      min: -500,
      max: 500,
      step: 1,
    })
    const viewBoxY = number('SVG viewBox y', 0, {
      range: true,
      min: -500,
      max: 500,
      step: 1,
    })
    const prefix = text('Prefix', '')
    const suffix = text('Suffix', '')
    const table = singleStatTable
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
    const fill = fillKnob(table, 'cpu')
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

    const layers = [
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
    ] as LayerConfig[]

    if (includeSingleStatLayer) {
      layers.push({
        type: 'single stat',
        prefix,
        suffix,
        decimalPlaces: {
          isEnforced: true,
          digits: decimalPlaces,
        },
        textColor: LASER,
        textOpacity,
        svgAttributes: {
          viewBox: stat =>
            `${viewBoxX} ${viewBoxY} ${stat.length * viewBoxWidth} 100`,
        },
      })
    }

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
      layers,
    }

    return (
      <PlotContainer>
        <Plot config={config} />
      </PlotContainer>
    )
  })
  .add('Scatter Plot', () => {
    const table = tableKnob()
    const colors = colorSchemeKnob()
    const legendFont = legendFontKnob()
    const tickFont = tickFontKnob()
    const x = xKnob(table)
    const y = yKnob(table)
    const xScale = xScaleKnob()
    const yScale = yScaleKnob()
    const fill = fillKnob(table, 'cpu')
    const symbol = symbolKnob(table, 'host')

    const showAxes = showAxesKnob()

    const config: Config = {
      table,
      valueFormatters: {_value: val => `${Math.round(val)}%`},
      legendFont,
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
  .add('Heatmap', () => {
    const table = tableKnob()
    const colors = colorSchemeKnob(MAGMA)
    const legendFont = legendFontKnob()
    const tickFont = tickFontKnob()
    const x = xKnob(table)
    const y = yKnob(table)
    const xScale = xScaleKnob()
    const yScale = yScaleKnob()
    const showAxes = showAxesKnob()

    const config: Config = {
      table,
      legendFont,
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
    const table = tableKnob()
    const colors = colorSchemeKnob()
    const legendFont = legendFontKnob()
    const tickFont = tickFontKnob()
    const x = xKnob(table, '_value')
    const xScale = xScaleKnob()
    const yScale = yScaleKnob()
    const showAxes = showAxesKnob()
    const binCount = number('Bin Count', 10)

    const config: Config = {
      table,
      legendFont,
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
  .add('Mosaic', () => {
    const table = tableKnob()
    const colors = colorSchemeKnob()
    const x = xKnob(table)
    const y = yKnob(table, 'cpu')
    const fill = ['_value']
    const showAxes = showAxesKnob()
    const hoverDimension = select('Hover Dimension', {x: 'x', xy: 'xy'}, 'xy')

    const config: Config = {
      table: SERIES,
      showAxes,
      layers: [
        {
          type: 'mosaic',
          x,
          y,
          fill: fill,
          hoverDimension,
          colors,
        } as LayerConfig,
      ],
    }

    return (
      <PlotContainer>
        <Plot config={config} />
      </PlotContainer>
    )
  })
