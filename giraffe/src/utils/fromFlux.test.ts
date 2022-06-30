import {fromFlux, fastFromFlux} from './fromFlux'

describe('fromFlux', () => {
  it('should always pass for stability checks', () => {
    const resp = `#group,false,false,true,true,false,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true
#datatype,string,long,dateTime:RFC3339,dateTime:RFC3339,dateTime:RFC3339,long,string,string,string,string,string,string,string,string,string,string,string,string,string,string,string,string,string,string
#default,_result,,,,,,,,,,,,,,,,,,,,,,,
,result,table,_start,_stop,_time,_value,_field,_measurement,com.docker.compose.config-hash,com.docker.compose.container-number,com.docker.compose.oneoff,com.docker.compose.project,com.docker.compose.project.config_files,com.docker.compose.project.working_dir,com.docker.compose.service,com.docker.compose.version,container_image,container_name,container_status,container_version,engine_host,host,network,server_version
,,0,2020-09-04T21:42:30.122976Z,2020-09-08T21:42:30.122976Z,2020-09-08T21:09:02Z,0,rx_errors,docker_container_net,45fa1e93aad3798a2399d626ec9973dfcf5c15ed39a589ad8196f8e52fefd744,1,False,influx,"compose/fig.cloud.yml,compose/fig.chronograf.yml,compose/fig.local.yml",/Users/asalem/go/src/github.com/monitor-ci/compose,telegraf,1.25.4,influx_telegraf,influx_telegraf_1,running,unknown,docker-desktop,5551e9bfb3bd,eth0,19.03.8

#group,false,false,true,true,false,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true
#datatype,string,long,dateTime:RFC3339,dateTime:RFC3339,dateTime:RFC3339,long,string,string,string,string,string,string,string,string,string,string,string,string,string,string,string,string,string,string
#default,_result,,,,,,,,,,,,,,,,,,,,,,,
,result,table,_start,_stop,_time,_value,_field,_measurement,com.docker.compose.config-hash,com.docker.compose.container-number,com.docker.compose.oneoff,com.docker.compose.project,com.docker.compose.project.config_files,com.docker.compose.project.working_dir,com.docker.compose.service,com.docker.compose.version,container_image,container_name,container_status,container_version,cpu,engine_host,host,server_version
,,1,2020-09-04T21:42:30.122976Z,2020-09-08T21:42:30.122976Z,2020-09-08T21:09:02Z,161314315,usage_total,docker_container_cpu,45fa1e93aad3798a2399d626ec9973dfcf5c15ed39a589ad8196f8e52fefd744,1,False,influx,"compose/fig.cloud.yml,compose/fig.chronograf.yml,compose/fig.local.yml",/Users/asalem/go/src/github.com/monitor-ci/compose,telegraf,1.25.4,influx_telegraf,influx_telegraf_1,running,unknown,cpu11,docker-desktop,5551e9bfb3bd,19.03.8

#group,false,false,true,true,false,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true
#datatype,string,long,dateTime:RFC3339,dateTime:RFC3339,dateTime:RFC3339,string,string,string,string,string,string,string,string,string,string,string,string,string,string,string,string,string,string,string
#default,_result,,,,,,,,,,,,,,,,,,,,,,,
,result,table,_start,_stop,_time,_value,_field,_measurement,com.docker.compose.config-hash,com.docker.compose.container-number,com.docker.compose.oneoff,com.docker.compose.project,com.docker.compose.project.config_files,com.docker.compose.project.working_dir,com.docker.compose.service,com.docker.compose.version,container_image,container_name,container_status,container_version,cpu,engine_host,host,server_version
,,2,2020-09-04T21:42:30.122976Z,2020-09-08T21:42:30.122976Z,2020-09-08T21:09:02Z,5551e9bfb3bd722d750b94d5a843d7d56a23e1d69712828d66f75ac92039092c,container_id,docker_container_cpu,45fa1e93aad3798a2399d626ec9973dfcf5c15ed39a589ad8196f8e52fefd744,1,False,influx,"compose/fig.cloud.yml,compose/fig.chronograf.yml,compose/fig.local.yml",/Users/asalem/go/src/github.com/monitor-ci/compose,telegraf,1.25.4,influx_telegraf,influx_telegraf_1,running,unknown,cpu11,docker-desktop,5551e9bfb3bd,19.03.8

#group,false,false,true,true,false,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true
#datatype,string,long,dateTime:RFC3339,dateTime:RFC3339,dateTime:RFC3339,long,string,string,string,string,string,string,string,string,string,string,string,string,string,string,string,string,string,string
#default,_result,,,,,,,,,,,,,,,,,,,,,,,
,result,table,_start,_stop,_time,_value,_field,_measurement,com.docker.compose.config-hash,com.docker.compose.container-number,com.docker.compose.oneoff,com.docker.compose.project,com.docker.compose.project.config_files,com.docker.compose.project.working_dir,com.docker.compose.service,com.docker.compose.version,container_image,container_name,container_status,container_version,engine_host,host,network,server_version
,,3,2020-09-04T21:42:30.122976Z,2020-09-08T21:42:30.122976Z,2020-09-08T21:09:02Z,976,rx_bytes,docker_container_net,45fa1e93aad3798a2399d626ec9973dfcf5c15ed39a589ad8196f8e52fefd744,1,False,influx,"compose/fig.cloud.yml,compose/fig.chronograf.yml,compose/fig.local.yml",/Users/asalem/go/src/github.com/monitor-ci/compose,telegraf,1.25.4,influx_telegraf,influx_telegraf_1,running,unknown,docker-desktop,5551e9bfb3bd,eth0,19.03.8
,,4,2020-09-04T21:42:30.122976Z,2020-09-08T21:42:30.122976Z,2020-09-08T21:09:02Z,0,tx_errors,docker_container_net,45fa1e93aad3798a2399d626ec9973dfcf5c15ed39a589ad8196f8e52fefd744,1,False,influx,"compose/fig.cloud.yml,compose/fig.chronograf.yml,compose/fig.local.yml",/Users/asalem/go/src/github.com/monitor-ci/compose,telegraf,1.25.4,influx_telegraf,influx_telegraf_1,running,unknown,docker-desktop,5551e9bfb3bd,eth0,19.03.8
`

    const expected = {
      table: {
        length: 5,
        columns: {
          '_value (number)': {
            name: '_value',
            fluxDataType: 'long',
            type: 'number',
            data: [0, 161314315, undefined, 976, 0],
          },
          '_value (string)': {
            name: '_value',
            fluxDataType: 'string',
            type: 'string',
            data: [
              undefined,
              undefined,
              '5551e9bfb3bd722d750b94d5a843d7d56a23e1d69712828d66f75ac92039092c',
              undefined,
              undefined,
            ],
          },
          result: {
            name: 'result',
            fluxDataType: 'string',
            type: 'string',
            data: ['_result', '_result', '_result', '_result', '_result'],
          },
          table: {
            name: 'table',
            fluxDataType: 'long',
            type: 'number',
            data: [0, 1, 2, 3, 4],
          },
          _start: {
            name: '_start',
            fluxDataType: 'dateTime:RFC3339',
            type: 'time',
            data: [
              1599255750122,
              1599255750122,
              1599255750122,
              1599255750122,
              1599255750122,
            ],
          },
          _stop: {
            name: '_stop',
            fluxDataType: 'dateTime:RFC3339',
            type: 'time',
            data: [
              1599601350122,
              1599601350122,
              1599601350122,
              1599601350122,
              1599601350122,
            ],
          },
          _time: {
            name: '_time',
            fluxDataType: 'dateTime:RFC3339',
            type: 'time',
            data: [
              1599599342000,
              1599599342000,
              1599599342000,
              1599599342000,
              1599599342000,
            ],
          },
          _field: {
            name: '_field',
            fluxDataType: 'string',
            type: 'string',
            data: [
              'rx_errors',
              'usage_total',
              'container_id',
              'rx_bytes',
              'tx_errors',
            ],
          },
          _measurement: {
            name: '_measurement',
            fluxDataType: 'string',
            type: 'string',
            data: [
              'docker_container_net',
              'docker_container_cpu',
              'docker_container_cpu',
              'docker_container_net',
              'docker_container_net',
            ],
          },
          'com.docker.compose.config-hash': {
            name: 'com.docker.compose.config-hash',
            fluxDataType: 'string',
            type: 'string',
            data: [
              '45fa1e93aad3798a2399d626ec9973dfcf5c15ed39a589ad8196f8e52fefd744',
              '45fa1e93aad3798a2399d626ec9973dfcf5c15ed39a589ad8196f8e52fefd744',
              '45fa1e93aad3798a2399d626ec9973dfcf5c15ed39a589ad8196f8e52fefd744',
              '45fa1e93aad3798a2399d626ec9973dfcf5c15ed39a589ad8196f8e52fefd744',
              '45fa1e93aad3798a2399d626ec9973dfcf5c15ed39a589ad8196f8e52fefd744',
            ],
          },
          'com.docker.compose.container-number': {
            name: 'com.docker.compose.container-number',
            fluxDataType: 'string',
            type: 'string',
            data: ['1', '1', '1', '1', '1'],
          },
          'com.docker.compose.oneoff': {
            name: 'com.docker.compose.oneoff',
            fluxDataType: 'string',
            type: 'string',
            data: ['False', 'False', 'False', 'False', 'False'],
          },
          'com.docker.compose.project': {
            name: 'com.docker.compose.project',
            fluxDataType: 'string',
            type: 'string',
            data: ['influx', 'influx', 'influx', 'influx', 'influx'],
          },
          'com.docker.compose.project.config_files': {
            name: 'com.docker.compose.project.config_files',
            fluxDataType: 'string',
            type: 'string',
            data: [
              'compose/fig.cloud.yml,compose/fig.chronograf.yml,compose/fig.local.yml',
              'compose/fig.cloud.yml,compose/fig.chronograf.yml,compose/fig.local.yml',
              'compose/fig.cloud.yml,compose/fig.chronograf.yml,compose/fig.local.yml',
              'compose/fig.cloud.yml,compose/fig.chronograf.yml,compose/fig.local.yml',
              'compose/fig.cloud.yml,compose/fig.chronograf.yml,compose/fig.local.yml',
            ],
          },
          'com.docker.compose.project.working_dir': {
            name: 'com.docker.compose.project.working_dir',
            fluxDataType: 'string',
            type: 'string',
            data: [
              '/Users/asalem/go/src/github.com/monitor-ci/compose',
              '/Users/asalem/go/src/github.com/monitor-ci/compose',
              '/Users/asalem/go/src/github.com/monitor-ci/compose',
              '/Users/asalem/go/src/github.com/monitor-ci/compose',
              '/Users/asalem/go/src/github.com/monitor-ci/compose',
            ],
          },
          'com.docker.compose.service': {
            name: 'com.docker.compose.service',
            fluxDataType: 'string',
            type: 'string',
            data: ['telegraf', 'telegraf', 'telegraf', 'telegraf', 'telegraf'],
          },
          'com.docker.compose.version': {
            name: 'com.docker.compose.version',
            fluxDataType: 'string',
            type: 'string',
            data: ['1.25.4', '1.25.4', '1.25.4', '1.25.4', '1.25.4'],
          },
          container_image: {
            name: 'container_image',
            fluxDataType: 'string',
            type: 'string',
            data: [
              'influx_telegraf',
              'influx_telegraf',
              'influx_telegraf',
              'influx_telegraf',
              'influx_telegraf',
            ],
          },
          container_name: {
            name: 'container_name',
            fluxDataType: 'string',
            type: 'string',
            data: [
              'influx_telegraf_1',
              'influx_telegraf_1',
              'influx_telegraf_1',
              'influx_telegraf_1',
              'influx_telegraf_1',
            ],
          },
          container_status: {
            name: 'container_status',
            fluxDataType: 'string',
            type: 'string',
            data: ['running', 'running', 'running', 'running', 'running'],
          },
          container_version: {
            name: 'container_version',
            fluxDataType: 'string',
            type: 'string',
            data: ['unknown', 'unknown', 'unknown', 'unknown', 'unknown'],
          },
          engine_host: {
            name: 'engine_host',
            fluxDataType: 'string',
            type: 'string',
            data: [
              'docker-desktop',
              'docker-desktop',
              'docker-desktop',
              'docker-desktop',
              'docker-desktop',
            ],
          },
          host: {
            name: 'host',
            fluxDataType: 'string',
            type: 'string',
            data: [
              '5551e9bfb3bd',
              '5551e9bfb3bd',
              '5551e9bfb3bd',
              '5551e9bfb3bd',
              '5551e9bfb3bd',
            ],
          },
          network: {
            name: 'network',
            fluxDataType: 'string',
            type: 'string',
            data: ['eth0', undefined, undefined, 'eth0', 'eth0'],
          },
          server_version: {
            name: 'server_version',
            fluxDataType: 'string',
            type: 'string',
            data: ['19.03.8', '19.03.8', '19.03.8', '19.03.8', '19.03.8'],
          },
          cpu: {
            name: 'cpu',
            fluxDataType: 'string',
            type: 'string',
            data: [undefined, 'cpu11', 'cpu11', undefined, undefined],
          },
        },
      },
      fluxGroupKeyUnion: [
        '_start',
        '_stop',
        '_field',
        '_measurement',
        'com.docker.compose.config-hash',
        'com.docker.compose.container-number',
        'com.docker.compose.oneoff',
        'com.docker.compose.project',
        'com.docker.compose.project.config_files',
        'com.docker.compose.project.working_dir',
        'com.docker.compose.service',
        'com.docker.compose.version',
        'container_image',
        'container_name',
        'container_status',
        'container_version',
        'engine_host',
        'host',
        'network',
        'server_version',
        'cpu',
      ],
      resultColumnNames: ['_result'],
    }
    const fFlux = fromFlux(resp)
    expect(fFlux).toEqual(expected)
  })
  it('should be able to handle multiple tables with different values and results and |r returned CSV', () => {
    const resp = `#group,false,false,true,true,false,false,true,true,true,true,true,true\r
#datatype,string,long,dateTime:RFC3339,dateTime:RFC3339,dateTime:RFC3339,double,string,string,string,string,string,string\r
#default,_result,,,,,,,,,,,\r
,result,table,_start,_stop,_time,_value,_field,_measurement,code,crypto,description,symbol\r
,,0,2022-06-28T13:22:34.9161857Z,2022-06-29T13:22:34.9161857Z,2022-06-29T12:48:00Z,19058.5865,price,coindesk,EUR,bitcoin,Euro,&euro;\r
\r
#group,false,false,true,true,false,false,true,true,true\r
#datatype,string,long,dateTime:RFC3339,dateTime:RFC3339,dateTime:RFC3339,double,string,string,string\r
#default,_result,,,,,,,,\r
,result,table,_start,_stop,_time,_value,_field,_measurement,location\r
,,1,2022-06-28T13:22:34.9161857Z,2022-06-29T13:22:34.9161857Z,2022-06-29T00:59:24.885285715Z,89,degrees,average_temperature,coyote_creek\r
\r
#group,false,false,true,true,false,false,true,true,true,true\r
#datatype,string,long,dateTime:RFC3339,dateTime:RFC3339,dateTime:RFC3339,double,string,string,string,string\r
#default,_result,,,,,,,,,\r
,result,table,_start,_stop,_time,_value,_field,_measurement,location,randtag\r
,,2,2022-06-28T13:22:34.9161857Z,2022-06-29T13:22:34.9161857Z,2022-06-29T06:17:24.885285715Z,100,index,h2o_quality,santa_monica,3\r
\r
#group,false,false,true,true,false,false,true,true,true\r
#datatype,string,long,dateTime:RFC3339,dateTime:RFC3339,dateTime:RFC3339,double,string,string,string\r
#default,_result,,,,,,,,\r
,result,table,_start,_stop,_time,_value,_field,_measurement,sensor_id\r
,,3,2022-06-28T13:22:34.9161857Z,2022-06-29T13:22:34.9161857Z,2022-06-29T12:49:32Z,71.07602188197231,temperature,airSensors,TLM0103\r
\r
#group,false,false,true,true,false,false,true,true,true,true,true,true,true\r
#datatype,string,long,dateTime:RFC3339,dateTime:RFC3339,dateTime:RFC3339,string,string,string,string,string,string,string,string\r
#default,_result,,,,,,,,,,,,\r
,result,table,_start,_stop,_time,_value,_field,_measurement,code,id,magType,net,title\r
,,4,2022-06-28T13:22:34.9161857Z,2022-06-29T13:22:34.9161857Z,2022-06-28T13:43:29.505Z,green,alert,earthquake,7000hkud,us7000hkud,mww,us,"M 5.4 - 44 km W of Hengchun, Taiwan"\r
\r
#group,false,false,true,true,false,false,true,true,true,true,true,true,true\r
#datatype,string,long,dateTime:RFC3339,dateTime:RFC3339,dateTime:RFC3339,double,string,string,string,string,string,string,string\r
#default,_result,,,,,,,,,,,,\r
,result,table,_start,_stop,_time,_value,_field,_measurement,code,id,magType,net,title\r
,,5,2022-06-28T13:22:34.9161857Z,2022-06-29T13:22:34.9161857Z,2022-06-28T15:09:54.052Z,3.1,cdi,earthquake,7000hkux,us7000hkux,mb,us,"M 4.6 - 107 km NNW of Te Anau, New Zealand"\r
`
    /* eslint-disable */
    const expected = {
      _field: {
        data: ['price', 'degrees', 'index', 'temperature', 'alert', 'cdi'],
        fluxDataType: 'string',
        name: '_field',
        type: 'string',
      },
      _measurement: {
        data: [
          'coindesk',
          'average_temperature',
          'h2o_quality',
          'airSensors',
          'earthquake',
          'earthquake',
        ],
        fluxDataType: 'string',
        name: '_measurement',
        type: 'string',
      },
      _start: {
        data: [
          1656422554916,
          1656422554916,
          1656422554916,
          1656422554916,
          1656422554916,
          1656422554916,
        ],
        fluxDataType: 'dateTime:RFC3339',
        name: '_start',
        type: 'time',
      },
      _stop: {
        data: [
          1656508954916,
          1656508954916,
          1656508954916,
          1656508954916,
          1656508954916,
          1656508954916,
        ],
        fluxDataType: 'dateTime:RFC3339',
        name: '_stop',
        type: 'time',
      },
      _time: {
        data: [
          1656506880000,
          1656464364885,
          1656483444885,
          1656506972000,
          1656423809505,
          1656428994052,
        ],
        fluxDataType: 'dateTime:RFC3339',
        name: '_time',
        type: 'time',
      },
      '_value (number)': {
        data: [19058.5865, 89, 100, 71.07602188197231, , 3.1],
        fluxDataType: 'double',
        name: '_value',
        type: 'number',
      },
      '_value (string)': {
        data: [, , , ,'green', ,],
        fluxDataType: 'string',
        name: '_value',
        type: 'string',
      },
      code: {
        data: ['EUR', , , , '7000hkud', '7000hkux'],
        fluxDataType: 'string',
        name: 'code',
        type: 'string',
      },
      crypto: {
        data: ['bitcoin', , , , , ,],
        fluxDataType: 'string',
        name: 'crypto',
        type: 'string',
      },
      description: {
        data: ['Euro', , , , , ,],
        fluxDataType: 'string',
        name: 'description',
        type: 'string',
      },
      id: {
        data: [, , , , 'us7000hkud', 'us7000hkux'],
        fluxDataType: 'string',
        name: 'id',
        type: 'string',
      },
      location: {
        data: [, 'coyote_creek', 'santa_monica', , , ,],
        fluxDataType: 'string',
        name: 'location',
        type: 'string',
      },
      magType: {
        data: [, , , , 'mww', 'mb'],
        fluxDataType: 'string',
        name: 'magType',
        type: 'string',
      },
      net: {
        data: [, , , , 'us', 'us'],
        fluxDataType: 'string',
        name: 'net',
        type: 'string',
      },
      randtag: {
        data: [, , '3', , , ,],
        fluxDataType: 'string',
        name: 'randtag',
        type: 'string',
      },
      result: {
        data: [
          '_result',
          '_result',
          '_result',
          '_result',
          '_result',
          '_result',
        ],
        fluxDataType: 'string',
        name: 'result',
        type: 'string',
      },
      sensor_id: {
        data: [, , , 'TLM0103', , ,],
        fluxDataType: 'string',
        name: 'sensor_id',
        type: 'string',
      },
      symbol: {
        data: ['&euro;', , , , , ,],
        fluxDataType: 'string',
        name: 'symbol',
        type: 'string',
      },
      table: {
        data: [0, 1, 2, 3, 4, 5],
        fluxDataType: 'long',
        name: 'table',
        type: 'number',
      },
      title: {
        data: [, , , ,'M 5.4 - 44 km W of Hengchun, Taiwan', 'M 4.6 - 107 km NNW of Te Anau, New Zealand'],
        fluxDataType: 'string',
        name: 'title',
        type: 'string',
      },
    }
    /* eslint-enable */

    const expectedGroupKeys = [
      '_start',
      '_stop',
      '_field',
      '_measurement',
      'code',
      'crypto',
      'description',
      'symbol',
      'location',
      'randtag',
      'sensor_id',
      'id',
      'magType',
      'net',
      'title',
    ]

    const parsed = fromFlux(resp)
    const columns: any = (parsed.table as any)?.columns
    const fluxGroupKeyUnion = parsed.fluxGroupKeyUnion
    expect(columns).toStrictEqual(expected)
    expect(fluxGroupKeyUnion).toStrictEqual(expectedGroupKeys)
  })

  it('can parse a Flux CSV with mismatched schemas', () => {
    const CSV = `#group,false,false,true,true,false,true,true,true,true,true
#datatype,string,long,dateTime:RFC3339,dateTime:RFC3339,dateTime:RFC3339,double,string,string,string,string
#default,_result,,,,,,,,,
,result,table,_start,_stop,_time,_value,_field,_measurement,cpu,host
,,0,2019-02-01T23:38:32.524234Z,2019-02-01T23:39:02.524234Z,2019-02-01T23:38:33Z,10,usage_guest,cpu,cpu-total,oox4k.local
,,1,2019-02-01T23:38:32.524234Z,2019-02-01T23:39:02.524234Z,2019-02-01T23:38:43Z,20,usage_guest,cpu,cpu-total,oox4k.local

#group,false,false,true,true,false,true,true,true,true,true
#datatype,string,long,dateTime:RFC3339,dateTime:RFC3339,dateTime:RFC3339,string,string,string,string,string
#default,_result,,,,,,,,,
,result,table,_start,_stop,_time,_value,_field,_measurement,cpu,host
,,2,2019-02-01T23:38:32.524234Z,2019-02-01T23:39:02.524234Z,2019-02-01T23:38:33Z,thirty,usage_guest,cpu,cpu0,oox4k.local
,,3,2019-02-01T23:38:32.524234Z,2019-02-01T23:39:02.524234Z,2019-02-01T23:38:43Z,fourty,usage_guest,cpu,cpu0,oox4k.local`

    const actual = fromFlux(CSV)

    expect(actual.resultColumnNames).toEqual(['_result'])

    expect(actual.table.getColumn('result', 'string')).toEqual([
      '_result',
      '_result',
      '_result',
      '_result',
    ])

    expect(actual.table.getColumn('_start', 'time')).toEqual([
      1549064312524,
      1549064312524,
      1549064312524,
      1549064312524,
    ])

    expect(actual.table.getColumn('_stop', 'time')).toEqual([
      1549064342524,
      1549064342524,
      1549064342524,
      1549064342524,
    ])

    expect(actual.table.getColumn('_time', 'time')).toEqual([
      1549064313000,
      1549064323000,
      1549064313000,
      1549064323000,
    ])

    expect(actual.table.getColumn('_value (number)', 'number')).toEqual([
      10,
      20,
      undefined,
      undefined,
    ])

    expect(actual.table.getColumn('_value (string)', 'string')).toEqual([
      undefined,
      undefined,
      'thirty',
      'fourty',
    ])

    expect(actual.table.getColumn('_field', 'string')).toEqual([
      'usage_guest',
      'usage_guest',
      'usage_guest',
      'usage_guest',
    ])

    expect(actual.table.getColumn('_measurement', 'string')).toEqual([
      'cpu',
      'cpu',
      'cpu',
      'cpu',
    ])

    expect(actual.table.getColumn('cpu', 'string')).toEqual([
      'cpu-total',
      'cpu-total',
      'cpu0',
      'cpu0',
    ])

    expect(actual.table.getColumn('host', 'string')).toEqual([
      'oox4k.local',
      'oox4k.local',
      'oox4k.local',
      'oox4k.local',
    ])

    expect(actual.table.getColumn('table', 'number')).toEqual([0, 1, 2, 3])

    expect(actual.table.getColumnName('_value (number)')).toEqual('_value')

    expect(actual.table.getColumnName('_value (string)')).toEqual('_value')

    expect(actual.fluxGroupKeyUnion).toEqual([
      '_value (number)',
      '_value (string)',
      '_start',
      '_stop',
      '_field',
      '_measurement',
      'cpu',
      'host',
    ])
  })

  it('should error out gracefully when an error is thrown in the fromFlux parser', () => {
    const CSV =
      '#group,false,false,true,true,false,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true'

    expect(() => {
      fastFromFlux(CSV)
    }).not.toThrow()
  })

  it('uses the default annotation to fill in empty values', () => {
    const CSV = `#group,false,false,true,true,true,true
#datatype,string,long,string,string,long,long
#default,_result,,,cpu,,6
,result,table,a,b,c,d
,,1,usage_guest,,4,
,,1,usage_guest,,5,`

    const actual = fromFlux(CSV).table

    expect(actual.getColumn('result')).toEqual(['_result', '_result'])
    expect(actual.getColumn('a')).toEqual(['usage_guest', 'usage_guest'])
    expect(actual.getColumn('b')).toEqual(['cpu', 'cpu'])
    expect(actual.getColumn('c')).toEqual([4, 5])
    expect(actual.getColumn('d')).toEqual([6, 6])
  })

  it('returns a group key union', () => {
    const CSV = `#group,true,false,false,true
#datatype,string,string,string,string
#default,,,,
,a,b,c,d
,,,,

#group,false,false,true,false
#datatype,string,string,string,string
#default,,,,
,a,b,c,d
,,,,`

    const {fluxGroupKeyUnion} = fromFlux(CSV)

    expect(fluxGroupKeyUnion).toEqual(['a', 'c', 'd'])
  })

  it('returns all result column names', () => {
    const CSV = `#group,true,false,false,true
#datatype,string,string,string,string
#default,strangeColumnA,,,
,result,b,c,d
,,0,0,0

#group,false,false,true,false
#datatype,string,string,string,string
#default,strangeColumnB,,,
,result,b,c,d
,,0,0,0`

    const {resultColumnNames} = fromFlux(CSV)

    expect(resultColumnNames).toEqual(['strangeColumnA', 'strangeColumnB'])
  })

  it('handles result column in unexpected column position', () => {
    const DEFAULT_CSV = `#group,true,false,false,true
#datatype,string,string,string,string
#default,,resultInUnexpectedPosA,,
,a,result,c,d
,0,,0,0

#group,false,false,true,false
#datatype,string,string,string,string
#default,,resultInUnexpectedPosB,,
,a,result,c,d
,0,,0,0`

    const defaultCSV = fromFlux(DEFAULT_CSV)

    expect(defaultCSV.resultColumnNames).toEqual([
      'resultInUnexpectedPosA',
      'resultInUnexpectedPosB',
    ])

    const ROWS_CSV = `#group,true,false,false,true
#datatype,string,string,string,string
#default,,,,
,a,result,c,d
,0,resultInUnexpectedPosA,0,0

#group,false,false,true,false
#datatype,string,string,string,string
#default,,,,
,a,result,c,d
,0,resultInUnexpectedPosB,0,0`

    const rowsCSV = fromFlux(ROWS_CSV)

    expect(rowsCSV.resultColumnNames).toEqual([
      'resultInUnexpectedPosA',
      'resultInUnexpectedPosB',
    ])
  })

  it('handles blank result column names and empty rows', () => {
    const BLANK_RESULT_COLUMN_CSV = `#group,true,false,false,true
#datatype,string,string,string,string
#default,,,,
,result,b,c,d
,,0,0,0

#group,false,false,true,false
#datatype,string,string,string,string
#default,,,,
,result,b,c,d
,,0,0,0`

    const blankResultColumn = fromFlux(BLANK_RESULT_COLUMN_CSV)

    expect(blankResultColumn.resultColumnNames).toEqual([])

    const EMPTY_ROWS_CSV = `#group,true,false,false,true
#datatype,string,string,string,string
#default,strangeColumnA,,,
,result,b,c,d

#group,false,false,true,false
#datatype,string,string,string,string
#default,strangeColumnB,,,
,result,b,c,d`

    const emptyRows = fromFlux(EMPTY_ROWS_CSV)

    expect(emptyRows.resultColumnNames).toEqual([])
  })

  it('handles missing result column', () => {
    const NO_RESULT_CSV = `#group,true,false,false,true
#datatype,string,string,string,string
#default,strangeColumnA,,,
,a,b,c,d
,,,,

#group,false,false,true,false
#datatype,string,string,string,string
#default,strangeColumnB,,,
,a,b,c,d
,,,,`

    const {resultColumnNames} = fromFlux(NO_RESULT_CSV)

    expect(resultColumnNames).toEqual([])
  })

  it('parses empty numeric values as null', () => {
    const CSV = `#group,false,false,true,true,false,true,true,true,true,true
#datatype,string,long,dateTime:RFC3339,dateTime:RFC3339,dateTime:RFC3339,double,string,string,string,string
#default,_result,,,,,,,,,
,result,table,_start,_stop,_time,_value,_field,_measurement,cpu,host
,,0,2019-02-01T23:38:32.524234Z,2019-02-01T23:39:02.524234Z,2019-02-01T23:38:33Z,10,usage_guest,cpu,cpu-total,oox4k.local
,,1,2019-02-01T23:38:32.524234Z,2019-02-01T23:39:02.524234Z,2019-02-01T23:38:43Z,,usage_guest,cpu,cpu-total,oox4k.local`

    const {table} = fromFlux(CSV)

    expect(table.getColumn('_value')).toEqual([10, null])
  })

  it('handles newlines inside string values', () => {
    const CSV = `#group,false,false,false,false
#datatype,string,long,string,long
#default,_result,,,
,result,table,message,value
,,0,howdy,5
,,0,"hello

there",5
,,0,hi,6

#group,false,false,false,false
#datatype,string,long,string,long
#default,_result,,,
,result,table,message,value
,,1,howdy,5
,,1,"hello

there",5
,,1,hi,6`

    const {table} = fromFlux(CSV)

    expect(table.getColumn('value')).toEqual([5, 5, 6, 5, 5, 6])

    expect(table.getColumn('message')).toEqual([
      'howdy',
      'hello\n\nthere',
      'hi',
      'howdy',
      'hello\n\nthere',
      'hi',
    ])
  })

  it('parses dateTime with a space before the value', () => {
    const CSV = `#group,false,false,true,true,false,false,true,true,true,true
#datatype,string,long,dateTime:RFC3339,dateTime:RFC3339,dateTime:RFC3339,double,string,string,string,string,dateTime:RFC3339
#default,last,,,,,,,,,,
,result,table,_start,_stop,_time,_value,_field,_measurement,host,station_id,time
,,0,2021-01-19T20:58:58.549310588Z,2021-01-21T20:58:58.549310588Z,2021-01-21T13:00:00Z,1,is_installed,baywheels,ip-192-168-1-6.ec2.internal,499, 2021-01-18T12:20:02.582Z,`

    const {table} = fromFlux(CSV)

    expect(table.getColumn('time')).toEqual([1610972402582])
  })

  it('parses dateTime with a space after the value', () => {
    const CSV = `#group,false,false,true,true,false,false,true,true,true,true
#datatype,string,long,dateTime:RFC3339,dateTime:RFC3339,dateTime:RFC3339,double,string,string,string,string,dateTime:RFC3339
#default,last,,,,,,,,,,
,result,table,_start,_stop,_time,_value,_field,_measurement,host,station_id,time
,,0,2021-01-19T20:58:58.549310588Z,2021-01-21T20:58:58.549310588Z,2021-01-21T13:00:00Z,1,is_installed,baywheels,ip-192-168-1-6.ec2.internal,499,2021-01-18T12:20:02.582Z ,`

    const {table} = fromFlux(CSV)

    expect(table.getColumn('time')).toEqual([1610972402582])
  })

  it('parses dateTime with a space before and after the value', () => {
    const CSV = `#group,false,false,true,true,false,false,true,true,true,true
#datatype,string,long,dateTime:RFC3339,dateTime:RFC3339,dateTime:RFC3339,double,string,string,string,string,dateTime:RFC3339
#default,last,,,,,,,,,,
,result,table,_start,_stop,_time,_value,_field,_measurement,host,station_id,time
,,0,2021-01-19T20:58:58.549310588Z,2021-01-21T20:58:58.549310588Z,2021-01-21T13:00:00Z,1,is_installed,baywheels,ip-192-168-1-6.ec2.internal,499, 2021-01-18T12:20:02.582Z ,`

    const {table} = fromFlux(CSV)

    expect(table.getColumn('time')).toEqual([1610972402582])
  })

  it('should parse CSV with hashtags, commas and newlines', () => {
    const CSV = `#group,false,false,true,false
#datatype,string,long,long,string
#default,_result,,,
,result,table,_time_reverse,_value
,,0,-1652887800000000000,"[2022-05-18 15:30:00 UTC] @textAndCommas: Visit https://a.link/

,#hashtag, #another, hash tag"
,,0,-1652888700000000000,"[2022-05-18 15:45:00 UTC] @emojis: 👇👇👇
, new line
another new line"`

    const {table} = fromFlux(CSV)

    const valueColumn = table.getColumn('_value')

    const expectedValueColumn = [
      `[2022-05-18 15:30:00 UTC] @textAndCommas: Visit https://a.link/

,#hashtag, #another, hash tag`,
      `[2022-05-18 15:45:00 UTC] @emojis: 👇👇👇
, new line
another new line`,
    ]

    expect(valueColumn).toEqual(expectedValueColumn)
  })
})
describe('fastFromFlux', () => {
  it('should always pass for stability checks', () => {
    const resp = `#group,false,false,true,true,false,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true
#datatype,string,long,dateTime:RFC3339,dateTime:RFC3339,dateTime:RFC3339,long,string,string,string,string,string,string,string,string,string,string,string,string,string,string,string,string,string,string
#default,_result,,,,,,,,,,,,,,,,,,,,,,,
,result,table,_start,_stop,_time,_value,_field,_measurement,com.docker.compose.config-hash,com.docker.compose.container-number,com.docker.compose.oneoff,com.docker.compose.project,com.docker.compose.project.config_files,com.docker.compose.project.working_dir,com.docker.compose.service,com.docker.compose.version,container_image,container_name,container_status,container_version,engine_host,host,network,server_version
,,0,2020-09-04T21:42:30.122976Z,2020-09-08T21:42:30.122976Z,2020-09-08T21:09:02Z,0,rx_errors,docker_container_net,45fa1e93aad3798a2399d626ec9973dfcf5c15ed39a589ad8196f8e52fefd744,1,False,influx,"compose/fig.cloud.yml,compose/fig.chronograf.yml,compose/fig.local.yml",/Users/asalem/go/src/github.com/monitor-ci/compose,telegraf,1.25.4,influx_telegraf,influx_telegraf_1,running,unknown,docker-desktop,5551e9bfb3bd,eth0,19.03.8

#group,false,false,true,true,false,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true
#datatype,string,long,dateTime:RFC3339,dateTime:RFC3339,dateTime:RFC3339,long,string,string,string,string,string,string,string,string,string,string,string,string,string,string,string,string,string,string
#default,_result,,,,,,,,,,,,,,,,,,,,,,,
,result,table,_start,_stop,_time,_value,_field,_measurement,com.docker.compose.config-hash,com.docker.compose.container-number,com.docker.compose.oneoff,com.docker.compose.project,com.docker.compose.project.config_files,com.docker.compose.project.working_dir,com.docker.compose.service,com.docker.compose.version,container_image,container_name,container_status,container_version,cpu,engine_host,host,server_version
,,1,2020-09-04T21:42:30.122976Z,2020-09-08T21:42:30.122976Z,2020-09-08T21:09:02Z,161314315,usage_total,docker_container_cpu,45fa1e93aad3798a2399d626ec9973dfcf5c15ed39a589ad8196f8e52fefd744,1,False,influx,"compose/fig.cloud.yml,compose/fig.chronograf.yml,compose/fig.local.yml",/Users/asalem/go/src/github.com/monitor-ci/compose,telegraf,1.25.4,influx_telegraf,influx_telegraf_1,running,unknown,cpu11,docker-desktop,5551e9bfb3bd,19.03.8

#group,false,false,true,true,false,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true
#datatype,string,long,dateTime:RFC3339,dateTime:RFC3339,dateTime:RFC3339,string,string,string,string,string,string,string,string,string,string,string,string,string,string,string,string,string,string,string
#default,_result,,,,,,,,,,,,,,,,,,,,,,,
,result,table,_start,_stop,_time,_value,_field,_measurement,com.docker.compose.config-hash,com.docker.compose.container-number,com.docker.compose.oneoff,com.docker.compose.project,com.docker.compose.project.config_files,com.docker.compose.project.working_dir,com.docker.compose.service,com.docker.compose.version,container_image,container_name,container_status,container_version,cpu,engine_host,host,server_version
,,2,2020-09-04T21:42:30.122976Z,2020-09-08T21:42:30.122976Z,2020-09-08T21:09:02Z,5551e9bfb3bd722d750b94d5a843d7d56a23e1d69712828d66f75ac92039092c,container_id,docker_container_cpu,45fa1e93aad3798a2399d626ec9973dfcf5c15ed39a589ad8196f8e52fefd744,1,False,influx,"compose/fig.cloud.yml,compose/fig.chronograf.yml,compose/fig.local.yml",/Users/asalem/go/src/github.com/monitor-ci/compose,telegraf,1.25.4,influx_telegraf,influx_telegraf_1,running,unknown,cpu11,docker-desktop,5551e9bfb3bd,19.03.8

#group,false,false,true,true,false,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true
#datatype,string,long,dateTime:RFC3339,dateTime:RFC3339,dateTime:RFC3339,long,string,string,string,string,string,string,string,string,string,string,string,string,string,string,string,string,string,string
#default,_result,,,,,,,,,,,,,,,,,,,,,,,
,result,table,_start,_stop,_time,_value,_field,_measurement,com.docker.compose.config-hash,com.docker.compose.container-number,com.docker.compose.oneoff,com.docker.compose.project,com.docker.compose.project.config_files,com.docker.compose.project.working_dir,com.docker.compose.service,com.docker.compose.version,container_image,container_name,container_status,container_version,engine_host,host,network,server_version
,,3,2020-09-04T21:42:30.122976Z,2020-09-08T21:42:30.122976Z,2020-09-08T21:09:02Z,976,rx_bytes,docker_container_net,45fa1e93aad3798a2399d626ec9973dfcf5c15ed39a589ad8196f8e52fefd744,1,False,influx,"compose/fig.cloud.yml,compose/fig.chronograf.yml,compose/fig.local.yml",/Users/asalem/go/src/github.com/monitor-ci/compose,telegraf,1.25.4,influx_telegraf,influx_telegraf_1,running,unknown,docker-desktop,5551e9bfb3bd,eth0,19.03.8
,,4,2020-09-04T21:42:30.122976Z,2020-09-08T21:42:30.122976Z,2020-09-08T21:09:02Z,0,tx_errors,docker_container_net,45fa1e93aad3798a2399d626ec9973dfcf5c15ed39a589ad8196f8e52fefd744,1,False,influx,"compose/fig.cloud.yml,compose/fig.chronograf.yml,compose/fig.local.yml",/Users/asalem/go/src/github.com/monitor-ci/compose,telegraf,1.25.4,influx_telegraf,influx_telegraf_1,running,unknown,docker-desktop,5551e9bfb3bd,eth0,19.03.8
`

    const expected = {
      table: {
        length: 5,
        columns: {
          '_value (number)': {
            name: '_value',
            fluxDataType: 'long',
            type: 'number',
            data: [0, 161314315, undefined, 976, 0],
          },
          '_value (string)': {
            name: '_value',
            fluxDataType: 'string',
            type: 'string',
            data: [
              undefined,
              undefined,
              '5551e9bfb3bd722d750b94d5a843d7d56a23e1d69712828d66f75ac92039092c',
              undefined,
              undefined,
            ],
          },
          result: {
            name: 'result',
            fluxDataType: 'string',
            type: 'string',
            data: ['_result', '_result', '_result', '_result', '_result'],
          },
          table: {
            name: 'table',
            fluxDataType: 'long',
            type: 'number',
            data: [0, 1, 2, 3, 4],
          },
          _start: {
            name: '_start',
            fluxDataType: 'dateTime:RFC3339',
            type: 'time',
            data: [
              1599255750122,
              1599255750122,
              1599255750122,
              1599255750122,
              1599255750122,
            ],
          },
          _stop: {
            name: '_stop',
            fluxDataType: 'dateTime:RFC3339',
            type: 'time',
            data: [
              1599601350122,
              1599601350122,
              1599601350122,
              1599601350122,
              1599601350122,
            ],
          },
          _time: {
            name: '_time',
            fluxDataType: 'dateTime:RFC3339',
            type: 'time',
            data: [
              1599599342000,
              1599599342000,
              1599599342000,
              1599599342000,
              1599599342000,
            ],
          },
          _field: {
            name: '_field',
            fluxDataType: 'string',
            type: 'string',
            data: [
              'rx_errors',
              'usage_total',
              'container_id',
              'rx_bytes',
              'tx_errors',
            ],
          },
          _measurement: {
            name: '_measurement',
            fluxDataType: 'string',
            type: 'string',
            data: [
              'docker_container_net',
              'docker_container_cpu',
              'docker_container_cpu',
              'docker_container_net',
              'docker_container_net',
            ],
          },
          'com.docker.compose.config-hash': {
            name: 'com.docker.compose.config-hash',
            fluxDataType: 'string',
            type: 'string',
            data: [
              '45fa1e93aad3798a2399d626ec9973dfcf5c15ed39a589ad8196f8e52fefd744',
              '45fa1e93aad3798a2399d626ec9973dfcf5c15ed39a589ad8196f8e52fefd744',
              '45fa1e93aad3798a2399d626ec9973dfcf5c15ed39a589ad8196f8e52fefd744',
              '45fa1e93aad3798a2399d626ec9973dfcf5c15ed39a589ad8196f8e52fefd744',
              '45fa1e93aad3798a2399d626ec9973dfcf5c15ed39a589ad8196f8e52fefd744',
            ],
          },
          'com.docker.compose.container-number': {
            name: 'com.docker.compose.container-number',
            fluxDataType: 'string',
            type: 'string',
            data: ['1', '1', '1', '1', '1'],
          },
          'com.docker.compose.oneoff': {
            name: 'com.docker.compose.oneoff',
            fluxDataType: 'string',
            type: 'string',
            data: ['False', 'False', 'False', 'False', 'False'],
          },
          'com.docker.compose.project': {
            name: 'com.docker.compose.project',
            fluxDataType: 'string',
            type: 'string',
            data: ['influx', 'influx', 'influx', 'influx', 'influx'],
          },
          'com.docker.compose.project.config_files': {
            name: 'com.docker.compose.project.config_files',
            fluxDataType: 'string',
            type: 'string',
            data: [
              'compose/fig.cloud.yml,compose/fig.chronograf.yml,compose/fig.local.yml',
              'compose/fig.cloud.yml,compose/fig.chronograf.yml,compose/fig.local.yml',
              'compose/fig.cloud.yml,compose/fig.chronograf.yml,compose/fig.local.yml',
              'compose/fig.cloud.yml,compose/fig.chronograf.yml,compose/fig.local.yml',
              'compose/fig.cloud.yml,compose/fig.chronograf.yml,compose/fig.local.yml',
            ],
          },
          'com.docker.compose.project.working_dir': {
            name: 'com.docker.compose.project.working_dir',
            fluxDataType: 'string',
            type: 'string',
            data: [
              '/Users/asalem/go/src/github.com/monitor-ci/compose',
              '/Users/asalem/go/src/github.com/monitor-ci/compose',
              '/Users/asalem/go/src/github.com/monitor-ci/compose',
              '/Users/asalem/go/src/github.com/monitor-ci/compose',
              '/Users/asalem/go/src/github.com/monitor-ci/compose',
            ],
          },
          'com.docker.compose.service': {
            name: 'com.docker.compose.service',
            fluxDataType: 'string',
            type: 'string',
            data: ['telegraf', 'telegraf', 'telegraf', 'telegraf', 'telegraf'],
          },
          'com.docker.compose.version': {
            name: 'com.docker.compose.version',
            fluxDataType: 'string',
            type: 'string',
            data: ['1.25.4', '1.25.4', '1.25.4', '1.25.4', '1.25.4'],
          },
          container_image: {
            name: 'container_image',
            fluxDataType: 'string',
            type: 'string',
            data: [
              'influx_telegraf',
              'influx_telegraf',
              'influx_telegraf',
              'influx_telegraf',
              'influx_telegraf',
            ],
          },
          container_name: {
            name: 'container_name',
            fluxDataType: 'string',
            type: 'string',
            data: [
              'influx_telegraf_1',
              'influx_telegraf_1',
              'influx_telegraf_1',
              'influx_telegraf_1',
              'influx_telegraf_1',
            ],
          },
          container_status: {
            name: 'container_status',
            fluxDataType: 'string',
            type: 'string',
            data: ['running', 'running', 'running', 'running', 'running'],
          },
          container_version: {
            name: 'container_version',
            fluxDataType: 'string',
            type: 'string',
            data: ['unknown', 'unknown', 'unknown', 'unknown', 'unknown'],
          },
          engine_host: {
            name: 'engine_host',
            fluxDataType: 'string',
            type: 'string',
            data: [
              'docker-desktop',
              'docker-desktop',
              'docker-desktop',
              'docker-desktop',
              'docker-desktop',
            ],
          },
          host: {
            name: 'host',
            fluxDataType: 'string',
            type: 'string',
            data: [
              '5551e9bfb3bd',
              '5551e9bfb3bd',
              '5551e9bfb3bd',
              '5551e9bfb3bd',
              '5551e9bfb3bd',
            ],
          },
          network: {
            name: 'network',
            fluxDataType: 'string',
            type: 'string',
            data: ['eth0', undefined, undefined, 'eth0', 'eth0'],
          },
          server_version: {
            name: 'server_version',
            fluxDataType: 'string',
            type: 'string',
            data: ['19.03.8', '19.03.8', '19.03.8', '19.03.8', '19.03.8'],
          },
          cpu: {
            name: 'cpu',
            fluxDataType: 'string',
            type: 'string',
            data: [undefined, 'cpu11', 'cpu11', undefined, undefined],
          },
        },
      },
      fluxGroupKeyUnion: [
        '_start',
        '_stop',
        '_field',
        '_measurement',
        'com.docker.compose.config-hash',
        'com.docker.compose.container-number',
        'com.docker.compose.oneoff',
        'com.docker.compose.project',
        'com.docker.compose.project.config_files',
        'com.docker.compose.project.working_dir',
        'com.docker.compose.service',
        'com.docker.compose.version',
        'container_image',
        'container_name',
        'container_status',
        'container_version',
        'engine_host',
        'host',
        'network',
        'server_version',
        'cpu',
      ],
      resultColumnNames: ['_result'],
    }
    const fFlux = fastFromFlux(resp)
    expect(fFlux).toEqual(expected)
  })
  it('should be able to handle multiple tables with different values and results and |r returned CSV', () => {
    const resp = `#group,false,false,true,true,false,false,true,true,true,true,true,true\r
#datatype,string,long,dateTime:RFC3339,dateTime:RFC3339,dateTime:RFC3339,double,string,string,string,string,string,string\r
#default,_result,,,,,,,,,,,\r
,result,table,_start,_stop,_time,_value,_field,_measurement,code,crypto,description,symbol\r
,,0,2022-06-28T13:22:34.9161857Z,2022-06-29T13:22:34.9161857Z,2022-06-29T12:48:00Z,19058.5865,price,coindesk,EUR,bitcoin,Euro,&euro;\r
\r
#group,false,false,true,true,false,false,true,true,true\r
#datatype,string,long,dateTime:RFC3339,dateTime:RFC3339,dateTime:RFC3339,double,string,string,string\r
#default,_result,,,,,,,,\r
,result,table,_start,_stop,_time,_value,_field,_measurement,location\r
,,1,2022-06-28T13:22:34.9161857Z,2022-06-29T13:22:34.9161857Z,2022-06-29T00:59:24.885285715Z,89,degrees,average_temperature,coyote_creek\r
\r
#group,false,false,true,true,false,false,true,true,true,true\r
#datatype,string,long,dateTime:RFC3339,dateTime:RFC3339,dateTime:RFC3339,double,string,string,string,string\r
#default,_result,,,,,,,,,\r
,result,table,_start,_stop,_time,_value,_field,_measurement,location,randtag\r
,,2,2022-06-28T13:22:34.9161857Z,2022-06-29T13:22:34.9161857Z,2022-06-29T06:17:24.885285715Z,100,index,h2o_quality,santa_monica,3\r
\r
#group,false,false,true,true,false,false,true,true,true\r
#datatype,string,long,dateTime:RFC3339,dateTime:RFC3339,dateTime:RFC3339,double,string,string,string\r
#default,_result,,,,,,,,\r
,result,table,_start,_stop,_time,_value,_field,_measurement,sensor_id\r
,,3,2022-06-28T13:22:34.9161857Z,2022-06-29T13:22:34.9161857Z,2022-06-29T12:49:32Z,71.07602188197231,temperature,airSensors,TLM0103\r
\r
#group,false,false,true,true,false,false,true,true,true,true,true,true,true\r
#datatype,string,long,dateTime:RFC3339,dateTime:RFC3339,dateTime:RFC3339,string,string,string,string,string,string,string,string\r
#default,_result,,,,,,,,,,,,\r
,result,table,_start,_stop,_time,_value,_field,_measurement,code,id,magType,net,title\r
,,4,2022-06-28T13:22:34.9161857Z,2022-06-29T13:22:34.9161857Z,2022-06-28T13:43:29.505Z,green,alert,earthquake,7000hkud,us7000hkud,mww,us,"M 5.4 - 44 km W of Hengchun, Taiwan"\r
\r
#group,false,false,true,true,false,false,true,true,true,true,true,true,true\r
#datatype,string,long,dateTime:RFC3339,dateTime:RFC3339,dateTime:RFC3339,double,string,string,string,string,string,string,string\r
#default,_result,,,,,,,,,,,,\r
,result,table,_start,_stop,_time,_value,_field,_measurement,code,id,magType,net,title\r
,,5,2022-06-28T13:22:34.9161857Z,2022-06-29T13:22:34.9161857Z,2022-06-28T15:09:54.052Z,3.1,cdi,earthquake,7000hkux,us7000hkux,mb,us,"M 4.6 - 107 km NNW of Te Anau, New Zealand"\r
`

    /* eslint-disable */
    const expected = {
      _field: {
        data: ['price', 'degrees', 'index', 'temperature', 'alert', 'cdi'],
        fluxDataType: 'string',
        name: '_field',
        type: 'string',
      },
      _measurement: {
        data: [
          'coindesk',
          'average_temperature',
          'h2o_quality',
          'airSensors',
          'earthquake',
          'earthquake',
        ],
        fluxDataType: 'string',
        name: '_measurement',
        type: 'string',
      },
      _start: {
        data: [
          1656422554916,
          1656422554916,
          1656422554916,
          1656422554916,
          1656422554916,
          1656422554916,
        ],
        fluxDataType: 'dateTime:RFC3339',
        name: '_start',
        type: 'time',
      },
      _stop: {
        data: [
          1656508954916,
          1656508954916,
          1656508954916,
          1656508954916,
          1656508954916,
          1656508954916,
        ],
        fluxDataType: 'dateTime:RFC3339',
        name: '_stop',
        type: 'time',
      },
      _time: {
        data: [
          1656506880000,
          1656464364885,
          1656483444885,
          1656506972000,
          1656423809505,
          1656428994052,
        ],
        fluxDataType: 'dateTime:RFC3339',
        name: '_time',
        type: 'time',
      },
      '_value (number)': {
        data: [19058.5865, 89, 100, 71.07602188197231, , 3.1],
        fluxDataType: 'double',
        name: '_value',
        type: 'number',
      },
      '_value (string)': {
        data: [, , , ,'green', ,],
        fluxDataType: 'string',
        name: '_value',
        type: 'string',
      },
      code: {
        data: ['EUR', , , , '7000hkud', '7000hkux'],
        fluxDataType: 'string',
        name: 'code',
        type: 'string',
      },
      crypto: {
        data: ['bitcoin', , , , , ,],
        fluxDataType: 'string',
        name: 'crypto',
        type: 'string',
      },
      description: {
        data: ['Euro', , , , , ,],
        fluxDataType: 'string',
        name: 'description',
        type: 'string',
      },
      id: {
        data: [, , , , 'us7000hkud', 'us7000hkux'],
        fluxDataType: 'string',
        name: 'id',
        type: 'string',
      },
      location: {
        data: [, 'coyote_creek', 'santa_monica', , , ,],
        fluxDataType: 'string',
        name: 'location',
        type: 'string',
      },
      magType: {
        data: [, , , , 'mww', 'mb'],
        fluxDataType: 'string',
        name: 'magType',
        type: 'string',
      },
      net: {
        data: [, , , , 'us', 'us'],
        fluxDataType: 'string',
        name: 'net',
        type: 'string',
      },
      randtag: {
        data: [, , '3', , , ,],
        fluxDataType: 'string',
        name: 'randtag',
        type: 'string',
      },
      result: {
        data: [
          '_result',
          '_result',
          '_result',
          '_result',
          '_result',
          '_result',
        ],
        fluxDataType: 'string',
        name: 'result',
        type: 'string',
      },
      sensor_id: {
        data: [, , , 'TLM0103', , ,],
        fluxDataType: 'string',
        name: 'sensor_id',
        type: 'string',
      },
      symbol: {
        data: ['&euro;', , , , , ,],
        fluxDataType: 'string',
        name: 'symbol',
        type: 'string',
      },
      table: {
        data: [0, 1, 2, 3, 4, 5],
        fluxDataType: 'long',
        name: 'table',
        type: 'number',
      },
      title: {
        data: [, , , ,'M 5.4 - 44 km W of Hengchun, Taiwan', 'M 4.6 - 107 km NNW of Te Anau, New Zealand'],
        fluxDataType: 'string',
        name: 'title',
        type: 'string',
      },
    }

    /* eslint-enable */
    const expectedGroupKeys = [
      '_start',
      '_stop',
      '_field',
      '_measurement',
      'code',
      'crypto',
      'description',
      'symbol',
      'location',
      'randtag',
      'sensor_id',
      'id',
      'magType',
      'net',
      'title',
    ]

    const parsed = fastFromFlux(resp)
    const columns: any = (parsed.table as any)?.columns
    const fluxGroupKeyUnion = parsed.fluxGroupKeyUnion
    expect(columns).toStrictEqual(expected)
    expect(fluxGroupKeyUnion).toStrictEqual(expectedGroupKeys)
  })
  it('parses query with newlines and hashtags', () => {
    const CSV = `#group,false,false,true,false
#datatype,string,long,long,string
#default,_result,,,
,result,table,_time_reverse,_value
,,0,-1652887800000000000,"Row 1
#newline #somehashTags https://a_link.com/giraffe"
,,0,-1652887811000000000,Row 2
,,0,-1652888700000000000,"Row 3: 👇👇👇 // emojis
,Mew line!"
,,0,-1652889550000000000,"Row 4:
New line 1!
New line 2!
multiple new lines!`
    const {table} = fastFromFlux(CSV)

    const expectedColumns = [
      `Row 1
#newline #somehashTags https://a_link.com/giraffe`,
      'Row 2',
      `Row 3: 👇👇👇 // emojis
,Mew line!`,
      `Row 4:
New line 1!
New line 2!
multiple new lines!`,
    ]

    expect(table.getColumn('_value')).toStrictEqual(expectedColumns)
  })

  it('can parse a Flux CSV with mismatched schemas', () => {
    const CSV = `#group,false,false,true,true,false,true,true,true,true,true
#datatype,string,long,dateTime:RFC3339,dateTime:RFC3339,dateTime:RFC3339,double,string,string,string,string
#default,_result,,,,,,,,,
,result,table,_start,_stop,_time,_value,_field,_measurement,cpu,host
,,0,2019-02-01T23:38:32.524234Z,2019-02-01T23:39:02.524234Z,2019-02-01T23:38:33Z,10,usage_guest,cpu,cpu-total,oox4k.local
,,1,2019-02-01T23:38:32.524234Z,2019-02-01T23:39:02.524234Z,2019-02-01T23:38:43Z,20,usage_guest,cpu,cpu-total,oox4k.local

#group,false,false,true,true,false,true,true,true,true,true
#datatype,string,long,dateTime:RFC3339,dateTime:RFC3339,dateTime:RFC3339,string,string,string,string,string
#default,_result,,,,,,,,,
,result,table,_start,_stop,_time,_value,_field,_measurement,cpu,host
,,2,2019-02-01T23:38:32.524234Z,2019-02-01T23:39:02.524234Z,2019-02-01T23:38:33Z,thirty,usage_guest,cpu,cpu0,oox4k.local
,,3,2019-02-01T23:38:32.524234Z,2019-02-01T23:39:02.524234Z,2019-02-01T23:38:43Z,fourty,usage_guest,cpu,cpu0,oox4k.local`

    const actual = fastFromFlux(CSV)

    expect(actual.resultColumnNames).toEqual(['_result'])

    expect(actual.table.getColumn('result', 'string')).toEqual([
      '_result',
      '_result',
      '_result',
      '_result',
    ])

    expect(actual.table.getColumn('_start', 'time')).toEqual([
      1549064312524,
      1549064312524,
      1549064312524,
      1549064312524,
    ])

    expect(actual.table.getColumn('_stop', 'time')).toEqual([
      1549064342524,
      1549064342524,
      1549064342524,
      1549064342524,
    ])

    expect(actual.table.getColumn('_time', 'time')).toEqual([
      1549064313000,
      1549064323000,
      1549064313000,
      1549064323000,
    ])

    expect(actual.table.getColumn('_value (number)', 'number')).toEqual([
      10,
      20,
      undefined,
      undefined,
    ])

    expect(actual.table.getColumn('_value (string)', 'string')).toEqual([
      undefined,
      undefined,
      'thirty',
      'fourty',
    ])

    expect(actual.table.getColumn('_field', 'string')).toEqual([
      'usage_guest',
      'usage_guest',
      'usage_guest',
      'usage_guest',
    ])

    expect(actual.table.getColumn('_measurement', 'string')).toEqual([
      'cpu',
      'cpu',
      'cpu',
      'cpu',
    ])

    expect(actual.table.getColumn('cpu', 'string')).toEqual([
      'cpu-total',
      'cpu-total',
      'cpu0',
      'cpu0',
    ])

    expect(actual.table.getColumn('host', 'string')).toEqual([
      'oox4k.local',
      'oox4k.local',
      'oox4k.local',
      'oox4k.local',
    ])

    expect(actual.table.getColumn('table', 'number')).toEqual([0, 1, 2, 3])

    expect(actual.table.getColumnName('_value (number)')).toEqual('_value')

    expect(actual.table.getColumnName('_value (string)')).toEqual('_value')

    expect(actual.fluxGroupKeyUnion).toEqual([
      '_value (number)',
      '_value (string)',
      '_start',
      '_stop',
      '_field',
      '_measurement',
      'cpu',
      'host',
    ])
  })

  it('should error out gracefully when an error is thrown in the fastFromFlux parser', () => {
    const CSV =
      '#group,false,false,true,true,false,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true'

    expect(() => {
      fastFromFlux(CSV)
    }).not.toThrow()
  })

  it('uses the default annotation to fill in empty values', () => {
    const CSV = `#group,false,false,true,true,true,true
#datatype,string,long,string,string,long,long
#default,_result,,,cpu,,6
,result,table,a,b,c,d
,,1,usage_guest,,4,
,,1,usage_guest,,5,`

    const actual = fastFromFlux(CSV).table

    expect(actual.getColumn('result')).toEqual(['_result', '_result'])
    expect(actual.getColumn('a')).toEqual(['usage_guest', 'usage_guest'])
    expect(actual.getColumn('b')).toEqual(['cpu', 'cpu'])
    expect(actual.getColumn('c')).toEqual([4, 5])
    expect(actual.getColumn('d')).toEqual([6, 6])
  })

  it('returns a group key union', () => {
    const CSV = `#group,true,false,false,true
#datatype,string,string,string,string
#default,,,,
,a,b,c,d
,,,,

#group,false,false,true,false
#datatype,string,string,string,string
#default,,,,
,a,b,c,d
,,,,`

    const {fluxGroupKeyUnion} = fastFromFlux(CSV)

    expect(fluxGroupKeyUnion).toEqual(['a', 'c', 'd'])
  })

  it('returns all result column names', () => {
    const CSV = `#group,true,false,false,true
#datatype,string,string,string,string
#default,strangeColumnA,,,
,result,b,c,d
,,0,0,0

#group,false,false,true,false
#datatype,string,string,string,string
#default,strangeColumnB,,,
,result,b,c,d
,,0,0,0`

    const {resultColumnNames} = fastFromFlux(CSV)

    expect(resultColumnNames).toEqual(['strangeColumnA', 'strangeColumnB'])
  })

  it('handles result column in unexpected column position', () => {
    const DEFAULT_CSV = `#group,true,false,false,true
#datatype,string,string,string,string
#default,,resultInUnexpectedPosA,,
,a,result,c,d
,0,,0,0

#group,false,false,true,false
#datatype,string,string,string,string
#default,,resultInUnexpectedPosB,,
,a,result,c,d
,0,,0,0`

    const defaultCSV = fastFromFlux(DEFAULT_CSV)

    expect(defaultCSV.resultColumnNames).toEqual([
      'resultInUnexpectedPosA',
      'resultInUnexpectedPosB',
    ])

    const ROWS_CSV = `#group,true,false,false,true
#datatype,string,string,string,string
#default,,,,
,a,result,c,d
,0,resultInUnexpectedPosA,0,0

#group,false,false,true,false
#datatype,string,string,string,string
#default,,,,
,a,result,c,d
,0,resultInUnexpectedPosB,0,0`

    const rowsCSV = fastFromFlux(ROWS_CSV)

    expect(rowsCSV.resultColumnNames).toEqual([
      'resultInUnexpectedPosA',
      'resultInUnexpectedPosB',
    ])
  })

  it('handles blank result column names and empty rows', () => {
    const BLANK_RESULT_COLUMN_CSV = `#group,true,false,false,true
#datatype,string,string,string,string
#default,,,,
,result,b,c,d
,,0,0,0

#group,false,false,true,false
#datatype,string,string,string,string
#default,,,,
,result,b,c,d
,,0,0,0`

    const blankResultColumn = fastFromFlux(BLANK_RESULT_COLUMN_CSV)

    expect(blankResultColumn.resultColumnNames).toEqual([])

    const EMPTY_ROWS_CSV = `#group,true,false,false,true
#datatype,string,string,string,string
#default,strangeColumnA,,,
,result,b,c,d

#group,false,false,true,false
#datatype,string,string,string,string
#default,strangeColumnB,,,
,result,b,c,d`

    const emptyRows = fastFromFlux(EMPTY_ROWS_CSV)

    expect(emptyRows.resultColumnNames).toEqual([])
  })

  it('handles missing result column', () => {
    const NO_RESULT_CSV = `#group,true,false,false,true
#datatype,string,string,string,string
#default,strangeColumnA,,,
,a,b,c,d
,,,,

#group,false,false,true,false
#datatype,string,string,string,string
#default,strangeColumnB,,,
,a,b,c,d
,,,,`

    const {resultColumnNames} = fastFromFlux(NO_RESULT_CSV)

    expect(resultColumnNames).toEqual([])
  })

  it('parses empty numeric values as null', () => {
    const CSV = `#group,false,false,true,true,false,true,true,true,true,true
#datatype,string,long,dateTime:RFC3339,dateTime:RFC3339,dateTime:RFC3339,double,string,string,string,string
#default,_result,,,,,,,,,
,result,table,_start,_stop,_time,_value,_field,_measurement,cpu,host
,,0,2019-02-01T23:38:32.524234Z,2019-02-01T23:39:02.524234Z,2019-02-01T23:38:33Z,10,usage_guest,cpu,cpu-total,oox4k.local
,,1,2019-02-01T23:38:32.524234Z,2019-02-01T23:39:02.524234Z,2019-02-01T23:38:43Z,,usage_guest,cpu,cpu-total,oox4k.local`

    const {table} = fastFromFlux(CSV)

    expect(table.getColumn('_value')).toEqual([10, null])
  })

  it('handles newlines inside string values', () => {
    const CSV = `#group,false,false,false,false
#datatype,string,long,string,long
#default,_result,,,
,result,table,message,value
,,0,howdy,5
,,0,"hello

there",5
,,0,hi,6

#group,false,false,false,false
#datatype,string,long,string,long
#default,_result,,,
,result,table,message,value
,,1,howdy,5
,,1,"hello

there",5
,,1,hi,6`

    const {table} = fastFromFlux(CSV)

    expect(table.getColumn('value')).toEqual([5, 5, 6, 5, 5, 6])

    expect(table.getColumn('message')).toEqual([
      'howdy',
      'hello\n\nthere',
      'hi',
      'howdy',
      'hello\n\nthere',
      'hi',
    ])
  })

  it('parses dateTime with a space before the value', () => {
    const CSV = `#group,false,false,true,true,false,false,true,true,true,true
#datatype,string,long,dateTime:RFC3339,dateTime:RFC3339,dateTime:RFC3339,double,string,string,string,string,dateTime:RFC3339
#default,last,,,,,,,,,,
,result,table,_start,_stop,_time,_value,_field,_measurement,host,station_id,time
,,0,2021-01-19T20:58:58.549310588Z,2021-01-21T20:58:58.549310588Z,2021-01-21T13:00:00Z,1,is_installed,baywheels,ip-192-168-1-6.ec2.internal,499, 2021-01-18T12:20:02.582Z,`

    const {table} = fastFromFlux(CSV)

    expect(table.getColumn('time')).toEqual([1610972402582])
  })

  it('parses dateTime with a space after the value', () => {
    const CSV = `#group,false,false,true,true,false,false,true,true,true,true
#datatype,string,long,dateTime:RFC3339,dateTime:RFC3339,dateTime:RFC3339,double,string,string,string,string,dateTime:RFC3339
#default,last,,,,,,,,,,
,result,table,_start,_stop,_time,_value,_field,_measurement,host,station_id,time
,,0,2021-01-19T20:58:58.549310588Z,2021-01-21T20:58:58.549310588Z,2021-01-21T13:00:00Z,1,is_installed,baywheels,ip-192-168-1-6.ec2.internal,499,2021-01-18T12:20:02.582Z ,`

    const {table} = fastFromFlux(CSV)

    expect(table.getColumn('time')).toEqual([1610972402582])
  })

  it('parses dateTime with a space before and after the value', () => {
    const CSV = `#group,false,false,true,true,false,false,true,true,true,true
#datatype,string,long,dateTime:RFC3339,dateTime:RFC3339,dateTime:RFC3339,double,string,string,string,string,dateTime:RFC3339
#default,last,,,,,,,,,,
,result,table,_start,_stop,_time,_value,_field,_measurement,host,station_id,time
,,0,2021-01-19T20:58:58.549310588Z,2021-01-21T20:58:58.549310588Z,2021-01-21T13:00:00Z,1,is_installed,baywheels,ip-192-168-1-6.ec2.internal,499, 2021-01-18T12:20:02.582Z ,`

    const {table} = fastFromFlux(CSV)

    expect(table.getColumn('time')).toEqual([1610972402582])
  })
  it('should parse JSON data as part of the table body correctly', () => {
    const CSV = `#group,false,false,true,true,false,false,true,true,true,true,true,true,true,true,true,true
#datatype,string,long,dateTime:RFC3339,dateTime:RFC3339,dateTime:RFC3339,string,string,string,string,string,string,string,string,string,string,string
#default,_result,,,,,,,,,,,,,,,
,result,table,_start,_stop,_time,_value,_field,_measurement,env,error,errorCode,errorType,orgID,ot_trace_sampled,role,source
,,0,2022-06-15T19:05:02.361293138Z,2022-06-15T20:05:02.361293138Z,2022-06-15T19:05:05.145623698Z,"{""request"":{""organization_id"":""fc0e1bf81e62ea27"",""jwttoken"":""REDACTED"",""compiler"":{""Now"":""2022-06-15T19:05:00Z"",""query"":""import ""influxdata/influxdb/monitor""\nimport ""experimental""\nimport ""influxdata/influxdb/v1""\n\ndata = from(bucket: ""Website Monitoring Bucket"")\n    |\u003e range(start: -10m)\n    |\u003e filter(fn: (r) =\u003e r[""_measurement""] == ""http_response"")\n    |\u003e filter(fn: (r) =\u003e r[""_field""] == ""result_code"")\n    |\u003e filter(fn: (r) =\u003e r[""method""] == ""HEAD"")\n    |\u003e filter(fn: (r) =\u003e r[""result""] == ""success"")\n    |\u003e filter(fn: (r) =\u003e r[""server""] == ""https://influxdata.com"")\n\noption task = {name: ""Name this Check"", every: 1m, offset: 0s}\n\ncheck = {_check_id: ""0854d93f9225d000"", _check_name: ""Name this Check"", _type: ""deadman"", tags: {}}\ncrit = (r) =\u003e r[""dead""]\nmessageFn = (r) =\u003e ""Check: $\{r._check_name} is: $\{r._level}""\n\ndata |\u003e v1[""fieldsAsCols""]() |\u003e monitor[""deadman""](t: experimental[""subDuration""](from: now(), d: 90s))\n    |\u003e monitor[""check""](data: check, messageFn: messageFn, crit: crit)""},""source"":""tasks"",""parameters"":null,""UseIOx"":false,""compiler_type"":""flux""},""dialect"":{},""dialect_type"":""no-content""}",request,query_log,prod01-eu-central-1,"failed to initialize execute state: could not find bucket ""Website Monitoring Bucket""",not found,user,fc0e1bf81e62ea27,false,queryd-pull-internal,tasks\
`

    const {table} = fastFromFlux(CSV)

    const valueColumn = table.getColumn('_value')

    const expectedValueColumn = [
      '{"request":{"organization_id":"fc0e1bf81e62ea27","jwttoken":"REDACTED","compiler":{"Now":"2022-06-15T19:05:00Z","query":"import "influxdata/influxdb/monitor"\n' +
        'import "experimental"\n' +
        'import "influxdata/influxdb/v1"\n' +
        '\n' +
        'data = from(bucket: "Website Monitoring Bucket")\n' +
        '    |> range(start: -10m)\n' +
        '    |> filter(fn: (r) => r["_measurement"] == "http_response")\n' +
        '    |> filter(fn: (r) => r["_field"] == "result_code")\n' +
        '    |> filter(fn: (r) => r["method"] == "HEAD")\n' +
        '    |> filter(fn: (r) => r["result"] == "success")\n' +
        '    |> filter(fn: (r) => r["server"] == "https://influxdata.com")\n' +
        '\n' +
        'option task = {name: "Name this Check", every: 1m, offset: 0s}\n' +
        '\n' +
        'check = {_check_id: "0854d93f9225d000", _check_name: "Name this Check", _type: "deadman", tags: {}}\n' +
        'crit = (r) => r["dead"]\n' +
        'messageFn = (r) => "Check: ${r._check_name} is: ${r._level}"\n' +
        '\n' +
        'data |> v1["fieldsAsCols"]() |> monitor["deadman"](t: experimental["subDuration"](from: now(), d: 90s))\n' +
        '    |> monitor["check"](data: check, messageFn: messageFn, crit: crit)"},"source":"tasks","parameters":null,"UseIOx":false,"compiler_type":"flux"},"dialect":{},"dialect_type":"no-content"}',
    ]

    expect(valueColumn).toEqual(expectedValueColumn)
  })
})
