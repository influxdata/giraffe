import * as React from 'react'
import {storiesOf} from '@storybook/react'
import {
  timeFormatter,
  binaryPrefixFormatter,
  fromFlux,
  fromRows,
  newTable,
  Config,
  Plot,
} from '../../giraffe/src'

import {CPU} from './data/cpu'

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
  .add('with fromRows adapter', () => {
    const table = fromRows([
      {x: 0.6637748924084008, y: 0},
      {x: 0.5484188553850314, y: 0.03450358980217672},
      {x: 0.5020185263552955, y: 0.06341968840289566},
      {x: 0.6472019204947352, y: 0.12346036922982045},
      {x: 0.5422740055349533, y: 0.13923229998318315},
      {x: 0.542361580132391, y: 0.17622395986501554},
      {x: 0.5172319678655009, y: 0.20478662312351467},
      {x: 0.5540400939258396, y: 0.26071147856098104},
      {x: 0.5490470439370002, y: 0.3018411666770542},
      {x: 0.5684781311835868, y: 0.36076719228093795},
      {x: 0.5066444671421548, y: 0.36809875195739017},
      {x: 0.48183612733450015, y: 0.3986095106998535},
      {x: 0.368753317696321, y: 0.3462824145444211},
      {x: 0.473555317706156, y: 0.5042851937677},
      {x: 0.4279284301086809, y: 0.5172766128381666},
      {x: 0.3589884886314056, y: 0.49410526540953786},
      {x: 0.319101275744127, y: 0.5028231523670745},
      {x: 0.25797378733955306, y: 0.4692525771461689},
      {x: 0.2619193247917344, y: 0.5566068978227308},
      {x: 0.2510536220102807, y: 0.6340890677894512},
      {x: 0.19812217061286364, y: 0.6097573428446372},
    ])

    const config: Config = {
      width: 600,
      height: 400,
      table,
      layers: [
        {
          type: 'scatter',
          x: 'x',
          y: 'y',
        },
      ],
    }

    return <Plot config={config} />
  })
  .add('custom y ticks', () => {
    const config: Config = {
      width: 600,
      height: 400,
      table: CPU,
      yTicks: [13, 19, 23],
      layers: [
        {
          type: 'line',
          x: '_time',
          y: '_value',
          fill: ['cpu'],
        },
      ],
    }

    return <Plot config={config} />
  })
  .add('specific histogram bin settings should not crash', () => {
    const {table} = fromFlux(
      `#group,false,false,true,true,false,false,true,true,true
#datatype,string,long,dateTime:RFC3339,dateTime:RFC3339,dateTime:RFC3339,long,string,string,string
#default,_result,,,,,,,,
,result,table,_start,_stop,_time,_value,_field,_measurement,host
,,0,2019-07-29T21:50:31.093428Z,2019-07-29T22:50:31.093428Z,2019-07-29T21:50:34Z,7246577664,available,mem,oox4k.local
,,0,2019-07-29T21:50:31.093428Z,2019-07-29T22:50:31.093428Z,2019-07-29T22:50:24Z,7176134656,available,mem,oox4k.local

#group,false,false,true,true,false,false,true,true,true
#datatype,string,long,dateTime:RFC3339,dateTime:RFC3339,dateTime:RFC3339,long,string,string,string
#default,_result,,,,,,,,
,result,table,_start,_stop,_time,_value,_field,_measurement,host
,,1,2019-07-29T21:50:31.093428Z,2019-07-29T22:50:31.093428Z,2019-07-29T21:50:34Z,6581714944,active,mem,oox4k.local
,,1,2019-07-29T21:50:31.093428Z,2019-07-29T22:50:31.093428Z,2019-07-29T22:50:24Z,6296612864,active,mem,oox4k.local`
    )

    const config: Config = {
      table,
      width: 600,
      height: 400,
      xDomain: [5472854016, 7661821952],
      layers: [
        {
          type: 'histogram',
          x: '_value',
          binCount: 30,
        },
      ],
    }

    return <Plot config={config} />
  })
