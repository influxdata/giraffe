import {fromFlux} from './fromFlux'

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
    }
    const fFlux = fromFlux(resp)
    expect(fFlux).toEqual(expected)
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
      fromFlux(CSV)
    }).not.toThrow()
    const actual = fromFlux(CSV)
    expect(actual.error).toBeTruthy()
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

#group,false,false,true,false
#datatype,string,string,string,string
#default,,,,
,a,b,c,d`

    const {fluxGroupKeyUnion} = fromFlux(CSV)

    expect(fluxGroupKeyUnion).toEqual(['a', 'c', 'd'])
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
})
