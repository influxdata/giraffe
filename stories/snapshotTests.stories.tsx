import * as React from 'react'
import {storiesOf} from '@storybook/react'

import {fluxToTable, Config, Plot} from '../src'
import {PlotContainer} from './helpers'

storiesOf('Snapshot Tests', module)
  .add('with multiple minimum values', () => {
    // https://github.com/influxdata/vis/issues/51

    const {table} = fluxToTable(
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
  .add('edge hover bug', () => {
    const {table} = fluxToTable(
      `#group,true,false,true,true,false,false,true,true,true,true,true,true,true
#datatype,string,long,dateTime:RFC3339,dateTime:RFC3339,dateTime:RFC3339,double,string,string,string,string,string,string,string
#default,_result,,,,,,,,,,,,
,result,table,_start,_stop,_time,_value,_field,_measurement,domain,host,record_type,result,server
,,0,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:27:40Z,67.326005,query_time_ms,dns_query,.,oox4k.local,NS,success,208.67.220.220
,,0,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:27:49Z,61.371163,query_time_ms,dns_query,.,oox4k.local,NS,success,208.67.220.220
,,0,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:28:00Z,73.012695,query_time_ms,dns_query,.,oox4k.local,NS,success,208.67.220.220
,,0,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:28:09Z,66.132616,query_time_ms,dns_query,.,oox4k.local,NS,success,208.67.220.220
,,0,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:28:19Z,65.053674,query_time_ms,dns_query,.,oox4k.local,NS,success,208.67.220.220
,,0,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:28:30Z,76.860303,query_time_ms,dns_query,.,oox4k.local,NS,success,208.67.220.220
,,0,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:28:40Z,74.733113,query_time_ms,dns_query,.,oox4k.local,NS,success,208.67.220.220
,,0,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:28:49Z,65.998594,query_time_ms,dns_query,.,oox4k.local,NS,success,208.67.220.220
,,0,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:28:59Z,63.219503,query_time_ms,dns_query,.,oox4k.local,NS,success,208.67.220.220
,,0,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:29:10Z,66.826109,query_time_ms,dns_query,.,oox4k.local,NS,success,208.67.220.220

#group,true,false,true,true,false,false,true,true,true,true,true,true,true
#datatype,string,long,dateTime:RFC3339,dateTime:RFC3339,dateTime:RFC3339,long,string,string,string,string,string,string,string
#default,_result,,,,,,,,,,,,
,result,table,_start,_stop,_time,_value,_field,_measurement,domain,host,record_type,result,server
,,1,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:27:40Z,0,result_code,dns_query,.,oox4k.local,NS,success,9.9.9.9
,,1,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:27:50Z,0,result_code,dns_query,.,oox4k.local,NS,success,9.9.9.9
,,1,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:28:00Z,0,result_code,dns_query,.,oox4k.local,NS,success,9.9.9.9
,,1,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:28:10Z,0,result_code,dns_query,.,oox4k.local,NS,success,9.9.9.9
,,1,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:28:20Z,0,result_code,dns_query,.,oox4k.local,NS,success,9.9.9.9
,,1,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:28:30Z,0,result_code,dns_query,.,oox4k.local,NS,success,9.9.9.9
,,1,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:28:40Z,0,result_code,dns_query,.,oox4k.local,NS,success,9.9.9.9
,,1,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:28:50Z,0,result_code,dns_query,.,oox4k.local,NS,success,9.9.9.9
,,1,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:29:00Z,0,result_code,dns_query,.,oox4k.local,NS,success,9.9.9.9
,,1,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:29:10Z,0,result_code,dns_query,.,oox4k.local,NS,success,9.9.9.9
,,2,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:27:40Z,0,result_code,dns_query,.,oox4k.local,NS,success,149.112.112.112
,,2,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:27:50Z,0,result_code,dns_query,.,oox4k.local,NS,success,149.112.112.112
,,2,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:28:00Z,0,result_code,dns_query,.,oox4k.local,NS,success,149.112.112.112
,,2,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:28:10Z,0,result_code,dns_query,.,oox4k.local,NS,success,149.112.112.112
,,2,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:28:20Z,0,result_code,dns_query,.,oox4k.local,NS,success,149.112.112.112
,,2,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:28:30Z,0,result_code,dns_query,.,oox4k.local,NS,success,149.112.112.112
,,2,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:28:40Z,0,result_code,dns_query,.,oox4k.local,NS,success,149.112.112.112
,,2,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:28:50Z,0,result_code,dns_query,.,oox4k.local,NS,success,149.112.112.112
,,2,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:29:00Z,0,result_code,dns_query,.,oox4k.local,NS,success,149.112.112.112
,,2,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:29:10Z,0,result_code,dns_query,.,oox4k.local,NS,success,149.112.112.112
,,3,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:27:40Z,0,result_code,dns_query,.,oox4k.local,NS,success,208.67.222.222
,,3,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:27:50Z,0,result_code,dns_query,.,oox4k.local,NS,success,208.67.222.222
,,3,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:28:00Z,0,result_code,dns_query,.,oox4k.local,NS,success,208.67.222.222
,,3,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:28:20Z,0,result_code,dns_query,.,oox4k.local,NS,success,208.67.222.222
,,3,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:28:30Z,0,result_code,dns_query,.,oox4k.local,NS,success,208.67.222.222
,,3,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:28:40Z,0,result_code,dns_query,.,oox4k.local,NS,success,208.67.222.222
,,3,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:28:50Z,0,result_code,dns_query,.,oox4k.local,NS,success,208.67.222.222
,,3,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:29:00Z,0,result_code,dns_query,.,oox4k.local,NS,success,208.67.222.222
,,3,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:29:10Z,0,result_code,dns_query,.,oox4k.local,NS,success,208.67.222.222
,,3,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:29:20Z,0,result_code,dns_query,.,oox4k.local,NS,success,208.67.222.222
,,4,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:27:40Z,0,result_code,dns_query,.,oox4k.local,NS,success,208.67.220.220
,,4,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:27:49Z,0,result_code,dns_query,.,oox4k.local,NS,success,208.67.220.220
,,4,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:28:00Z,0,result_code,dns_query,.,oox4k.local,NS,success,208.67.220.220
,,4,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:28:09Z,0,result_code,dns_query,.,oox4k.local,NS,success,208.67.220.220
,,4,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:28:19Z,0,result_code,dns_query,.,oox4k.local,NS,success,208.67.220.220
,,4,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:28:30Z,0,result_code,dns_query,.,oox4k.local,NS,success,208.67.220.220
,,4,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:28:40Z,0,result_code,dns_query,.,oox4k.local,NS,success,208.67.220.220
,,4,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:28:49Z,0,result_code,dns_query,.,oox4k.local,NS,success,208.67.220.220
,,4,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:28:59Z,0,result_code,dns_query,.,oox4k.local,NS,success,208.67.220.220
,,4,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:29:10Z,0,result_code,dns_query,.,oox4k.local,NS,success,208.67.220.220

#group,true,false,true,true,false,false,true,true,true,true,true,true,true
#datatype,string,long,dateTime:RFC3339,dateTime:RFC3339,dateTime:RFC3339,double,string,string,string,string,string,string,string
#default,_result,,,,,,,,,,,,
,result,table,_start,_stop,_time,_value,_field,_measurement,domain,host,record_type,result,server
,,5,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:27:40Z,63.200627,query_time_ms,dns_query,.,oox4k.local,NS,success,8.8.8.8
,,5,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:27:49Z,59.991292,query_time_ms,dns_query,.,oox4k.local,NS,success,8.8.8.8
,,5,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:27:59Z,59.890244,query_time_ms,dns_query,.,oox4k.local,NS,success,8.8.8.8
,,5,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:28:09Z,65.712831,query_time_ms,dns_query,.,oox4k.local,NS,success,8.8.8.8
,,5,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:28:19Z,62.211963,query_time_ms,dns_query,.,oox4k.local,NS,success,8.8.8.8
,,5,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:28:30Z,66.993562,query_time_ms,dns_query,.,oox4k.local,NS,success,8.8.8.8
,,5,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:28:40Z,65.396099,query_time_ms,dns_query,.,oox4k.local,NS,success,8.8.8.8
,,5,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:28:49Z,65.45651,query_time_ms,dns_query,.,oox4k.local,NS,success,8.8.8.8
,,5,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:28:59Z,60.630388,query_time_ms,dns_query,.,oox4k.local,NS,success,8.8.8.8
,,5,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:29:10Z,64.448767,query_time_ms,dns_query,.,oox4k.local,NS,success,8.8.8.8

#group,true,false,true,true,false,false,true,true,true,true,true,true,true
#datatype,string,long,dateTime:RFC3339,dateTime:RFC3339,dateTime:RFC3339,long,string,string,string,string,string,string,string
#default,_result,,,,,,,,,,,,
,result,table,_start,_stop,_time,_value,_field,_measurement,domain,host,record_type,result,server
,,6,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:27:40Z,0,result_code,dns_query,.,oox4k.local,NS,success,8.8.4.4
,,6,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:27:49Z,0,result_code,dns_query,.,oox4k.local,NS,success,8.8.4.4
,,6,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:28:00Z,0,result_code,dns_query,.,oox4k.local,NS,success,8.8.4.4
,,6,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:28:10Z,0,result_code,dns_query,.,oox4k.local,NS,success,8.8.4.4
,,6,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:28:20Z,0,result_code,dns_query,.,oox4k.local,NS,success,8.8.4.4
,,6,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:28:30Z,0,result_code,dns_query,.,oox4k.local,NS,success,8.8.4.4
,,6,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:28:40Z,0,result_code,dns_query,.,oox4k.local,NS,success,8.8.4.4
,,6,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:28:50Z,0,result_code,dns_query,.,oox4k.local,NS,success,8.8.4.4
,,6,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:29:00Z,0,result_code,dns_query,.,oox4k.local,NS,success,8.8.4.4
,,6,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:29:10Z,0,result_code,dns_query,.,oox4k.local,NS,success,8.8.4.4
,,7,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:27:40Z,0,result_code,dns_query,.,oox4k.local,NS,success,8.8.8.8
,,7,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:27:49Z,0,result_code,dns_query,.,oox4k.local,NS,success,8.8.8.8
,,7,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:27:59Z,0,result_code,dns_query,.,oox4k.local,NS,success,8.8.8.8
,,7,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:28:09Z,0,result_code,dns_query,.,oox4k.local,NS,success,8.8.8.8
,,7,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:28:19Z,0,result_code,dns_query,.,oox4k.local,NS,success,8.8.8.8
,,7,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:28:30Z,0,result_code,dns_query,.,oox4k.local,NS,success,8.8.8.8
,,7,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:28:40Z,0,result_code,dns_query,.,oox4k.local,NS,success,8.8.8.8
,,7,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:28:49Z,0,result_code,dns_query,.,oox4k.local,NS,success,8.8.8.8
,,7,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:28:59Z,0,result_code,dns_query,.,oox4k.local,NS,success,8.8.8.8
,,7,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:29:10Z,0,result_code,dns_query,.,oox4k.local,NS,success,8.8.8.8

#group,true,false,true,true,false,false,true,true,true,true,true,true,true
#datatype,string,long,dateTime:RFC3339,dateTime:RFC3339,dateTime:RFC3339,double,string,string,string,string,string,string,string
#default,_result,,,,,,,,,,,,
,result,table,_start,_stop,_time,_value,_field,_measurement,domain,host,record_type,result,server
,,8,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:27:40Z,88.416195,query_time_ms,dns_query,.,oox4k.local,NS,success,9.9.9.9
,,8,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:27:50Z,81.884905,query_time_ms,dns_query,.,oox4k.local,NS,success,9.9.9.9
,,8,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:28:00Z,80.748639,query_time_ms,dns_query,.,oox4k.local,NS,success,9.9.9.9
,,8,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:28:10Z,102.081471,query_time_ms,dns_query,.,oox4k.local,NS,success,9.9.9.9
,,8,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:28:20Z,84.985933,query_time_ms,dns_query,.,oox4k.local,NS,success,9.9.9.9
,,8,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:28:30Z,86.452378,query_time_ms,dns_query,.,oox4k.local,NS,success,9.9.9.9
,,8,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:28:40Z,107.927625,query_time_ms,dns_query,.,oox4k.local,NS,success,9.9.9.9
,,8,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:28:50Z,85.213097,query_time_ms,dns_query,.,oox4k.local,NS,success,9.9.9.9
,,8,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:29:00Z,80.830378,query_time_ms,dns_query,.,oox4k.local,NS,success,9.9.9.9
,,8,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:29:10Z,85.933117,query_time_ms,dns_query,.,oox4k.local,NS,success,9.9.9.9
,,9,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:27:40Z,95.801182,query_time_ms,dns_query,.,oox4k.local,NS,success,149.112.112.112
,,9,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:27:50Z,83.048333,query_time_ms,dns_query,.,oox4k.local,NS,success,149.112.112.112
,,9,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:28:00Z,81.496297,query_time_ms,dns_query,.,oox4k.local,NS,success,149.112.112.112
,,9,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:28:10Z,101.798283,query_time_ms,dns_query,.,oox4k.local,NS,success,149.112.112.112
,,9,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:28:20Z,82.909331,query_time_ms,dns_query,.,oox4k.local,NS,success,149.112.112.112
,,9,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:28:30Z,88.876933,query_time_ms,dns_query,.,oox4k.local,NS,success,149.112.112.112
,,9,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:28:40Z,99.106617,query_time_ms,dns_query,.,oox4k.local,NS,success,149.112.112.112
,,9,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:28:50Z,88.27535,query_time_ms,dns_query,.,oox4k.local,NS,success,149.112.112.112
,,9,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:29:00Z,81.699762,query_time_ms,dns_query,.,oox4k.local,NS,success,149.112.112.112
,,9,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:29:10Z,81.946872,query_time_ms,dns_query,.,oox4k.local,NS,success,149.112.112.112
,,10,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:27:40Z,79.509565,query_time_ms,dns_query,.,oox4k.local,NS,success,208.67.222.222
,,10,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:27:50Z,62.43941,query_time_ms,dns_query,.,oox4k.local,NS,success,208.67.222.222
,,10,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:28:00Z,61.891829,query_time_ms,dns_query,.,oox4k.local,NS,success,208.67.222.222
,,10,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:28:20Z,62.260993,query_time_ms,dns_query,.,oox4k.local,NS,success,208.67.222.222
,,10,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:28:30Z,65.065039,query_time_ms,dns_query,.,oox4k.local,NS,success,208.67.222.222
,,10,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:28:40Z,65.263898,query_time_ms,dns_query,.,oox4k.local,NS,success,208.67.222.222
,,10,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:28:50Z,63.207222,query_time_ms,dns_query,.,oox4k.local,NS,success,208.67.222.222
,,10,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:29:00Z,67.376709,query_time_ms,dns_query,.,oox4k.local,NS,success,208.67.222.222
,,10,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:29:10Z,62.133883,query_time_ms,dns_query,.,oox4k.local,NS,success,208.67.222.222
,,10,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:29:20Z,72.626189,query_time_ms,dns_query,.,oox4k.local,NS,success,208.67.222.222
,,11,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:27:40Z,79.475066,query_time_ms,dns_query,.,oox4k.local,NS,success,8.8.4.4
,,11,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:27:49Z,63.063949,query_time_ms,dns_query,.,oox4k.local,NS,success,8.8.4.4
,,11,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:28:00Z,62.122318,query_time_ms,dns_query,.,oox4k.local,NS,success,8.8.4.4
,,11,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:28:10Z,65.663567,query_time_ms,dns_query,.,oox4k.local,NS,success,8.8.4.4
,,11,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:28:20Z,64.018171,query_time_ms,dns_query,.,oox4k.local,NS,success,8.8.4.4
,,11,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:28:30Z,63.992705,query_time_ms,dns_query,.,oox4k.local,NS,success,8.8.4.4
,,11,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:28:40Z,69.190114,query_time_ms,dns_query,.,oox4k.local,NS,success,8.8.4.4
,,11,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:28:50Z,62.453742,query_time_ms,dns_query,.,oox4k.local,NS,success,8.8.4.4
,,11,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:29:00Z,66.478788,query_time_ms,dns_query,.,oox4k.local,NS,success,8.8.4.4
,,11,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:29:10Z,59.546012,query_time_ms,dns_query,.,oox4k.local,NS,success,8.8.4.4

#group,true,false,true,true,false,false,true,true,true,true,true,true,true
#datatype,string,long,dateTime:RFC3339,dateTime:RFC3339,dateTime:RFC3339,long,string,string,string,string,string,string,string
#default,_result,,,,,,,,,,,,
,result,table,_start,_stop,_time,_value,_field,_measurement,domain,host,record_type,result,server
,,12,2019-05-16T16:27:30.417849Z,2019-05-16T16:32:30.417849Z,2019-05-16T16:28:12Z,1,result_code,dns_query,.,oox4k.local,NS,timeout,208.67.222.222
`
    )

    const config: Config = {
      table,
      layers: [
        {
          type: 'line',
          x: '_time',
          y: '_value',
          fill: [
            '_field',
            '_measurement',
            'domain',
            'host',
            'result',
            'server',
          ],
        },
      ],
    }

    return (
      <PlotContainer>
        <Plot config={config} />
      </PlotContainer>
    )
  })
