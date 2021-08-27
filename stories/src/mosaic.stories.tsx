import * as React from 'react'
import {storiesOf} from '@storybook/react'
import {select, text, withKnobs} from '@storybook/addon-knobs'
import {cpuTable} from './data/mosaicTable'

import {
  Config,
  LayerConfig,
  Plot,
  fromFlux,
  timeFormatter,
} from '../../giraffe/src'
import {VALUE} from '../../giraffe/src/constants/columnKeys'
import {
  PlotContainer,
  colorSchemeKnob,
  findStringColumns,
  legendFontKnob,
  multiSelect,
  showAxesKnob,
  tickFontKnob,
  timeZoneKnob,
  tooltipOrientationThresholdKnob,
  xKnob,
} from './helpers'
import {circle_ci_branch, cloudy} from './data/mosaicCSV'
import {nfl} from './data/nflCSV'

storiesOf('Mosaic', module)
  .addDecorator(withKnobs)
  .add('Example', () => {
    const fillColumns = findStringColumns(cpuTable)
    const colors = colorSchemeKnob()
    const legendFont = legendFontKnob()
    const x = xKnob(cpuTable)
    const yLabelColumnSeparator = text('yLabelColumnSeparator', '')
    const selectedFill = select('fill', fillColumns, VALUE)
    const yColumns = multiSelect('Data yColumns', fillColumns, ['cpu', 'host'])
    const yLabelColumns = multiSelect('Label yColumns', fillColumns, ['cpu'])
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
          y: yColumns,
          yLabelColumnSeparator,
          yLabelColumns,
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
  .add('Static Data: circle_ci:branch', () => {
    const table = fromFlux(circle_ci_branch).table
    const fillColumns = findStringColumns(table)
    const x = xKnob(table)
    const yLabelColumnSeparator = text('yLabelColumnSeparator', '')
    const selectedFill = select('fill', fillColumns, VALUE)
    const yColumns = multiSelect('Data yColumns', fillColumns, [
      'project',
      'workflow_name',
    ])
    const yLabelColumns = multiSelect('Label yColumns', fillColumns, [
      'project',
      'workflow_name',
    ])
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
        'MM/DD HH:mm:ss': 'MM/DD HH:mm:ss',
        'HH:mm': 'HH:mm',
        'HH:mm:ss': 'HH:mm:ss',
        'HH:mm:ss ZZ': 'HH:mm:ss ZZ',
        'HH:mm:ss.sss': 'HH:mm:ss.sss',
        'MMMM D, YYYY HH:mm:ss': 'MMMM D, YYYY HH:mm:ss',
        'dddd, MMMM D, YYYY HH:mm:ss': 'dddd, MMMM D, YYYY HH:mm:ss',
      },
      'MM/DD HH:mm:ss'
    )
    const showAxes = showAxesKnob()
    const hoverDimension = select(
      'Hover Dimension',
      {x: 'x', y: 'y', xy: 'xy'},
      'xy'
    )
    const legendOrientationThreshold = tooltipOrientationThresholdKnob()

    const config: Config = {
      fluxResponse: circle_ci_branch,
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
          y: yColumns,
          yLabelColumnSeparator,
          yLabelColumns,
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
  .add('Static Data: cloudy', () => {
    const table = fromFlux(cloudy).table
    const fillColumns = findStringColumns(table)
    const x = xKnob(table)
    const yLabelColumnSeparator = text('yLabelColumnSeparator', '')
    const selectedFill = select('fill', fillColumns, VALUE)
    const yColumns = multiSelect('Data yColumns', fillColumns, ['city'])
    const yLabelColumns = multiSelect('Label yColumns', fillColumns, ['city'])
    const colors = colorSchemeKnob()
    const tickFont = tickFontKnob()
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
        'MM/DD HH:mm:ss': 'MM/DD HH:mm:ss',
        'HH:mm': 'HH:mm',
        'HH:mm:ss': 'HH:mm:ss',
        'HH:mm:ss ZZ': 'HH:mm:ss ZZ',
        'HH:mm:ss.sss': 'HH:mm:ss.sss',
        'MMMM D, YYYY HH:mm:ss': 'MMMM D, YYYY HH:mm:ss',
        'dddd, MMMM D, YYYY HH:mm:ss': 'dddd, MMMM D, YYYY HH:mm:ss',
      },
      'MM/DD HH:mm:ss'
    )
    const showAxes = showAxesKnob()
    const hoverDimension = select(
      'Hover Dimension',
      {x: 'x', y: 'y', xy: 'xy'},
      'xy'
    )
    const legendOrientationThreshold = tooltipOrientationThresholdKnob()

    const config: Config = {
      fluxResponse: cloudy,
      valueFormatters: {
        _time: timeFormatter({timeZone, format: timeFormat}),
      },
      legendFont,
      legendOrientationThreshold,
      showAxes,
      tickFont,
      layers: [
        {
          type: 'mosaic',
          x,
          y: yColumns,
          yLabelColumnSeparator,
          yLabelColumns,
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
  .add('NFL 2020 Regular Season', () => {
    const table = fromFlux(nfl).table
    const fillColumns = findStringColumns(table)
    const x = xKnob(table)
    const yLabelColumnSeparator = text('yLabelColumnSeparator', '')
    const selectedFill = select('fill', fillColumns, VALUE)
    const yColumns = multiSelect('Data yColumns', fillColumns, ['team'])
    const yLabelColumns = multiSelect('Label yColumns', fillColumns, ['team'])
    const colors = colorSchemeKnob()
    const tickFont = tickFontKnob()
    const legendFont = legendFontKnob()
    const timeZone = timeZoneKnob()
    const timeFormat = select(
      'Time Format',
      {
        'MM/DD/YY': 'MM/DD/YY',
        'MM/DD/YYYY': 'MM/DD/YYYY',
        'DD/MM/YYYY HH:mm:ss.sss': 'DD/MM/YYYY HH:mm:ss.sss',
        'MM/DD/YYYY HH:mm:ss.sss': 'MM/DD/YYYY HH:mm:ss.sss',
        'YYYY/MM/DD HH:mm:ss': 'YYYY/MM/DD HH:mm:ss',
        'YYYY-MM-DD HH:mm:ss ZZ': 'YYYY-MM-DD HH:mm:ss ZZ',
        'hh:mm a': 'hh:mm a',
        'MM/DD HH:mm:ss': 'MM/DD HH:mm:ss',
        'HH:mm': 'HH:mm',
        'HH:mm:ss': 'HH:mm:ss',
        'HH:mm:ss ZZ': 'HH:mm:ss ZZ',
        'HH:mm:ss.sss': 'HH:mm:ss.sss',
        'MMMM D, YYYY HH:mm:ss': 'MMMM D, YYYY HH:mm:ss',
        'dddd, MMMM D, YYYY HH:mm:ss': 'dddd, MMMM D, YYYY HH:mm:ss',
      },
      'MM/DD/YY'
    )
    const showAxes = showAxesKnob()
    const hoverDimension = select(
      'Hover Dimension',
      {x: 'x', y: 'y', xy: 'xy'},
      'xy'
    )
    const legendOrientationThreshold = tooltipOrientationThresholdKnob()

    const config: Config = {
      fluxResponse: nfl,
      valueFormatters: {
        _time: timeFormatter({timeZone, format: timeFormat}),
      },
      legendFont,
      legendOrientationThreshold,
      showAxes,
      tickFont,
      layers: [
        {
          type: 'mosaic',
          x,
          y: yColumns,
          yLabelColumnSeparator,
          yLabelColumns,
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
    const yLabelColumnSeparator = text('yLabelColumnSeparator', '')
    const fill = text('fill', '_value')
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
          y: y.split(','),
          yLabelColumns: y.split(','),
          yLabelColumnSeparator,
          fill: [fill],
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
