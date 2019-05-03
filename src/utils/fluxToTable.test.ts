import {fluxToTable} from './fluxToTable'

describe('fluxToTable', () => {
  test('can parse a Flux CSV with mismatched schemas', () => {
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

    const actual = fluxToTable(CSV)

    const expected = {
      table: {
        columns: {
          result: {
            name: 'result',
            type: 'string',
            data: ['_result', '_result', '_result', '_result'],
          },
          _start: {
            name: '_start',
            type: 'time',
            data: [1549064312524, 1549064312524, 1549064312524, 1549064312524],
          },
          _stop: {
            name: '_stop',
            type: 'time',
            data: [1549064342524, 1549064342524, 1549064342524, 1549064342524],
          },
          _time: {
            name: '_time',
            type: 'time',
            data: [1549064313000, 1549064323000, 1549064313000, 1549064323000],
          },
          '_value (number)': {
            type: 'number',
            name: '_value',
            data: [10, 20],
          },
          '_value (string)': {
            type: 'string',
            name: '_value',
            data: [undefined, undefined, 'thirty', 'fourty'],
          },
          _field: {
            name: '_field',
            type: 'string',
            data: ['usage_guest', 'usage_guest', 'usage_guest', 'usage_guest'],
          },
          _measurement: {
            name: '_measurement',
            type: 'string',
            data: ['cpu', 'cpu', 'cpu', 'cpu'],
          },
          cpu: {
            name: 'cpu',
            type: 'string',
            data: ['cpu-total', 'cpu-total', 'cpu0', 'cpu0'],
          },
          host: {
            name: 'host',
            type: 'string',
            data: ['oox4k.local', 'oox4k.local', 'oox4k.local', 'oox4k.local'],
          },
          table: {
            name: 'table',
            type: 'number',
            data: [0, 1, 2, 3],
          },
        },
        length: 4,
      },
      fluxGroupKeyUnion: new Set([
        '_start',
        '_stop',
        '_field',
        '_measurement',
        'cpu',
        'host',
        '_value (number)',
        '_value (string)',
      ]),
    }

    expect(actual).toEqual(expected)
  })

  test('uses the default annotation to fill in empty values', () => {
    const CSV = `#group,false,false,true,true,true,true
#datatype,string,long,string,string,long,long
#default,_result,,,cpu,,6
,result,table,a,b,c,d
,,1,usage_guest,,4,
,,1,usage_guest,,5,`

    const actual = fluxToTable(CSV)

    expect(actual.table.columns.result.data).toEqual(['_result', '_result'])
    expect(actual.table.columns.a.data).toEqual(['usage_guest', 'usage_guest'])
    expect(actual.table.columns.b.data).toEqual(['cpu', 'cpu'])
    expect(actual.table.columns.c.data).toEqual([4, 5])
    expect(actual.table.columns.d.data).toEqual([6, 6])
  })

  test('returns a group key union', () => {
    const CSV = `#group,true,false,false,true
#datatype,string,string,string,string
#default,,,,
,a,b,c,d

#group,false,false,true,false
#datatype,string,string,string,string
#default,,,,
,a,b,c,d`

    const {fluxGroupKeyUnion} = fluxToTable(CSV)

    expect(fluxGroupKeyUnion).toEqual(new Set(['a', 'c', 'd']))
  })
})
