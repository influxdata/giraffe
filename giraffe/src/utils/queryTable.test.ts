import {queryTable} from './queryTable'
// @influxdata/influxdb-client uses node transport in tests (tests run in node), therefore nock is used to mock HTTP
import nock from 'nock'
import {InfluxDB} from '@influxdata/influxdb-client'

const url = 'http://test'
const queryApi = new InfluxDB({url}).getQueryApi('whatever')

describe('queryTable', () => {
  beforeEach(() => {
    nock.disableNetConnect()
  })
  afterEach(() => {
    nock.cleanAll()
    nock.enableNetConnect()
  })
  it('can parse a Flux CSV with mismatched schemas', async () => {
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

    nock(url)
      .post(/.*/)
      .reply(200, CSV)
    const table = await queryTable(queryApi, 'ignored')

    expect(table.getColumn('result', 'string')).toEqual([
      '_result',
      '_result',
      '_result',
      '_result',
    ])

    expect(table.getColumn('_start', 'time')).toEqual([
      1549064312524,
      1549064312524,
      1549064312524,
      1549064312524,
    ])

    expect(table.getColumn('_stop', 'time')).toEqual([
      1549064342524,
      1549064342524,
      1549064342524,
      1549064342524,
    ])

    expect(table.getColumn('_time', 'time')).toEqual([
      1549064313000,
      1549064323000,
      1549064313000,
      1549064323000,
    ])

    expect(table.getColumn('_value (number)', 'number')).toEqual([
      10,
      20,
      undefined,
      undefined,
    ])

    expect(table.getColumn('_value (string)', 'string')).toEqual([
      undefined,
      undefined,
      'thirty',
      'fourty',
    ])

    expect(table.getColumn('_field', 'string')).toEqual([
      'usage_guest',
      'usage_guest',
      'usage_guest',
      'usage_guest',
    ])

    expect(table.getColumn('_measurement', 'string')).toEqual([
      'cpu',
      'cpu',
      'cpu',
      'cpu',
    ])

    expect(table.getColumn('cpu', 'string')).toEqual([
      'cpu-total',
      'cpu-total',
      'cpu0',
      'cpu0',
    ])

    expect(table.getColumn('host', 'string')).toEqual([
      'oox4k.local',
      'oox4k.local',
      'oox4k.local',
      'oox4k.local',
    ])

    expect(table.getColumn('table', 'number')).toEqual([0, 1, 2, 3])

    expect(table.getColumnName('_value (number)')).toEqual('_value')

    expect(table.getColumnName('_value (string)')).toEqual('_value')
  })

  it('uses the default annotation to fill in empty values', async () => {
    const CSV = `#group,false,false,true,true,true,true
#datatype,string,long,string,string,long,long
#default,_result,,,cpu,,6
,result,table,a,b,c,d
,,1,usage_guest,,4,
,,1,usage_guest,,5,`

    nock(url)
      .post(/.*/)
      .reply(200, CSV)
    const actual = await queryTable(queryApi, 'ignored')

    expect(actual.getColumn('result')).toEqual(['_result', '_result'])
    expect(actual.getColumn('a')).toEqual(['usage_guest', 'usage_guest'])
    expect(actual.getColumn('b')).toEqual(['cpu', 'cpu'])
    expect(actual.getColumn('c')).toEqual([4, 5])
    expect(actual.getColumn('d')).toEqual([6, 6])
  })

  it('parses empty numeric values as null', async () => {
    const CSV = `#group,false,false,true,true,false,true,true,true,true,true
#datatype,string,long,dateTime:RFC3339,dateTime:RFC3339,dateTime:RFC3339,double,string,string,string,string
#default,_result,,,,,,,,,
,result,table,_start,_stop,_time,_value,_field,_measurement,cpu,host
,,0,2019-02-01T23:38:32.524234Z,2019-02-01T23:39:02.524234Z,2019-02-01T23:38:33Z,10,usage_guest,cpu,cpu-total,oox4k.local
,,1,2019-02-01T23:38:32.524234Z,2019-02-01T23:39:02.524234Z,2019-02-01T23:38:43Z,,usage_guest,cpu,cpu-total,oox4k.local`

    nock(url)
      .post(/.*/)
      .reply(200, CSV)
    const table = await queryTable(queryApi, 'ignored')

    expect(table.getColumn('_value')).toEqual([10, null])
  })

  it('handles newlines inside string values', async () => {
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

    nock(url)
      .post(/.*/)
      .reply(200, CSV)
    const table = await queryTable(queryApi, 'ignored')

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
})
