import {parseFiles} from './rawFluxDataTable'

describe('parseFiles', () => {
  test('can parse multi-csv response', () => {
    const CSV = `
#group,false,false,false,false
#datatype,string,long,string,long
#default,_result,,,
,result,table,message,value
,,0,howdy,5
,,0,hello there,5
,,0,hi,6

#group,false,false,false,false
#datatype,string,long,string,long
#default,_result,,,
,result,table,message,value
,,1,howdy,5
,,1,hello there,5
,,1,hi,6
`.trim()

    const expectedData = [
      ['#group', 'false', 'false', 'false', 'false'],
      ['#datatype', 'string', 'long', 'string', 'long'],
      ['#default', '_result', '', '', ''],
      ['', 'result', 'table', 'message', 'value'],
      ['', '', '0', 'howdy', '5'],
      ['', '', '0', 'hello there', '5'],
      ['', '', '0', 'hi', '6'],
      [],
      ['#group', 'false', 'false', 'false', 'false'],
      ['#datatype', 'string', 'long', 'string', 'long'],
      ['#default', '_result', '', '', ''],
      ['', 'result', 'table', 'message', 'value'],
      ['', '', '1', 'howdy', '5'],
      ['', '', '1', 'hello there', '5'],
      ['', '', '1', 'hi', '6'],
    ]

    const expected = {
      data: expectedData,
      maxColumnCount: 5,
    }

    expect(parseFiles([CSV])).toEqual(expected)
  })

  test('can parse multi-csv response with values containing newlines', () => {
    const CSV = `
#group,false,false,false,false
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
,,1,hi,6
`.trim()

    const expectedData = [
      ['#group', 'false', 'false', 'false', 'false'],
      ['#datatype', 'string', 'long', 'string', 'long'],
      ['#default', '_result', '', '', ''],
      ['', 'result', 'table', 'message', 'value'],
      ['', '', '0', 'howdy', '5'],
      ['', '', '0', 'hello\n\nthere', '5'],
      ['', '', '0', 'hi', '6'],
      [],
      ['#group', 'false', 'false', 'false', 'false'],
      ['#datatype', 'string', 'long', 'string', 'long'],
      ['#default', '_result', '', '', ''],
      ['', 'result', 'table', 'message', 'value'],
      ['', '', '1', 'howdy', '5'],
      ['', '', '1', 'hello\n\nthere', '5'],
      ['', '', '1', 'hi', '6'],
    ]

    const expected = {
      data: expectedData,
      maxColumnCount: 5,
    }

    expect(parseFiles([CSV])).toEqual(expected)
  })

  test('does not parse objects in CSV when flag is false', () => {
    const CSV = `#group,false,false,true,true,false,false,true,true,true,true,true,true,true,true,true,true,true
#datatype,string,long,dateTime:RFC3339,dateTime:RFC3339,dateTime:RFC3339,string,string,string,string,string,string,string,string,string,string,string,string
#default,_result,,,,,,,,,,,,,,,,
,result,table,_start,_stop,_time,_value,_field,_measurement,env,host,hostname,nodename,orgID,ot_trace_sampled,query-role,role,source
,,0,2020-06-03T03:17:00Z,2020-06-03T03:18:00Z,2020-06-03T03:17:00.235373882Z,"{""request"":""howdy"",""error"":""something is wrong""}",request,query_log,stag01-us-east-4,queryd-v1-6c46d687dc-2t5r5,queryd-v1-6c46d687dc-2t5r5,gke-stag01-us-east-4-highmem-preempti-6beb3a50-nsb6,342e059bf55331f9,false,unknown,queryd-v1,tasks`

    const expectedData = [
      [
        '#group',
        'false',
        'false',
        'true',
        'true',
        'false',
        'false',
        'true',
        'true',
        'true',
        'true',
        'true',
        'true',
        'true',
        'true',
        'true',
        'true',
        'true',
      ],
      [
        '#datatype',
        'string',
        'long',
        'dateTime:RFC3339',
        'dateTime:RFC3339',
        'dateTime:RFC3339',
        'string',
        'string',
        'string',
        'string',
        'string',
        'string',
        'string',
        'string',
        'string',
        'string',
        'string',
        'string',
      ],
      [
        '#default',
        '_result',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
      ],
      [
        '',
        'result',
        'table',
        '_start',
        '_stop',
        '_time',
        '_value',
        '_field',
        '_measurement',
        'env',
        'host',
        'hostname',
        'nodename',
        'orgID',
        'ot_trace_sampled',
        'query-role',
        'role',
        'source',
      ],
      [
        '',
        '',
        '0',
        '2020-06-03T03:17:00Z',
        '2020-06-03T03:18:00Z',
        '2020-06-03T03:17:00.235373882Z',
        '{"request":"howdy","error":"something is wrong"}',
        'request',
        'query_log',
        'stag01-us-east-4',
        'queryd-v1-6c46d687dc-2t5r5',
        'queryd-v1-6c46d687dc-2t5r5',
        'gke-stag01-us-east-4-highmem-preempti-6beb3a50-nsb6',
        '342e059bf55331f9',
        'false',
        'unknown',
        'queryd-v1',
        'tasks',
      ],
    ]

    const expected = {
      data: expectedData,
      maxColumnCount: 18,
    }

    expect(parseFiles([CSV], false)).toEqual(expected)
  })

  test('can parse objects in CSV when flag is true', () => {
    const CSV = `#group,false,false,true,true,false,false,true,true,true,true,true,true,true,true,true,true,true
#datatype,string,long,dateTime:RFC3339,dateTime:RFC3339,dateTime:RFC3339,string,string,string,string,string,string,string,string,string,string,string,string
#default,_result,,,,,,,,,,,,,,,,
,result,table,_start,_stop,_time,_value,_field,_measurement,env,host,hostname,nodename,orgID,ot_trace_sampled,query-role,role,source
,,0,2020-06-03T03:17:00Z,2020-06-03T03:18:00Z,2020-06-03T03:17:00.235373882Z,"{""request"":""howdy"",""error"":""something is wrong""}",request,query_log,stag01-us-east-4,queryd-v1-6c46d687dc-2t5r5,queryd-v1-6c46d687dc-2t5r5,gke-stag01-us-east-4-highmem-preempti-6beb3a50-nsb6,342e059bf55331f9,false,unknown,queryd-v1,tasks`

    const expectedData = [
      [
        '#group',
        'false',
        'false',
        'true',
        'true',
        'false',
        'false',
        'true',
        'true',
        'true',
        'true',
        'true',
        'true',
        'true',
        'true',
        'true',
        'true',
        'true',
      ],
      [
        '#datatype',
        'string',
        'long',
        'dateTime:RFC3339',
        'dateTime:RFC3339',
        'dateTime:RFC3339',
        'string',
        'string',
        'string',
        'string',
        'string',
        'string',
        'string',
        'string',
        'string',
        'string',
        'string',
        'string',
      ],
      [
        '#default',
        '_result',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
      ],
      [
        '',
        'result',
        'table',
        '_start',
        '_stop',
        '_time',
        '_value',
        '_field',
        '_measurement',
        'env',
        'host',
        'hostname',
        'nodename',
        'orgID',
        'ot_trace_sampled',
        'query-role',
        'role',
        'source',
      ],
      [
        '',
        '',
        '0',
        '2020-06-03T03:17:00Z',
        '2020-06-03T03:18:00Z',
        '2020-06-03T03:17:00.235373882Z',
        '{"request":"howdy","error":"something is wrong"}',
        'request',
        'query_log',
        'stag01-us-east-4',
        'queryd-v1-6c46d687dc-2t5r5',
        'queryd-v1-6c46d687dc-2t5r5',
        'gke-stag01-us-east-4-highmem-preempti-6beb3a50-nsb6',
        '342e059bf55331f9',
        'false',
        'unknown',
        'queryd-v1',
        'tasks',
      ],
    ]

    const expected = {
      data: expectedData,
      maxColumnCount: 18,
    }

    const result = parseFiles([CSV], true)
    expect(result).toEqual(expected)

    expect(() => {
      JSON.parse(result.data[4][6])
    }).not.toThrow()
  })

  test('can parse nested objects in CSV when flag is true', () => {
    const CSV = `#group,false,false,true,true,false,false,true,true,true,true,true,true,true,true,true,true,true
#datatype,string,long,dateTime:RFC3339,dateTime:RFC3339,dateTime:RFC3339,string,string,string,string,string,string,string,string,string,string,string,string
#default,_result,,,,,,,,,,,,,,,,
,result,table,_start,_stop,_time,_value,_field,_measurement,env,host,hostname,nodename,orgID,ot_trace_sampled,query-role,role,source
,,0,2020-06-03T03:17:00Z,2020-06-03T03:18:00Z,2020-06-03T03:17:00.235373882Z,"{""request"":{""nested"":""property""},""error"":""file not found""}",request,query_log,stag01-us-east-4,queryd-v1-6c46d687dc-2t5r5,queryd-v1-6c46d687dc-2t5r5,gke-stag01-us-east-4-highmem-preempti-6beb3a50-nsb6,342e059bf55331f9,false,unknown,queryd-v1,tasks`

    const expectedData = [
      [
        '#group',
        'false',
        'false',
        'true',
        'true',
        'false',
        'false',
        'true',
        'true',
        'true',
        'true',
        'true',
        'true',
        'true',
        'true',
        'true',
        'true',
        'true',
      ],
      [
        '#datatype',
        'string',
        'long',
        'dateTime:RFC3339',
        'dateTime:RFC3339',
        'dateTime:RFC3339',
        'string',
        'string',
        'string',
        'string',
        'string',
        'string',
        'string',
        'string',
        'string',
        'string',
        'string',
        'string',
      ],
      [
        '#default',
        '_result',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
      ],
      [
        '',
        'result',
        'table',
        '_start',
        '_stop',
        '_time',
        '_value',
        '_field',
        '_measurement',
        'env',
        'host',
        'hostname',
        'nodename',
        'orgID',
        'ot_trace_sampled',
        'query-role',
        'role',
        'source',
      ],
      [
        '',
        '',
        '0',
        '2020-06-03T03:17:00Z',
        '2020-06-03T03:18:00Z',
        '2020-06-03T03:17:00.235373882Z',
        '{"request":{"nested":"property"},"error":"file not found"}',
        'request',
        'query_log',
        'stag01-us-east-4',
        'queryd-v1-6c46d687dc-2t5r5',
        'queryd-v1-6c46d687dc-2t5r5',
        'gke-stag01-us-east-4-highmem-preempti-6beb3a50-nsb6',
        '342e059bf55331f9',
        'false',
        'unknown',
        'queryd-v1',
        'tasks',
      ],
    ]

    const expected = {
      data: expectedData,
      maxColumnCount: 18,
    }

    const result = parseFiles([CSV], true)
    expect(result).toEqual(expected)

    expect(() => {
      JSON.parse(result.data[4][6])
    }).not.toThrow()
  })

  test('can parse objects in multi-csv response when flag is true', () => {
    const CSV = `#group,false,false,true,true,false,false,true,true,true,true,true,true,true,true,true,true,true
#datatype,string,long,dateTime:RFC3339,dateTime:RFC3339,dateTime:RFC3339,string,string,string,string,string,string,string,string,string,string,string,string
#default,_result,,,,,,,,,,,,,,,,
,result,table,_start,_stop,_time,_value,_field,_measurement,env,host,hostname,nodename,orgID,ot_trace_sampled,query-role,role,source
,,0,2020-06-03T03:17:00Z,2020-06-03T03:18:00Z,2020-06-03T03:17:00.235373882Z,"{""request"":""howdy"",""error"":""something is wrong""}",request,query_log,stag01-us-east-4,queryd-v1-6c46d687dc-2t5r5,queryd-v1-6c46d687dc-2t5r5,gke-stag01-us-east-4-highmem-preempti-6beb3a50-nsb6,342e059bf55331f9,false,unknown,queryd-v1,tasks

#group,false,false,true,true,false,false,true,true,true,true,true,true,true,true,true,true,true
#datatype,string,long,dateTime:RFC3339,dateTime:RFC3339,dateTime:RFC3339,string,string,string,string,string,string,string,string,string,string,string,string
#default,_result,,,,,,,,,,,,,,,,
,result,table,_start,_stop,_time,_value,_field,_measurement,env,host,hostname,nodename,orgID,ot_trace_sampled,query-role,role,source
,,0,2020-06-03T03:17:00Z,2020-06-03T03:18:00Z,2020-06-03T03:17:00.235373882Z,"{""request0"":""yo"",""error"":""something is seriously wrong""}",request,query_log,stag01-us-east-4,queryd-v1-6c46d687dc-2t5r5,queryd-v1-6c46d687dc-2t5r5,gke-stag01-us-east-4-highmem-preempti-6beb3a50-nsb6,342e059bf55331f9,false,unknown,queryd-v1,tasks
,,0,2020-06-03T03:17:00Z,2020-06-03T03:18:00Z,2020-06-03T03:17:00.235373882Z,"{""request1"":""hi"",""error"":""oops, another error""}",request,query_log,stag01-us-east-4,queryd-v1-6c46d687dc-2t5r5,queryd-v1-6c46d687dc-2t5r5,gke-stag01-us-east-4-highmem-preempti-6beb3a50-nsb6,342e059bf55331f9,false,unknown,queryd-v1,tasks

#group,false,false,true,true,false,false,true,true,true,true,true,true,true,true,true,true,true
#datatype,string,long,dateTime:RFC3339,dateTime:RFC3339,dateTime:RFC3339,string,string,string,string,string,string,string,string,string,string,string,string
#default,_result,,,,,,,,,,,,,,,,
,result,table,_start,_stop,_time,_value,_field,_measurement,env,host,hostname,nodename,orgID,ot_trace_sampled,query-role,role,source
,,0,2020-06-03T03:17:00Z,2020-06-03T03:18:00Z,2020-06-03T03:17:00.235373882Z,"{""request"":""greetings"",""error"":""file not found""}",request,query_log,stag01-us-east-4,queryd-v1-6c46d687dc-2t5r5,queryd-v1-6c46d687dc-2t5r5,gke-stag01-us-east-4-highmem-preempti-6beb3a50-nsb6,342e059bf55331f9,false,unknown,queryd-v1,tasks

#group,false,false,true,true,false,false,true,true,true,true,true,true,true,true,true,true,true
#datatype,string,long,dateTime:RFC3339,dateTime:RFC3339,dateTime:RFC3339,string,string,string,string,string,string,string,string,string,string,string,string
#default,_result,,,,,,,,,,,,,,,,
,result,table,_start,_stop,_time,_value,_field,_measurement,env,host,hostname,nodename,orgID,ot_trace_sampled,query-role,role,source
,,0,2020-06-03T03:17:00Z,2020-06-03T03:18:00Z,2020-06-03T03:17:00.235373882Z,"{""request99"":""hello"",""error"":""my name is bob""}",request,query_log,stag01-us-east-4,queryd-v1-6c46d687dc-2t5r5,queryd-v1-6c46d687dc-2t5r5,gke-stag01-us-east-4-highmem-preempti-6beb3a50-nsb6,342e059bf55331f9,false,unknown,queryd-v1,tasks`

    const expectedData = [
      [
        '#group',
        'false',
        'false',
        'true',
        'true',
        'false',
        'false',
        'true',
        'true',
        'true',
        'true',
        'true',
        'true',
        'true',
        'true',
        'true',
        'true',
        'true',
      ],
      [
        '#datatype',
        'string',
        'long',
        'dateTime:RFC3339',
        'dateTime:RFC3339',
        'dateTime:RFC3339',
        'string',
        'string',
        'string',
        'string',
        'string',
        'string',
        'string',
        'string',
        'string',
        'string',
        'string',
        'string',
      ],
      [
        '#default',
        '_result',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
      ],
      [
        '',
        'result',
        'table',
        '_start',
        '_stop',
        '_time',
        '_value',
        '_field',
        '_measurement',
        'env',
        'host',
        'hostname',
        'nodename',
        'orgID',
        'ot_trace_sampled',
        'query-role',
        'role',
        'source',
      ],
      [
        '',
        '',
        '0',
        '2020-06-03T03:17:00Z',
        '2020-06-03T03:18:00Z',
        '2020-06-03T03:17:00.235373882Z',
        '{"request":"howdy","error":"something is wrong"}',
        'request',
        'query_log',
        'stag01-us-east-4',
        'queryd-v1-6c46d687dc-2t5r5',
        'queryd-v1-6c46d687dc-2t5r5',
        'gke-stag01-us-east-4-highmem-preempti-6beb3a50-nsb6',
        '342e059bf55331f9',
        'false',
        'unknown',
        'queryd-v1',
        'tasks',
      ],
      [],
      [
        '#group',
        'false',
        'false',
        'true',
        'true',
        'false',
        'false',
        'true',
        'true',
        'true',
        'true',
        'true',
        'true',
        'true',
        'true',
        'true',
        'true',
        'true',
      ],
      [
        '#datatype',
        'string',
        'long',
        'dateTime:RFC3339',
        'dateTime:RFC3339',
        'dateTime:RFC3339',
        'string',
        'string',
        'string',
        'string',
        'string',
        'string',
        'string',
        'string',
        'string',
        'string',
        'string',
        'string',
      ],
      [
        '#default',
        '_result',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
      ],
      [
        '',
        'result',
        'table',
        '_start',
        '_stop',
        '_time',
        '_value',
        '_field',
        '_measurement',
        'env',
        'host',
        'hostname',
        'nodename',
        'orgID',
        'ot_trace_sampled',
        'query-role',
        'role',
        'source',
      ],
      [
        '',
        '',
        '0',
        '2020-06-03T03:17:00Z',
        '2020-06-03T03:18:00Z',
        '2020-06-03T03:17:00.235373882Z',
        '{"request0":"yo","error":"something is seriously wrong"}',
        'request',
        'query_log',
        'stag01-us-east-4',
        'queryd-v1-6c46d687dc-2t5r5',
        'queryd-v1-6c46d687dc-2t5r5',
        'gke-stag01-us-east-4-highmem-preempti-6beb3a50-nsb6',
        '342e059bf55331f9',
        'false',
        'unknown',
        'queryd-v1',
        'tasks',
      ],
      [
        '',
        '',
        '0',
        '2020-06-03T03:17:00Z',
        '2020-06-03T03:18:00Z',
        '2020-06-03T03:17:00.235373882Z',
        '{"request1":"hi","error":"oops, another error"}',
        'request',
        'query_log',
        'stag01-us-east-4',
        'queryd-v1-6c46d687dc-2t5r5',
        'queryd-v1-6c46d687dc-2t5r5',
        'gke-stag01-us-east-4-highmem-preempti-6beb3a50-nsb6',
        '342e059bf55331f9',
        'false',
        'unknown',
        'queryd-v1',
        'tasks',
      ],
      [],
      [
        '#group',
        'false',
        'false',
        'true',
        'true',
        'false',
        'false',
        'true',
        'true',
        'true',
        'true',
        'true',
        'true',
        'true',
        'true',
        'true',
        'true',
        'true',
      ],
      [
        '#datatype',
        'string',
        'long',
        'dateTime:RFC3339',
        'dateTime:RFC3339',
        'dateTime:RFC3339',
        'string',
        'string',
        'string',
        'string',
        'string',
        'string',
        'string',
        'string',
        'string',
        'string',
        'string',
        'string',
      ],
      [
        '#default',
        '_result',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
      ],
      [
        '',
        'result',
        'table',
        '_start',
        '_stop',
        '_time',
        '_value',
        '_field',
        '_measurement',
        'env',
        'host',
        'hostname',
        'nodename',
        'orgID',
        'ot_trace_sampled',
        'query-role',
        'role',
        'source',
      ],
      [
        '',
        '',
        '0',
        '2020-06-03T03:17:00Z',
        '2020-06-03T03:18:00Z',
        '2020-06-03T03:17:00.235373882Z',
        '{"request":"greetings","error":"file not found"}',
        'request',
        'query_log',
        'stag01-us-east-4',
        'queryd-v1-6c46d687dc-2t5r5',
        'queryd-v1-6c46d687dc-2t5r5',
        'gke-stag01-us-east-4-highmem-preempti-6beb3a50-nsb6',
        '342e059bf55331f9',
        'false',
        'unknown',
        'queryd-v1',
        'tasks',
      ],
      [],
      [
        '#group',
        'false',
        'false',
        'true',
        'true',
        'false',
        'false',
        'true',
        'true',
        'true',
        'true',
        'true',
        'true',
        'true',
        'true',
        'true',
        'true',
        'true',
      ],
      [
        '#datatype',
        'string',
        'long',
        'dateTime:RFC3339',
        'dateTime:RFC3339',
        'dateTime:RFC3339',
        'string',
        'string',
        'string',
        'string',
        'string',
        'string',
        'string',
        'string',
        'string',
        'string',
        'string',
        'string',
      ],
      [
        '#default',
        '_result',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
      ],
      [
        '',
        'result',
        'table',
        '_start',
        '_stop',
        '_time',
        '_value',
        '_field',
        '_measurement',
        'env',
        'host',
        'hostname',
        'nodename',
        'orgID',
        'ot_trace_sampled',
        'query-role',
        'role',
        'source',
      ],
      [
        '',
        '',
        '0',
        '2020-06-03T03:17:00Z',
        '2020-06-03T03:18:00Z',
        '2020-06-03T03:17:00.235373882Z',
        '{"request99":"hello","error":"my name is bob"}',
        'request',
        'query_log',
        'stag01-us-east-4',
        'queryd-v1-6c46d687dc-2t5r5',
        'queryd-v1-6c46d687dc-2t5r5',
        'gke-stag01-us-east-4-highmem-preempti-6beb3a50-nsb6',
        '342e059bf55331f9',
        'false',
        'unknown',
        'queryd-v1',
        'tasks',
      ],
    ]

    const expected = {
      data: expectedData,
      maxColumnCount: 18,
    }

    const result = parseFiles([CSV], true)
    expect(result).toEqual(expected)

    expect(() => {
      JSON.parse(result.data[4][6])
      JSON.parse(result.data[10][6])
      JSON.parse(result.data[11][6])
      JSON.parse(result.data[17][6])
      JSON.parse(result.data[23][6])
    }).not.toThrow()
  })
})
