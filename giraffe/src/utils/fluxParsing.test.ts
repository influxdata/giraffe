import {parseResponse} from './fluxParsing'

const RESPONSE_METADATA = `#datatype,string,long,dateTime:RFC3339,dateTime:RFC3339,dateTime:RFC3339,double,string,string,string,string
#group,false,false,false,false,false,false,true,true,true,true
#default,_result,,,,,,,,,
,result,table,_start,_stop,_time,_value,_field,_measurement,cpu,host
,,0,2018-05-23T17:42:29.536834648Z,2018-05-23T17:43:29.536834648Z,2018-05-23T17:42:29.654Z,0,usage_guest,cpu,cpu-total,WattsInfluxDB
`

const RESPONSE_NO_METADATA = `,result,table,_start,_stop,_time,_value,_field,_measurement,cpu,host
,,0,2018-05-23T17:42:29.536834648Z,2018-05-23T17:43:29.536834648Z,2018-05-23T17:42:29.654Z,0,usage_guest,cpu,cpu-total,WattsInfluxDB

`

const MULTI_SCHEMA_RESPONSE = `#datatype,string,long,dateTime:RFC3339,dateTime:RFC3339,dateTime:RFC3339,double,string,string,string,string
#group,false,false,false,false,false,false,true,true,true,true
#default,_result,,,,,,,,,
,result,table,_start,_stop,_time,_value,_field,_measurement,cpu,host
,,0,1677-09-21T00:12:43.145224192Z,2018-05-22T22:39:17.042276772Z,2018-05-22T22:39:12.584Z,0,usage_guest,cpu,cpu-total,WattsInfluxDB
,,1,1677-09-21T00:12:43.145224192Z,2018-05-22T22:39:17.042276772Z,2018-05-22T22:39:12.584Z,0,usage_guest_nice,cpu,cpu-total,WattsInfluxDB

#datatype,string,long,dateTime:RFC3339,dateTime:RFC3339,dateTime:RFC3339,long,string,string,string,string,string,string,string
#group,false,false,false,false,false,false,true,true,true,true,true,true,true
#default,_result,,,,,,,,,,,,
,result,table,_start,_stop,_time,_value,_field,_measurement,device,fstype,host,mode,path
,,2,1677-09-21T00:12:43.145224192Z,2018-05-22T22:39:17.042276772Z,2018-05-04T21:05:08.947Z,182180679680,free,disk,/Users/watts/Downloads/TablePlus.app,nullfs,WattsInfluxDB,ro,/private/var/folders/f4/zd7n1rqj7xj6w7c0njkmmjlh0000gn/T/AppTranslocation/F4D8D166-F848-4862-94F6-B51C00E2EB7A
,,3,1677-09-21T00:12:43.145224192Z,2018-05-22T22:39:17.042276772Z,2018-05-04T21:05:08.947Z,9223372036852008920,inodes_free,disk,/Users/watts/Downloads/TablePlus.app,nullfs,WattsInfluxDB,ro,/private/var/folders/f4/zd7n1rqj7xj6w7c0njkmmjlh0000gn/T/AppTranslocation/F4D8D166-F848-4862-94F6-B51C00E2EB7A


`

const EXPECTED_COLUMNS = [
  '',
  'result',
  'table',
  '_start',
  '_stop',
  '_time',
  '_value',
  '_field',
  '_measurement',
  'cpu',
  'host',
]

const TRUNCATED_RESPONSE = `
#datatype,string,long,dateTime:RFC3339,dateTime:RFC3339,dateTime:RFC3339,double,string,string,string,string
#group,false,false,false,false,false,false,true,true,true,true
#default,_result,,,,,,,,,
,result,table,_start,_stop,_time,_value,_field,_measurement,cpu,host
,,0,1677-09-21T00:12:43.145224192Z,2018-05-22T22:39:17.042276772Z,2018-05-22T22:39:12.584Z,0,usage_guest,cpu,cpu-total,WattsInfluxDB
,,1,1677-09-21T00:12:43.145224192Z,2018-05-22T22:39:17.042276772Z,2018-05-22T22:39:12.584Z,0,usage_guest_nice,cpu,cpu-total,WattsInfluxDB

#datatype,string,long,dateTime:RFC3339,dateTime:RFC3339,dateTime:RFC3339,long,string,string,string,string,string,string,string
#group,false,false,false,false,false,false,true,true,true,true,true,true,true
#default,_result,,,,,,,,,,,,
`

describe('parseResponse', () => {
  test('parseResponse into the right number of tables', () => {
    const result = parseResponse(MULTI_SCHEMA_RESPONSE)
    expect(result).toHaveLength(4)
  })

  describe('result name', () => {
    test('uses the result name from the result column if present', () => {
      const resp = `#group,false,false,false,false,false,false,true,true,true
#datatype,string,long,dateTime:RFC3339,dateTime:RFC3339,dateTime:RFC3339,long,string,string,string
#default,,,,,,,,,
,result,table,_start,_stop,_time,_value,_field,_measurement,host
,max,0,2018-12-10T18:21:52.748859Z,2018-12-10T18:30:00Z,2018-12-10T18:29:58Z,4906213376,active,mem,oox4k.local
,max,0,2018-12-10T18:30:00Z,2018-12-10T19:00:00Z,2018-12-10T18:54:08Z,5860683776,active,mem,oox4k.local
,max,0,2018-12-10T19:00:00Z,2018-12-10T19:21:52.748859Z,2018-12-10T19:11:58Z,5115428864,active,mem,oox4k.local

`

      const actual = parseResponse(resp)

      expect(actual[0].result).toBe('max')
    })

    test('uses the result name from the default annotation if result columns are empty', () => {
      const resp = `#group,false,false,false,false,false,false,true,true,true
#datatype,string,long,dateTime:RFC3339,dateTime:RFC3339,dateTime:RFC3339,long,string,string,string
#default,max,,,,,,,,
,result,table,_start,_stop,_time,_value,_field,_measurement,host
,,0,2018-12-10T18:21:52.748859Z,2018-12-10T18:30:00Z,2018-12-10T18:29:58Z,4906213376,active,mem,oox4k.local
,,0,2018-12-10T18:30:00Z,2018-12-10T19:00:00Z,2018-12-10T18:54:08Z,5860683776,active,mem,oox4k.local
,,0,2018-12-10T19:00:00Z,2018-12-10T19:21:52.748859Z,2018-12-10T19:11:58Z,5115428864,active,mem,oox4k.local

#group,false,false,false,false,false,false,true,true,true
#datatype,string,long,dateTime:RFC3339,dateTime:RFC3339,dateTime:RFC3339,long,string,string,string
#default,min,,,,,,,,
,result,table,_start,_stop,_time,_value,_field,_measurement,host
,,0,2018-12-10T18:21:52.748859Z,2018-12-10T18:30:00Z,2018-12-10T18:29:48Z,4589981696,active,mem,oox4k.local
,,0,2018-12-10T18:30:00Z,2018-12-10T19:00:00Z,2018-12-10T18:40:18Z,4318040064,active,mem,oox4k.local
,,0,2018-12-10T19:00:00Z,2018-12-10T19:21:52.748859Z,2018-12-10T19:13:58Z,4131692544,active,mem,oox4k.local


`
      const actual = parseResponse(resp)

      expect(actual).toHaveLength(2)
      expect(actual[0].result).toBe('max')
      expect(actual[1].result).toBe('min')
    })
  })

  describe('headers', () => {
    test('throws when no metadata is present', () => {
      expect(() => {
        parseResponse(RESPONSE_NO_METADATA)
      }).toThrow()
    })

    test('can parse headers when metadata is present', () => {
      const actual = parseResponse(RESPONSE_METADATA)[0].data[0]
      expect(actual).toEqual(EXPECTED_COLUMNS)
    })
  })

  describe('group key', () => {
    test('parses the group key properly', () => {
      const actual = parseResponse(MULTI_SCHEMA_RESPONSE)[0].groupKey
      const expected = {
        _field: 'usage_guest',
        _measurement: 'cpu',
        cpu: 'cpu-total',
        host: 'WattsInfluxDB',
      }
      expect(actual).toEqual(expected)
    })
  })

  describe('partial responses', () => {
    test('should discard tables without any non-annotation rows', () => {
      const actual = parseResponse(TRUNCATED_RESPONSE)

      expect(actual).toHaveLength(2)
    })
  })
})
