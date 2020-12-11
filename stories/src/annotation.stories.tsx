import * as React from 'react'
import {storiesOf} from '@storybook/react'
import {boolean, number, select, text, withKnobs} from '@storybook/addon-knobs'
import {Config, Plot, LayerConfig, timeFormatter} from '../../giraffe/src'
import {TIME, VALUE} from '../../giraffe/src/constants/columnKeys'

import {
  PlotContainer,
  xKnob,
  yKnob,
  xScaleKnob,
  yScaleKnob,
  fillKnob,
  colorSchemeKnob,
  legendFontKnob,
  multiSelect,
  tickFontKnob,
  interpolationKnob,
  timeZoneKnob,
  tooltipOrientationThresholdKnob,
  tooltipColorizeRowsKnob,
} from './helpers'

import {annotationsTable, matchAnnotationsToTable} from './data/annotation'

storiesOf('Annotations', module)
  .addDecorator(withKnobs)
  .add('Annotations: mark at every point', () => {
    const table = annotationsTable
    const includeLineLayer = boolean('Line Layer', false)
    const annotationColor = text('Annotation color string', 'green')
    const annotationDimension = select(
      'Annotation Dimension',
      {
        x: 'x',
        y: 'y',
      },
      'x'
    )
    const tickFont = tickFontKnob()
    const valueAxisLabel = text('Value Axis Label', 'foo')
    const x = xKnob(table)
    const y = yKnob(table)
    const fill = fillKnob(table, ['cpu'])
    const xScale = xScaleKnob()
    const yScale = yScaleKnob()
    const timeZone = timeZoneKnob('America/Los_Angeles')
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
        'HH:mm:ss a': 'HH:mm:ss a',
        'HH:mm:ss ZZ': 'HH:mm:ss ZZ',
        'HH:mm:ss.sss': 'HH:mm:ss.sss',
        'MMMM D, YYYY HH:mm:ss': 'MMMM D, YYYY HH:mm:ss',
        'dddd, MMMM D, YYYY HH:mm:ss': 'dddd, MMMM D, YYYY HH:mm:ss',
      },
      'hh:mm a'
    )
    const legendFont = legendFontKnob()
    const legendOrientationThreshold = tooltipOrientationThresholdKnob()
    const legendColorizeRows = tooltipColorizeRowsKnob()

    const xTotalTicks = number('X Total Ticks', 8)
    const yTotalTicks = number('Y Total Ticks', 10)
    const position = select(
      'Line Position',
      {stacked: 'stacked', overlaid: 'overlaid'},
      'overlaid'
    )
    const interpolation = interpolationKnob()
    const colors = colorSchemeKnob()
    const lineWidth = number('Line Width', 1)
    const hoverDimension = select(
      'Hover Dimension',
      {auto: 'auto', x: 'x', y: 'y', xy: 'xy'},
      'auto'
    )

    const layers = [
      {
        type: 'annotation',
        x,
        y,
        annotations: matchAnnotationsToTable({
          color: annotationColor,
          dimension: annotationDimension,
          table,
          x,
          y,
        }),
        fill,
        hoverDimension,
      },
    ] as LayerConfig[]

    if (includeLineLayer) {
      layers.unshift({
        type: 'line',
        x,
        y,
        fill,
        position,
        interpolation,
        colors,
        lineWidth,
        hoverDimension,
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
      xTotalTicks,
      yTotalTicks,
      layers,
    }
    return (
      <PlotContainer>
        <Plot config={config} />
      </PlotContainer>
    )
  })
  .add('Annotations: selectable marks', () => {
    const table = annotationsTable
    const includeLineLayer = boolean('Line Layer', true)
    const annotationColor = text('Annotation color string', 'green')
    const annotationDimension = select(
      'Annotation Dimension',
      {
        x: 'x',
        y: 'y',
      },
      'x'
    )
    const tickFont = tickFontKnob()
    const valueAxisLabel = text('Value Axis Label', 'foo')
    const x = xKnob(table)
    const y = yKnob(table)
    const fill = fillKnob(table, ['cpu'])
    const xScale = xScaleKnob()
    const yScale = yScaleKnob()
    const timeZone = timeZoneKnob('America/Los_Angeles')
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
        'HH:mm:ss a': 'HH:mm:ss a',
        'HH:mm:ss ZZ': 'HH:mm:ss ZZ',
        'HH:mm:ss.sss': 'HH:mm:ss.sss',
        'MMMM D, YYYY HH:mm:ss': 'MMMM D, YYYY HH:mm:ss',
        'dddd, MMMM D, YYYY HH:mm:ss': 'dddd, MMMM D, YYYY HH:mm:ss',
      },
      'hh:mm a'
    )
    const legendFont = legendFontKnob()
    const legendOrientationThreshold = tooltipOrientationThresholdKnob()
    const legendColorizeRows = tooltipColorizeRowsKnob()

    const xTotalTicks = number('X Total Ticks', 8)
    const yTotalTicks = number('Y Total Ticks', 10)
    const position = select(
      'Line Position',
      {stacked: 'stacked', overlaid: 'overlaid'},
      'overlaid'
    )
    const interpolation = interpolationKnob()
    const colors = colorSchemeKnob()
    const lineWidth = number('Line Width', 1)
    const hoverDimension = select(
      'Hover Dimension',
      {auto: 'auto', x: 'x', y: 'y', xy: 'xy'},
      'auto'
    )

    const annotations = matchAnnotationsToTable({
      color: annotationColor,
      dimension: annotationDimension,
      table,
      x,
      y,
    })
    const annotationsSelections = multiSelect(
      'annotations',
      annotations.map(annotation => String(annotation.startValue)).sort(),
      annotations
        .filter((_, i) => (i % 4 === 0 ? true : false))
        .map(annotation => String(annotation.startValue))
        .sort()
    )

    const layers = [
      {
        type: 'annotation',
        x,
        y,
        annotations: annotationsSelections.map((valueString, i) => ({
          title: 'Hi!',
          description: `value: ${valueString}`,
          color: annotationColor,
          dimension: annotationDimension,
          startValue: Number(valueString),
          stopValue: Number(valueString),
        })),
        fill,
        hoverDimension,
      },
    ] as LayerConfig[]

    if (includeLineLayer) {
      layers.unshift({
        type: 'line',
        x,
        y,
        fill,
        position,
        interpolation,
        colors,
        lineWidth,
        hoverDimension,
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
      xTotalTicks,
      yTotalTicks,
      layers,
    }
    return (
      <PlotContainer>
        <Plot config={config} />
      </PlotContainer>
    )
  })
  .add('Annotations: add your own marks', () => {
    const table = annotationsTable
    const includeLineLayer = boolean('Line Layer', true)
    const annotationColor = text('Annotation color string', 'green')
    const annotationDimension = select(
      'Annotation Dimension',
      {
        x: 'x',
        y: 'y',
      },
      'x'
    )
    const x = xKnob(table)
    const y = yKnob(table)
    const currentValue = text(
      '_value',
      x === VALUE
        ? String(table.getColumn(x, 'number')[0])
        : String(table.getColumn(y, 'number')[0])
    )
    const currentTime = text('_time', String(Date.now() + 1000 * 60 * 6))

    const columnKey = annotationDimension === 'y' ? y : x
    const annotationsInput = columnKey === TIME ? currentTime : currentValue

    const tickFont = tickFontKnob()
    const valueAxisLabel = text('Value Axis Label', 'foo')
    const fill = fillKnob(table, ['cpu'])
    const xScale = xScaleKnob()
    const yScale = yScaleKnob()
    const timeZone = timeZoneKnob('America/Los_Angeles')
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
        'HH:mm:ss a': 'HH:mm:ss a',
        'HH:mm:ss ZZ': 'HH:mm:ss ZZ',
        'HH:mm:ss.sss': 'HH:mm:ss.sss',
        'MMMM D, YYYY HH:mm:ss': 'MMMM D, YYYY HH:mm:ss',
        'dddd, MMMM D, YYYY HH:mm:ss': 'dddd, MMMM D, YYYY HH:mm:ss',
      },
      'hh:mm a'
    )
    const legendFont = legendFontKnob()
    const legendOrientationThreshold = tooltipOrientationThresholdKnob()
    const legendColorizeRows = tooltipColorizeRowsKnob()

    const xTotalTicks = number('X Total Ticks', 8)
    const yTotalTicks = number('Y Total Ticks', 10)
    const position = select(
      'Line Position',
      {stacked: 'stacked', overlaid: 'overlaid'},
      'overlaid'
    )
    const interpolation = interpolationKnob()
    const colors = colorSchemeKnob()
    const lineWidth = number('Line Width', 1)
    const hoverDimension = select(
      'Hover Dimension',
      {auto: 'auto', x: 'x', y: 'y', xy: 'xy'},
      'auto'
    )

    const layers = [
      {
        type: 'annotation',
        x,
        y,
        annotations: annotationsInput
          .split(',')
          .map((valueString: string, i: number) => ({
            title: 'Hi',
            description: `value is ${valueString}`,
            color: annotationColor,
            dimension: annotationDimension,
            startValue: Number(valueString),
            stopValue: Number(valueString),
          })),
        fill,
        hoverDimension,
      },
    ] as LayerConfig[]

    if (includeLineLayer) {
      layers.unshift({
        type: 'line',
        x,
        y,
        fill,
        position,
        interpolation,
        colors,
        lineWidth,
        hoverDimension,
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
      xTotalTicks,
      yTotalTicks,
      layers,
    }
    return (
      <PlotContainer>
        <Plot config={config} />
      </PlotContainer>
    )
  })
