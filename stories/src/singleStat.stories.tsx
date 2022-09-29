import React from 'react'
import {storiesOf} from '@storybook/react'
import {boolean, number, select, text, withKnobs} from '@storybook/addon-knobs'
import {
  Config,
  LASER,
  LayerConfig,
  Plot,
  SINGLE_STAT_SVG_NO_USER_SELECT,
  timeFormatter,
} from '../../giraffe/src'

import {
  PlotContainer,
  xKnob,
  yKnob,
  xScaleKnob,
  yScaleKnob,
  fillKnob,
  colorSchemeKnob,
  legendFontKnob,
  tickFontKnob,
  showAxesKnob,
  interpolationKnob,
  timeZoneKnob,
  tooltipOrientationThresholdKnob,
  tooltipColorizeRowsKnob,
} from './helpers'

import {singleStatTable} from './data/singleStatLayer'

storiesOf('Single Stat', module)
  .addDecorator(withKnobs)
  .add('Single Stat', () => {
    const decimalPlaces = Number(text('Decimal Places', '4'))
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
    const config: Config = {
      table: singleStatTable,
      showAxes: false,
      layers: [
        {
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
        },
      ],
    }
    return (
      <PlotContainer>
        <Plot config={config} />
      </PlotContainer>
    )
  })
  .add('Single Stat - custom CSV', () => {
    const csv = text('Paste CSV here:', '')
    const decimalPlaces = Number(text('Decimal Places', '4'))
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
    const config: Config = {
      fluxResponse: csv,
      showAxes: false,
      layers: [
        {
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
        },
      ],
    }
    return (
      <PlotContainer>
        <Plot config={config} />
      </PlotContainer>
    )
  })
  .add('Single Stat on top of Line Layer', () => {
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
    const fill = fillKnob(table, ['cpu'])
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
    const legendOrientationThreshold = tooltipOrientationThresholdKnob()
    const legendColorizeRows = tooltipColorizeRowsKnob()

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
        svgStyle: SINGLE_STAT_SVG_NO_USER_SELECT,
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
      legendOrientationThreshold,
      legendColorizeRows,
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
