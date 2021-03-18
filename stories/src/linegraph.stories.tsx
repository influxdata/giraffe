import * as React from 'react'
import {storiesOf} from '@storybook/react'
import {withKnobs, number, select, boolean, text} from '@storybook/addon-knobs'

import {Config, Plot, timeFormatter, fromFlux} from '../../giraffe/src'
import {getRandomTable} from './data/randomTable'

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
  .add('User defined ticks', () => {
    let table = getRandomTable(maxValue)
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
       const actualCsv = '#datatype,string,long,dateTime:RFC3339,dateTime:RFC3339,dateTime:RFC3339,double,string,string,string,string\n' +
           '#group,false,false,true,true,false,false,true,true,true,true\n' +
           '#default,mean,,,,,,,,,\n' +
           ',result,table,_start,_stop,_time,_value,_field,_measurement,cpu,host\n' +
           ',,0,2021-03-09T17:52:17.3873255Z,2021-03-09T19:52:17.3873255Z,2021-03-09T17:52:30Z,5.791184067994435,usage_user,cpu,cpu-total,jills-mbp.lan\n' +
           ',,0,2021-03-09T17:52:17.3873255Z,2021-03-09T19:52:17.3873255Z,2021-03-09T17:52:45Z,5.516193249379137,usage_user,cpu,cpu-total,jills-mbp.lan\n' +
           ',,0,2021-03-09T17:52:17.3873255Z,2021-03-09T19:52:17.3873255Z,2021-03-09T17:53:00Z,5.719526429881602,usage_user,cpu,cpu-total,jills-mbp.lan\n' +
           ',,0,2021-03-09T17:52:17.3873255Z,2021-03-09T19:52:17.3873255Z,2021-03-09T17:53:15Z,5.707094266278153,usage_user,cpu,cpu-total,jills-mbp.lan\n' +
           ',,0,2021-03-09T17:52:17.3873255Z,2021-03-09T19:52:17.3873255Z,2021-03-09T17:53:30Z,5.753356124405617,usage_user,cpu,cpu-total,jills-mbp.lan\n' +
           ',,0,2021-03-09T17:52:17.3873255Z,2021-03-09T19:52:17.3873255Z,2021-03-09T17:53:45Z,7.2708333333332575,usage_user,cpu,cpu-total,jills-mbp.lan\n' +
           ',,0,2021-03-09T17:52:17.3873255Z,2021-03-09T19:52:17.3873255Z,2021-03-09T17:54:00Z,6.407799350054487,usage_user,cpu,cpu-total,jills-mbp.lan\n' +
           ',,0,2021-03-09T17:52:17.3873255Z,2021-03-09T19:52:17.3873255Z,2021-03-09T17:54:15Z,5.941666666666757,usage_user,cpu,cpu-total,jills-mbp.lan\n' +
           ',,0,2021-03-09T17:52:17.3873255Z,2021-03-09T19:52:17.3873255Z,2021-03-09T17:54:30Z,5.4851617205731715,usage_user,cpu,cpu-total,jills-mbp.lan\n' +
           ',,0,2021-03-09T17:52:17.3873255Z,2021-03-09T19:52:17.3873255Z,2021-03-09T17:54:45Z,5.583350348959434,usage_user,cpu,cpu-total,jills-mbp.lan\n' +
           ',,0,2021-03-09T17:52:17.3873255Z,2021-03-09T19:52:17.3873255Z,2021-03-09T17:55:00Z,6.25,usage_user,cpu,cpu-total,jills-mbp.lan\n' +
           ',,0,2021-03-09T17:52:17.3873255Z,2021-03-09T19:52:17.3873255Z,2021-03-09T17:55:15Z,5.283442590359115,usage_user,cpu,cpu-total,jills-mbp.lan\n' +
           ',,0,2021-03-09T17:52:17.3873255Z,2021-03-09T19:52:17.3873255Z,2021-03-09T17:55:30Z,5.164945018327348,usage_user,cpu,cpu-total,jills-mbp.lan\n' +
           ',,0,2021-03-09T17:52:17.3873255Z,2021-03-09T19:52:17.3873255Z,2021-03-09T17:55:45Z,5.258982453946938,usage_user,cpu,cpu-total,jills-mbp.lan\n' +
           ',,0,2021-03-09T17:52:17.3873255Z,2021-03-09T19:52:17.3873255Z,2021-03-09T17:56:00Z,15.554444722152628,usage_user,cpu,cpu-total,jills-mbp.lan\n'



    const csv = text('paste csv here', '')
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
      const fill = fillKnob(table)
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
          fill: fill,
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
