import * as React from 'react'
import {storiesOf} from '@storybook/react'
import {Config, Plot} from '@influxdata/giraffe'
import {colorSchemeKnob, PlotContainer} from './helpers'
import {fillKnob, symbolKnob} from './helpers'
import {withKnobs, select, boolean, number, date} from '@storybook/addon-knobs'
import {Table} from '@influxdata/giraffe'
import {fromFlux} from '@influxdata/giraffe'
import {NYC_DATA_1DAY_AGGREGATED} from './worldmap.data'
import 'ol/ol.css'

const findMetricColumns = (table: Table, excludes = ['table']) =>
  table.columnKeys.filter(k => table.getColumnType(k) === 'number' && !excludes.includes(table.getColumnName(k)))

const lonKnob = (table: Table, initial?: string) =>
  select('Lon', findMetricColumns(table), initial || 'lon')

const latKnob = (table: Table, initial?: string) =>
  select('Lat', findMetricColumns(table), initial || 'lat')

const weightKnob = (table: Table, initial?: string) =>
  select('Weight', findMetricColumns(table,['table', 'lat', 'lon']), initial || 'tipAvg')

const {table} = fromFlux(NYC_DATA_1DAY_AGGREGATED)

const metrics = findMetricColumns(table,['table', 'lat', 'lon'])

const blurKnob = () =>
  number('Blur (heatmap option)', 20, {
    range: true,
    min: 5,
    max: 50,
    step: 1,
  })

const radiusKnob = () =>
  number('Radius (heatmap option)', 15, {
    range: true,
    min: 5,
    max: 50,
    step: 1,
  })

storiesOf('Worldmap Layer', module)
  .addDecorator(withKnobs)
  .add('Pointmap', () => {
    const colors = colorSchemeKnob()
    const x = lonKnob(table)
    const y = latKnob(table)
    // @ts-ignore
    const from = date('From', new Date('Nov 01 2019'))
    // @ts-ignore
    const until = date('Until', new Date('Nov 02 2019'))
    const weight = weightKnob(table, 'tipAvg')
    const fill = fillKnob(table, '')
    const symbol = symbolKnob(table, '')
    const showAxes = boolean('Axes', false)

    const config: Config = {
      table,
      showAxes,
      layers: [
        {
          type: 'worldmap',
          x,
          y,
          fill: fill,
          symbol: symbol,
          colors,
          variant: 'pointmap',
          zoom: 9,
          center: [-73.9, 40.8],
          metrics,
          weight,
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
    const colors = colorSchemeKnob()
    const x = lonKnob(table)
    const y = latKnob(table)
    // @ts-ignore
    const from = date('From', new Date('Nov 01 2019'))
    // @ts-ignore
    const UNtill = date('Until', new Date('Nov 02 2019'))
    const weight = weightKnob(table, 'tipAvg')
    const blur = blurKnob()
    const radius = radiusKnob()
    const fill = fillKnob(table, '')
    const symbol = symbolKnob(table, '')
    const showAxes = boolean('Axes', false)

    const config: Config = {
      table,
      showAxes,
      layers: [
        {
          type: 'worldmap',
          x,
          y,
          fill: fill,
          symbol: symbol,
          colors,
          variant: 'heatmap',
          zoom: 9,
          center: [-73.9, 40.8],
          metrics,
          weight,
          blur,
          radius,
        },
      ],
    }

    return (
      <PlotContainer>
        <Plot config={config} />
      </PlotContainer>
    )
  })
