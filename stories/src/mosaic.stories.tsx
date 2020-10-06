import * as React from 'react'
import {storiesOf} from '@storybook/react'
import {withKnobs, select, text} from '@storybook/addon-knobs'
import {cpuTable} from './data/mosaicTable'

import {
  Config,
  fromFlux,
  LayerConfig,
  Plot,
  timeFormatter,
} from '../../giraffe/src'
import {VALUE} from '../../giraffe/src/constants/columnKeys'
import {
  PlotContainer,
  colorSchemeKnob,
  findStringColumns,
  legendFontKnob,
  showAxesKnob,
  timeZoneKnob,
  tooltipOrientationThresholdKnob,
  xKnob,
} from './helpers'
import {circle_ci_example_1, cloudy} from './data/mosaicCSV'

storiesOf('Mosaic', module)
  .addDecorator(withKnobs)
  .add('Example', () => {
    const fillColumns = findStringColumns(cpuTable)
    const colors = colorSchemeKnob()
    const legendFont = legendFontKnob()
    const x = xKnob(cpuTable)
    const y = select('y', fillColumns, 'cpu')
    const selectedFill = select('fill', fillColumns, VALUE)
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
    const showAxes = showAxesKnob()
    const hoverDimension = select('Hover Dimension', {x: 'x', xy: 'xy'}, 'xy')
    const legendOrientationThreshold = tooltipOrientationThresholdKnob()

    const config: Config = {
      table: cpuTable,
      valueFormatters: {
        _time: timeFormatter({timeZone, format: timeFormat}),
      },
      legendFont,
      legendOrientationThreshold,
      showAxes,
      layers: [
        {
          type: 'mosaic',
          x,
          y,
          fill: [selectedFill],
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
  .add('Static Data with CSV', () => {
    const csv = select(
      'data',
      {
        'cloudy:city': cloudy,
        'circle_ci:branch': circle_ci_example_1,
      },
      cloudy
    )
    const table = fromFlux(csv).table
    const fillColumns = findStringColumns(table)
    const x = xKnob(table)
    const y = text('y', '')
    const selectedFill = select('fill', fillColumns, VALUE)
    const colors = colorSchemeKnob()
    const legendFont = legendFontKnob()
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
    const showAxes = showAxesKnob()
    const hoverDimension = select('Hover Dimension', {x: 'x', xy: 'xy'}, 'xy')
    const legendOrientationThreshold = tooltipOrientationThresholdKnob()

    const config: Config = {
      fluxResponse: csv,
      valueFormatters: {
        _time: timeFormatter({timeZone, format: timeFormat}),
      },
      legendFont,
      legendOrientationThreshold,
      showAxes,
      layers: [
        {
          type: 'mosaic',
          x,
          y,
          fill: [selectedFill],
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
  .add('Custom CSV', () => {
    const customCSV = text('Paste CSV here:', '')
    const x = text('x', '_time')
    const y = text('y', '')
    const colors = colorSchemeKnob()
    const legendFont = legendFontKnob()

    const timeZone = timeZoneKnob()
    const timeFormat = select(
      'Time Format',
      {
        'DD/MM/YYYY HH:mm:ss.sss': 'DD/MM/YYYY HH:mm:ss.sss',
        'MM/DD/YYYY HH:mm:ss.sss': 'MM/DD/YYYY HH:mm:ss.sss',
        'MM/DD hh:mm a': 'MM/DD hh:mm a',
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
    const fill = ['_value']
    const showAxes = showAxesKnob()
    const hoverDimension = select('Hover Dimension', {x: 'x', xy: 'xy'}, 'xy')
    const legendOrientationThreshold = tooltipOrientationThresholdKnob()

    const config: Config = {
      fluxResponse: customCSV,
      valueFormatters: {
        _time: timeFormatter({timeZone, format: timeFormat}),
      },
      legendFont,
      legendOrientationThreshold,
      showAxes,
      layers: [
        {
          type: 'mosaic',
          x,
          y,
          fill,
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
