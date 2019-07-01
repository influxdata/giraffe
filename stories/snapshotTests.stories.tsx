import * as React from 'react'
import {storiesOf} from '@storybook/react'

import {
  timeFormatter,
  binaryPrefixFormatter,
  fromFlux,
  newTable,
  Config,
  Plot,
} from '../src'
import {CPU} from './data'

storiesOf('Snapshot Tests', module)
  .add('with multiple minimum values', () => {
    // https://github.com/influxdata/giraffe/issues/51

    const {table} = fromFlux(
      `#group,false,false,true,false,false
#datatype,string,long,string,long,dateTime:RFC3339
#default,_result,,,,
,result,table,_field,_value,_time
,,0,event,0,2019-05-01T12:00:00Z
,,0,event,0,2019-05-02T00:00:00Z
,,0,event,0,2019-05-02T12:00:00Z
,,0,event,0,2019-05-03T00:00:00Z
,,0,event,0,2019-05-03T12:00:00Z
,,0,event,1,2019-05-04T00:00:00Z
,,0,event,6,2019-05-04T12:00:00Z
,,0,event,0,2019-05-05T00:00:00Z
,,0,event,0,2019-05-05T12:00:00Z
,,0,event,2,2019-05-06T00:00:00Z
,,0,event,0,2019-05-06T12:00:00Z
,,0,event,10,2019-05-07T00:00:00Z
,,0,event,0,2019-05-07T06:00:00Z`
    )

    const config: Config = {
      width: 600,
      height: 400,
      table,
      layers: [
        {
          type: 'line',
          x: '_time',
          y: '_value',
        },
      ],
    }

    return <Plot config={config} />
  })
  .add('line layer with shaded area and step interpolation', () => {
    const config: Config = {
      width: 600,
      height: 400,
      table: CPU,
      layers: [
        {
          type: 'line',
          x: '_time',
          y: '_value',
          fill: ['cpu'],
          interpolation: 'step',
          shadeBelow: true,
        },
      ],
    }

    return <Plot config={config} />
  })
  .add('time zone support', () => {
    const config: Config = {
      width: 300,
      height: 200,
      table: CPU,
      layers: [
        {
          type: 'line',
          x: '_time',
          y: '_value',
          fill: ['cpu'],
        },
      ],
    }

    const timeZones = [
      undefined,
      'America/Los_Angeles',
      'America/New_York',
      'UTC',
    ]

    return (
      <div
        style={{
          display: 'grid',
          gridTemplateRows: '230px 230px',
          gridTemplateColumns: '300px 300px',
          gridGap: '20px',
        }}
      >
        {timeZones.map(timeZone => (
          <div
            key={timeZone}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: 'gray',
              fontFamily: 'sans-serif',
            }}
          >
            <Plot
              config={{
                ...config,
                valueFormatters: {
                  _time: timeFormatter({timeZone, hour12: false}),
                },
              }}
            />
            {timeZone || 'Local Time'}
          </div>
        ))}
      </div>
    )
  })
  .add('binary prefix formatting', () => {
    const table = newTable(4)
      .addColumn('time', 'number', [0, 1, 2, 3])
      .addColumn('bytes', 'number', [
        6799245312,
        6475784192,
        6419197952,
        6307565568,
      ])

    const config: Config = {
      width: 600,
      height: 400,
      table,
      valueFormatters: {
        bytes: binaryPrefixFormatter({significantDigits: 2, suffix: 'iB'}),
      },
      layers: [
        {
          type: 'line',
          x: 'time',
          y: 'bytes',
        },
      ],
    }

    return <Plot config={config} />
  })
