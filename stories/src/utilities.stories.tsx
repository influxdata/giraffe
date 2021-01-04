import * as React from 'react'
import {storiesOf} from '@storybook/react'
import {withKnobs, number, select, boolean, text} from '@storybook/addon-knobs'

import {
  Config,
  MAGMA,
  Plot,
  exportImage,
  fromFlux,
  timeFormatter,
} from '../../giraffe/src'
import {stackedLineTable} from './data/stackedLineLayer'

import {PlotEnv} from '../../giraffe/src/utils/PlotEnv'

import {
  PlotContainer,
  colorSchemeKnob,
  fillKnob,
  findStringColumns,
  interpolationKnob,
  legendFontKnob,
  showAxesKnob,
  tableKnob,
  tickFontKnob,
  timeZoneKnob,
  tooltipColorizeRowsKnob,
  tooltipDisableKnob,
  tooltipOrientationThresholdKnob,
  xKnob,
  xScaleKnob,
  yKnob,
  yScaleKnob,
} from './helpers'

import {
  colors6,
  cpu1,
  cpu2,
  graphEdge1,
  hoverAlignment1,
  hoverAlignment2,
  hoverAlignment3,
  mem1,
  mem2,
  noLowerAndUpper,
  same3,
} from './data/bandCSV'

storiesOf('Utilities', module)
  .addDecorator(withKnobs)
  .add('Screenshot A Stacked Line Layer', () => {
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

    const axesCanvasRef: React.RefObject<HTMLCanvasElement> = React.createRef()
    const layerCanvasRef: React.RefObject<HTMLCanvasElement> = React.createRef()

    const plotEnv = new PlotEnv()
    plotEnv.config = config as any

    return (
      <PlotContainer>
        <button
          onClick={() => {
            if (layerCanvasRef.current && axesCanvasRef.current) {
              exportImage(layerCanvasRef.current, axesCanvasRef.current, {
                top: plotEnv.margins.top,
              }).then(image => window.open(image, '_blank'))
            }
          }}
        >
          Click to Open a screenshot in new Window/Tab
        </button>
        <Plot
          config={config}
          axesCanvasRef={axesCanvasRef}
          layerCanvasRef={layerCanvasRef}
        />
      </PlotContainer>
    )
  })
  .add('Screenshot A Line', () => {
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
    const legendDisable = tooltipDisableKnob()

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
      legendDisable,
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

    const axesCanvasRef: React.RefObject<HTMLCanvasElement> = React.createRef()
    const layerCanvasRef: React.RefObject<HTMLCanvasElement> = React.createRef()

    const plotEnv = new PlotEnv()
    plotEnv.config = config as any

    return (
      <PlotContainer>
        <button
          onClick={() => {
            if (layerCanvasRef.current && axesCanvasRef.current) {
              exportImage(layerCanvasRef.current, axesCanvasRef.current, {
                top: plotEnv.margins.top,
              }).then(image => window.open(image, '_blank'))
            }
          }}
        >
          Click to Open a screenshot in new Window/Tab
        </button>
        <Plot
          config={config}
          axesCanvasRef={axesCanvasRef}
          layerCanvasRef={layerCanvasRef}
        />
      </PlotContainer>
    )
  })
  .add('Screenshot A Heatmap', () => {
    const table = tableKnob()
    const colors = colorSchemeKnob(MAGMA)
    const legendFont = legendFontKnob()
    const tickFont = tickFontKnob()
    const x = xKnob(table)
    const y = yKnob(table)
    const xScale = xScaleKnob()
    const yScale = yScaleKnob()
    const showAxes = showAxesKnob()
    const legendOrientationThreshold = tooltipOrientationThresholdKnob()
    const legendColorizeRows = tooltipColorizeRowsKnob()

    const config: Config = {
      table,
      legendFont,
      legendOrientationThreshold,
      legendColorizeRows,
      xScale,
      yScale,
      tickFont,
      showAxes,
      width: 500,
      height: 500,
      valueFormatters: {_value: val => `${Math.round(val)}%`},
      layers: [{type: 'heatmap', x, y, colors}],
    }

    const axesCanvasRef: React.RefObject<HTMLCanvasElement> = React.createRef()
    const layerCanvasRef: React.RefObject<HTMLCanvasElement> = React.createRef()

    const plotEnv = new PlotEnv()
    plotEnv.config = config as any

    return (
      <PlotContainer>
        <button
          onClick={() => {
            if (layerCanvasRef.current && axesCanvasRef.current) {
              exportImage(layerCanvasRef.current, axesCanvasRef.current, {
                top: plotEnv.margins.top,
              }).then(image => window.open(image, '_blank'))
            }
          }}
        >
          Click to Open a screenshot in new Window/Tab
        </button>
        <Plot
          config={config}
          axesCanvasRef={axesCanvasRef}
          layerCanvasRef={layerCanvasRef}
        />
      </PlotContainer>
    )
  })
  .add('Screenshot A Histogram', () => {
    const table = tableKnob()
    const colors = colorSchemeKnob()
    const legendFont = legendFontKnob()
    const tickFont = tickFontKnob()
    const x = xKnob(table, '_value')
    const xScale = xScaleKnob()
    const yScale = yScaleKnob()
    const showAxes = showAxesKnob()
    const binCount = number('Bin Count', 10)
    const legendOrientationThreshold = tooltipOrientationThresholdKnob()
    const legendColorizeRows = tooltipColorizeRowsKnob()

    const config: Config = {
      table,
      legendFont,
      legendOrientationThreshold,
      legendColorizeRows,
      tickFont,
      showAxes,
      xScale,
      yScale,
      valueFormatters: {[x]: x => `${Math.round(x)}%`},
      layers: [{type: 'histogram', x, fill: ['cpu'], colors, binCount}],
    }

    const axesCanvasRef: React.RefObject<HTMLCanvasElement> = React.createRef()
    const layerCanvasRef: React.RefObject<HTMLCanvasElement> = React.createRef()

    const plotEnv = new PlotEnv()
    plotEnv.config = config as any

    return (
      <PlotContainer>
        <button
          onClick={() => {
            if (layerCanvasRef.current && axesCanvasRef.current) {
              exportImage(layerCanvasRef.current, axesCanvasRef.current, {
                top: plotEnv.margins.top,
              }).then(image => window.open(image, '_blank'))
            }
          }}
        >
          Click to Open a screenshot in new Window/Tab
        </button>
        <Plot
          config={config}
          axesCanvasRef={axesCanvasRef}
          layerCanvasRef={layerCanvasRef}
        />
      </PlotContainer>
    )
  })
  .add('Screenshot A Band Chart', () => {
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
      'hh:mm a'
    )
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
    const legendOrientationThreshold = number('legendOrientationThreshold', 15)
    const legendColorizeRows = tooltipColorizeRowsKnob()
    const yTickStart = number('yTickStart', 0)
    const yTickStep = number('yTickStep', 100)
    const xTotalTicks = number('xTotalTicks', 20)

    const config: Config = {
      fluxResponse: hoverAlignment3,
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
      legendColorizeRows,
      xTotalTicks,
      yTickStart,
      yTickStep,
      layers: [
        {
          type: 'band',
          x: '_time',
          y: '_value',
          fill: ['result', 'env'],
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

    const axesCanvasRef: React.RefObject<HTMLCanvasElement> = React.createRef()
    const layerCanvasRef: React.RefObject<HTMLCanvasElement> = React.createRef()

    const plotEnv = new PlotEnv()
    plotEnv.config = config as any

    return (
      <PlotContainer>
        <button
          onClick={() => {
            if (layerCanvasRef.current && axesCanvasRef.current) {
              exportImage(layerCanvasRef.current, axesCanvasRef.current, {
                top: plotEnv.margins.top,
              }).then(image => window.open(image, '_blank'))
            }
          }}
        >
          Click to Open a screenshot in new Window/Tab
        </button>
        <Plot
          config={config}
          axesCanvasRef={axesCanvasRef}
          layerCanvasRef={layerCanvasRef}
        />
      </PlotContainer>
    )
  })
  .add('Screenshot A Static Band Chart', () => {
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
    const legendOrientationThreshold = number('legendOrientationThreshold', 15)
    const legendColorizeRows = tooltipColorizeRowsKnob()
    const xTotalTicks = number('xTotalTicks', 20)

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
      legendColorizeRows,
      xTotalTicks,
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

    const axesCanvasRef: React.RefObject<HTMLCanvasElement> = React.createRef()
    const layerCanvasRef: React.RefObject<HTMLCanvasElement> = React.createRef()

    const plotEnv = new PlotEnv()
    plotEnv.config = config as any

    return (
      <PlotContainer>
        <button
          onClick={() => {
            if (layerCanvasRef.current && axesCanvasRef.current) {
              exportImage(layerCanvasRef.current, axesCanvasRef.current, {
                top: plotEnv.margins.top,
              }).then(image => window.open(image, '_blank'))
            }
          }}
        >
          Click to Open a screenshot in new Window/Tab
        </button>
        <Plot
          config={config}
          axesCanvasRef={axesCanvasRef}
          layerCanvasRef={layerCanvasRef}
        />
      </PlotContainer>
    )
  })
