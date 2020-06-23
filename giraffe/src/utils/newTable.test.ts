import {newTableFromConfig} from './newTable'
import {Config} from '../types'

describe('newTableFromConfig', () => {
  it('creates a table using the table property when available', () => {
    const config = {
      table: {length: 1},
    } as Config
    expect(newTableFromConfig(config).length).toEqual(config.table.length)
  })

  it('creates a table using the fluxResponse property when available and table property is missing', () => {
    const configWithTable = {
      table: {length: 1},
      fluxResponse: `#datatype,string,long,dateTime:RFC3339,dateTime:RFC3339,dateTime:RFC3339,double,string,string,string,string
#group,false,false,true,true,false,false,true,true,true,true
#default,_result,,,,,,,,,
,result,table,_start,_stop,_time,_value,_field,_measurement,example,location
,,0,2020-03-25T20:58:15.731129Z,2020-04-24T20:58:15.731129Z,2020-04-03T18:31:33.95Z,29.9,value,temperature,index.html,browser
,,0,2020-03-25T20:58:15.731129Z,2020-04-24T20:58:15.731129Z,2020-04-03T18:55:23.863Z,28.7,value,temperature,index.html,browser
,,0,2020-03-25T20:58:15.731129Z,2020-04-24T20:58:15.731129Z,2020-04-03T19:50:52.357Z,15,value,temperature,index.html,browser
,,0,2020-03-25T20:58:15.731129Z,2020-04-24T20:58:15.731129Z,2020-04-03T19:53:37.198Z,24.8,value,temperature,index.html,browser
,,0,2020-03-25T20:58:15.731129Z,2020-04-24T20:58:15.731129Z,2020-04-03T19:53:53.033Z,23,value,temperature,index.html,browser
,,0,2020-03-25T20:58:15.731129Z,2020-04-24T20:58:15.731129Z,2020-04-03T20:19:21.88Z,20.1,value,temperature,index.html,browser
,,0,2020-03-25T20:58:15.731129Z,2020-04-24T20:58:15.731129Z,2020-04-10T22:20:40.776Z,28.7,value,temperature,index.html,browser
`,
    } as Config

    expect(newTableFromConfig(configWithTable).length).toEqual(
      configWithTable.table.length
    )

    const configWithoutTable = {
      fluxResponse: `#datatype,string,long,dateTime:RFC3339,dateTime:RFC3339,dateTime:RFC3339,double,string,string,string,string
#group,false,false,true,true,false,false,true,true,true,true
#default,_result,,,,,,,,,
,result,table,_start,_stop,_time,_value,_field,_measurement,example,location
,,0,2020-03-25T20:58:15.731129Z,2020-04-24T20:58:15.731129Z,2020-04-03T18:31:33.95Z,29.9,value,temperature,index.html,browser
,,0,2020-03-25T20:58:15.731129Z,2020-04-24T20:58:15.731129Z,2020-04-03T18:55:23.863Z,28.7,value,temperature,index.html,browser
,,0,2020-03-25T20:58:15.731129Z,2020-04-24T20:58:15.731129Z,2020-04-03T19:50:52.357Z,15,value,temperature,index.html,browser
,,0,2020-03-25T20:58:15.731129Z,2020-04-24T20:58:15.731129Z,2020-04-03T19:53:37.198Z,24.8,value,temperature,index.html,browser
,,0,2020-03-25T20:58:15.731129Z,2020-04-24T20:58:15.731129Z,2020-04-03T19:53:53.033Z,23,value,temperature,index.html,browser
,,0,2020-03-25T20:58:15.731129Z,2020-04-24T20:58:15.731129Z,2020-04-03T20:19:21.88Z,20.1,value,temperature,index.html,browser
,,0,2020-03-25T20:58:15.731129Z,2020-04-24T20:58:15.731129Z,2020-04-10T22:20:40.776Z,28.7,value,temperature,index.html,browser
`,
    } as Config

    expect(newTableFromConfig(configWithoutTable).length).toEqual(7)
  })

  it('creates an empty table when config is missing both table and fluxReponse properties', () => {
    const config = {} as Config

    expect(newTableFromConfig(config).length).toEqual(0)
  })
})
