export const circle_ci_example_1 = `#group,false,false,true,true,false,false,false,false,true,false,false,false,false
#datatype,string,long,dateTime:RFC3339,dateTime:RFC3339,dateTime:RFC3339,string,string,string,string,string,string,string,string
#default,last,,,,,,,,,,,,
,result,table,_start,_stop,_time,_value,_field,_measurement,branch,job_name,project,vcs,workflow_name
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-23T22:30:00Z,success,status,job,/any,sync-yaml,influxdata/k8s-idpe,gh,sync-yaml
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-23T23:00:00Z,success,status,job,/any,sync-yaml,influxdata/k8s-idpe,gh,sync-yaml
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-23T23:30:00Z,success,status,job,/any,build,influxdata/influxdb,gh,build
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-24T00:00:00Z,success,status,job,/any,sync-yaml,influxdata/k8s-idpe,gh,sync-yaml
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-24T00:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-24T01:00:00Z,success,status,job,/any,sync-yaml,influxdata/k8s-infra,gh,sync-yaml
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-24T01:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-24T02:00:00Z,success,status,job,/any,sync-yaml,influxdata/k8s-infra,gh,sync-yaml
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-24T02:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-24T03:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-24T04:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-24T05:30:00Z,success,status,job,/any,grace_nightly,influxdata/influxdb,gh,nightly
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-24T06:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-24T07:30:00Z,success,status,job,/any,macdeps,influxdata/telegraf,gh,nightly
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-24T08:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-24T09:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-24T10:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-24T11:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-24T12:00:00Z,success,status,job,/any,test-race,influxdata/idpe,gh,ci
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-24T12:30:00Z,success,status,job,/any,cd-app-verifyd,influxdata/idpe,gh,cd-images
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-24T13:00:00Z,success,status,job,/any,sync-yaml,influxdata/k8s-infra,gh,sync-yaml
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-24T13:30:00Z,success,status,job,/any,test-race,influxdata/idpe,gh,ci
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-24T14:00:00Z,success,status,job,/any,sync-yaml,influxdata/k8s-idpe,gh,sync-yaml
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-24T14:30:00Z,success,status,job,/any,sync-yaml,influxdata/k8s-idpe,gh,sync-yaml
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-24T15:00:00Z,success,status,job,/any,sync-yaml,influxdata/k8s-idpe,gh,sync-yaml
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-24T15:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-24T16:00:00Z,success,status,job,/any,publish,influxdata/quartz,gh,build-test
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-24T16:30:00Z,success,status,job,/any,package,influxdata/telegraf,gh,check
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-24T17:00:00Z,success,status,job,/any,test-race,influxdata/idpe,gh,ci
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-24T17:30:00Z,success,status,job,/any,sync-yaml,influxdata/k8s-idpe,gh,sync-yaml
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-24T18:00:00Z,success,status,job,/any,test-race,influxdata/idpe,gh,ci
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-24T18:30:00Z,success,status,job,/any,test-race,influxdata/idpe,gh,ci
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-24T19:00:00Z,success,status,job,/any,test-valgrind,influxdata/flux,gh,build-and-test
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-24T19:30:00Z,success,status,job,/any,sync-yaml,influxdata/k8s-idpe,gh,sync-yaml
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-24T20:00:00Z,success,status,job,/any,sync-yaml,influxdata/k8s-idpe,gh,sync-yaml
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-24T20:30:00Z,success,status,job,/any,package,influxdata/telegraf,gh,check
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-24T21:00:00Z,success,status,job,/any,sync-yaml,influxdata/k8s-idpe,gh,sync-yaml
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-24T21:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-24T22:00:00Z,success,status,job,/any,publish,influxdata/quartz,gh,build-test
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-24T22:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-24T23:30:00Z,success,status,job,/any,build,influxdata/influxdb,gh,build
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-25T00:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-25T01:00:00Z,success,status,job,/any,sync-yaml,influxdata/k8s-idpe,gh,sync-yaml
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-25T01:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-25T02:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-25T03:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-25T04:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-25T05:30:00Z,success,status,job,/any,lint-feature-flags,influxdata/influxdb,gh,nightly
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-25T06:00:00Z,success,status,job,/any,test-valgrind,influxdata/flux,gh,build-and-test
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-25T06:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-25T07:30:00Z,success,status,job,/any,macdeps,influxdata/telegraf,gh,nightly
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-25T08:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-25T09:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-25T10:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-25T11:30:00Z,success,status,job,/any,sync-yaml,influxdata/k8s-idpe,gh,sync-yaml
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-25T12:30:00Z,success,status,job,/any,test-race,influxdata/idpe,gh,ci
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-25T13:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-25T14:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-25T15:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-25T16:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-25T17:00:00Z,success,status,job,/any,test-race,influxdata/idpe,gh,ci
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-25T17:30:00Z,success,status,job,/any,sync-yaml,influxdata/k8s-idpe,gh,sync-yaml
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-25T18:00:00Z,success,status,job,/any,sync-yaml,influxdata/k8s-idpe,gh,sync-yaml
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-25T18:30:00Z,success,status,job,/any,sync-yaml,influxdata/k8s-idpe,gh,sync-yaml
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-25T19:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-25T20:00:00Z,success,status,job,/any,sync-yaml,influxdata/k8s-idpe,gh,sync-yaml
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-25T20:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-25T21:00:00Z,success,status,job,/any,publish,influxdata/quartz,gh,build-test
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-25T21:30:00Z,success,status,job,/any,sync-yaml,influxdata/k8s-idpe,gh,sync-yaml
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-25T22:30:00Z,success,status,job,/any,build,influxdata/influxdb,gh,build
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-25T23:00:00Z,success,status,job,/any,publish,influxdata/quartz,gh,build-test
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-25T23:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-26T00:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-26T01:00:00Z,success,status,job,/any,publish,influxdata/quartz,gh,build-test
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-26T01:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-26T02:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-26T03:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-26T04:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-26T05:30:00Z,success,status,job,/any,lint-feature-flags,influxdata/influxdb,gh,nightly
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-26T06:00:00Z,success,status,job,/any,grace_nightly,influxdata/influxdb,gh,nightly
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-26T06:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-26T07:30:00Z,success,status,job,/any,macdeps,influxdata/telegraf,gh,nightly
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-26T08:00:00Z,success,status,job,/any,build,influxdata/influxdb,gh,build
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-26T08:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-26T09:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-26T10:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-26T11:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-26T12:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-26T13:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-26T14:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-26T15:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-26T16:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-26T17:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-26T18:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-26T19:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-26T20:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-26T21:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-26T22:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-26T23:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-27T00:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-27T01:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-27T02:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-27T03:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-27T04:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-27T05:30:00Z,success,status,job,/any,grace_nightly,influxdata/influxdb,gh,nightly
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-27T06:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-27T07:30:00Z,success,status,job,/any,macdeps,influxdata/telegraf,gh,nightly
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-27T08:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-27T09:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-27T10:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-27T11:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-27T12:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-27T13:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-27T14:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-27T15:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-27T16:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-27T17:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-27T18:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-27T19:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-27T20:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-27T21:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-27T22:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-27T23:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-28T00:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-28T01:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-28T02:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-28T03:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-28T04:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-28T05:30:00Z,success,status,job,/any,lint-feature-flags,influxdata/influxdb,gh,nightly
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-28T06:00:00Z,success,status,job,/any,grace_nightly,influxdata/influxdb,gh,nightly
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-28T06:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-28T07:30:00Z,success,status,job,/any,macdeps,influxdata/telegraf,gh,nightly
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-28T08:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-28T09:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-28T10:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-28T11:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-28T12:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-28T13:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-28T14:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-28T15:30:00Z,success,status,job,/any,package,influxdata/telegraf,gh,check
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-28T16:00:00Z,success,status,job,/any,macdeps,influxdata/telegraf,gh,check
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-28T16:30:00Z,success,status,job,/any,package,influxdata/telegraf,gh,check
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-28T17:00:00Z,success,status,job,/any,test-race,influxdata/idpe,gh,ci
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-28T17:30:00Z,success,status,job,/any,build,influxdata/influxdb,gh,build
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-28T18:00:00Z,success,status,job,/any,sync-yaml,influxdata/k8s-infra,gh,sync-yaml
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-28T18:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-28T19:30:00Z,success,status,job,/any,test-race,influxdata/idpe,gh,ci
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-28T20:00:00Z,success,status,job,/any,sync-yaml,influxdata/k8s-idpe,gh,sync-yaml
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-28T20:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-28T21:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-28T22:00:00Z,success,status,job,/any,sync-yaml,influxdata/k8s-infra,gh,sync-yaml
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-28T22:30:00Z,success,status,job,/any,package,influxdata/telegraf,gh,check
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-28T23:00:00Z,success,status,job,/any,sync-yaml,influxdata/k8s-idpe,gh,sync-yaml
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-28T23:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-29T00:30:00Z,success,status,job,/any,test-valgrind,influxdata/flux,gh,build-and-test
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-29T01:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-29T02:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-29T03:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-29T04:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-29T05:30:00Z,success,status,job,/any,grace_nightly,influxdata/influxdb,gh,nightly
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-29T06:30:00Z,success,status,job,/any,build,influxdata/influxdb,gh,build
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-29T07:00:00Z,success,status,job,/any,litmus_integration,influxdata/influxdb,gh,build
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-29T07:30:00Z,success,status,job,/any,macdeps,influxdata/telegraf,gh,nightly
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-29T08:30:00Z,success,status,job,/any,test-race,influxdata/idpe,gh,ci
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-29T09:00:00Z,success,status,job,/any,sync-yaml,influxdata/k8s-idpe,gh,sync-yaml
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-29T09:30:00Z,success,status,job,/any,sync-yaml,influxdata/k8s-idpe,gh,sync-yaml
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-29T10:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-29T11:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-29T12:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-29T13:30:00Z,success,status,job,/any,sync-yaml,influxdata/k8s-infra,gh,sync-yaml
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-29T14:00:00Z,success,status,job,/any,test-race,influxdata/idpe,gh,ci
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-29T14:30:00Z,success,status,job,/any,test-go-1.13,influxdata/telegraf,gh,check
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-29T15:00:00Z,success,status,job,/any,package,influxdata/telegraf,gh,check
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-29T15:30:00Z,success,status,job,/any,sync-yaml,influxdata/k8s-idpe,gh,sync-yaml
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-29T16:30:00Z,success,status,job,/any,build,influxdata/influxdb,gh,build
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-29T17:00:00Z,success,status,job,/any,sync-yaml,influxdata/k8s-idpe,gh,sync-yaml
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-29T17:30:00Z,success,status,job,/any,sync-yaml,influxdata/k8s-idpe,gh,sync-yaml
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-29T18:00:00Z,success,status,job,/any,sync-yaml,influxdata/k8s-idpe,gh,sync-yaml
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-29T18:30:00Z,success,status,job,/any,package,influxdata/telegraf,gh,check
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-29T19:00:00Z,success,status,job,/any,sync-yaml,influxdata/k8s-idpe,gh,sync-yaml
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-29T19:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-29T20:00:00Z,success,status,job,/any,test-race,influxdata/idpe,gh,ci
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-29T20:30:00Z,success,status,job,/any,test-valgrind,influxdata/flux,gh,build-and-test
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-29T21:00:00Z,success,status,job,/any,sync-yaml,influxdata/k8s-idpe,gh,sync-yaml
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-29T21:30:00Z,success,status,job,/any,test-race,influxdata/idpe,gh,ci
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-29T22:00:00Z,success,status,job,/any,sync-yaml,influxdata/k8s-idpe,gh,sync-yaml
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-29T22:30:00Z,success,status,job,/any,test-race,influxdata/idpe,gh,ci
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-29T23:00:00Z,success,status,job,/any,sync-yaml,influxdata/k8s-idpe,gh,sync-yaml
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-29T23:30:00Z,success,status,job,/any,sync-yaml,influxdata/k8s-idpe,gh,sync-yaml
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-30T00:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-30T01:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-30T02:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-30T03:30:00Z,success,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-30T04:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-30T05:30:00Z,success,status,job,/any,lint-feature-flags,influxdata/influxdb,gh,nightly
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-30T06:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-30T07:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-30T08:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-30T09:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-30T10:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-30T11:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-30T12:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-30T13:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-30T14:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-30T15:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-30T16:30:00Z,success,status,job,/any,test-race,influxdata/idpe,gh,ci
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-30T17:30:00Z,failed,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-30T18:30:00Z,success,status,job,/any,cd-app-verifyd,influxdata/idpe,gh,cd-images
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-30T19:00:00Z,success,status,job,/any,cd-app-service-test-deployment-historian,influxdata/idpe,gh,cd-images
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-30T19:30:00Z,success,status,job,/any,cd-app-verifyd,influxdata/idpe,gh,cd-images
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-30T20:00:00Z,success,status,job,/any,cd-app-verifyd,influxdata/idpe,gh,cd-images
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-30T20:30:00Z,success,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,0,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-30T21:30:00Z,success,status,job,/any,smoketest,influxdata/quartz,gh,smoke
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-23T22:30:00Z,success,status,job,master,sync-yaml,influxdata/k8s-idpe,gh,sync-yaml
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-23T23:00:00Z,success,status,job,master,build,influxdata/quartz,gh,build-test
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-23T23:30:00Z,success,status,job,master,jslint,influxdata/influxdb,gh,build
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-24T00:00:00Z,success,status,job,master,sync-yaml,influxdata/k8s-idpe,gh,sync-yaml
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-24T00:30:00Z,failed,status,job,master,smoketest,influxdata/quartz,gh,smoke
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-24T01:00:00Z,success,status,job,master,sync-yaml,influxdata/k8s-infra,gh,sync-yaml
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-24T01:30:00Z,failed,status,job,master,smoketest,influxdata/quartz,gh,smoke
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-24T02:00:00Z,success,status,job,master,sync-yaml,influxdata/k8s-infra,gh,sync-yaml
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-24T02:30:00Z,failed,status,job,master,smoketest,influxdata/quartz,gh,smoke
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-24T03:30:00Z,failed,status,job,master,smoketest,influxdata/quartz,gh,smoke
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-24T04:30:00Z,failed,status,job,master,smoketest,influxdata/quartz,gh,smoke
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-24T05:30:00Z,success,status,job,master,litmus_nightly,influxdata/influxdb,gh,nightly
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-24T06:30:00Z,failed,status,job,master,smoketest,influxdata/quartz,gh,smoke
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-24T07:30:00Z,success,status,job,master,test-go-darwin,influxdata/telegraf,gh,nightly
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-24T08:30:00Z,failed,status,job,master,smoketest,influxdata/quartz,gh,smoke
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-24T09:30:00Z,failed,status,job,master,smoketest,influxdata/quartz,gh,smoke
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-24T10:30:00Z,failed,status,job,master,smoketest,influxdata/quartz,gh,smoke
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-24T11:30:00Z,failed,status,job,master,smoketest,influxdata/quartz,gh,smoke
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-24T12:00:00Z,success,status,job,master,test-race,influxdata/idpe,gh,ci
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-24T12:30:00Z,success,status,job,master,cd-app-verifyd,influxdata/idpe,gh,cd-images
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-24T13:00:00Z,success,status,job,master,sync-yaml,influxdata/k8s-infra,gh,sync-yaml
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-24T13:30:00Z,success,status,job,master,cd-app-verifyd,influxdata/idpe,gh,cd-images
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-24T14:00:00Z,success,status,job,master,sync-yaml,influxdata/k8s-idpe,gh,sync-yaml
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-24T14:30:00Z,success,status,job,master,sync-yaml,influxdata/k8s-idpe,gh,sync-yaml
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-24T15:00:00Z,success,status,job,master,sync-yaml,influxdata/k8s-idpe,gh,sync-yaml
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-24T15:30:00Z,failed,status,job,master,smoketest,influxdata/quartz,gh,smoke
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-24T16:00:00Z,success,status,job,master,build,influxdata/quartz,gh,build-test
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-24T16:30:00Z,success,status,job,master,cd-app-verifyd,influxdata/idpe,gh,cd-images
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-24T17:00:00Z,success,status,job,master,cd-app-verifyd,influxdata/idpe,gh,cd-images
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-24T17:30:00Z,success,status,job,master,sync-yaml,influxdata/k8s-idpe,gh,sync-yaml
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-24T18:00:00Z,success,status,job,master,cd-app-verifyd,influxdata/idpe,gh,cd-images
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-24T18:30:00Z,success,status,job,master,jslint,influxdata/influxdb,gh,build
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-24T19:00:00Z,success,status,job,master,jslint,influxdata/influxdb,gh,build
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-24T19:30:00Z,success,status,job,master,sync-yaml,influxdata/k8s-idpe,gh,sync-yaml
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-24T20:00:00Z,success,status,job,master,build,influxdata/quartz,gh,build-test
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-24T20:30:00Z,success,status,job,master,test-go-1.13-386,influxdata/telegraf,gh,check
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-24T21:00:00Z,success,status,job,master,sync-yaml,influxdata/k8s-idpe,gh,sync-yaml
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-24T21:30:00Z,failed,status,job,master,smoketest,influxdata/quartz,gh,smoke
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-24T22:00:00Z,success,status,job,master,build,influxdata/quartz,gh,build-test
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-24T22:30:00Z,success,status,job,master,build,influxdata/quartz,gh,build-test
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-24T23:30:00Z,success,status,job,master,jslint,influxdata/influxdb,gh,build
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-25T00:30:00Z,failed,status,job,master,build,influxdata/quartz,gh,build-test
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-25T01:00:00Z,success,status,job,master,sync-yaml,influxdata/k8s-idpe,gh,sync-yaml
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-25T01:30:00Z,failed,status,job,master,smoketest,influxdata/quartz,gh,smoke
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-25T02:30:00Z,failed,status,job,master,smoketest,influxdata/quartz,gh,smoke
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-25T03:30:00Z,failed,status,job,master,smoketest,influxdata/quartz,gh,smoke
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-25T04:30:00Z,failed,status,job,master,smoketest,influxdata/quartz,gh,smoke
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-25T05:30:00Z,failed,status,job,master,smoketest,influxdata/quartz,gh,smoke
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-25T06:00:00Z,success,status,job,master,test-valgrind,influxdata/flux,gh,build-and-test
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-25T06:30:00Z,failed,status,job,master,smoketest,influxdata/quartz,gh,smoke
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-25T07:30:00Z,success,status,job,master,test-go-darwin,influxdata/telegraf,gh,nightly
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-25T08:30:00Z,failed,status,job,master,smoketest,influxdata/quartz,gh,smoke
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-25T09:30:00Z,failed,status,job,master,smoketest,influxdata/quartz,gh,smoke
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-25T10:30:00Z,failed,status,job,master,smoketest,influxdata/quartz,gh,smoke
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-25T11:30:00Z,success,status,job,master,sync-yaml,influxdata/k8s-idpe,gh,sync-yaml
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-25T12:30:00Z,success,status,job,master,cd-app-verifyd,influxdata/idpe,gh,cd-images
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-25T13:30:00Z,failed,status,job,master,smoketest,influxdata/quartz,gh,smoke
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-25T14:30:00Z,failed,status,job,master,smoketest,influxdata/quartz,gh,smoke
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-25T15:30:00Z,failed,status,job,master,smoketest,influxdata/quartz,gh,smoke
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-25T16:30:00Z,success,status,job,master,build,influxdata/quartz,gh,build-test
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-25T17:00:00Z,success,status,job,master,cd-app-verifyd,influxdata/idpe,gh,cd-images
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-25T17:30:00Z,success,status,job,master,sync-yaml,influxdata/k8s-idpe,gh,sync-yaml
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-25T18:00:00Z,success,status,job,master,sync-yaml,influxdata/k8s-idpe,gh,sync-yaml
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-25T18:30:00Z,success,status,job,master,sync-yaml,influxdata/k8s-idpe,gh,sync-yaml
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-25T19:30:00Z,failed,status,job,master,smoketest,influxdata/quartz,gh,smoke
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-25T20:00:00Z,success,status,job,master,sync-yaml,influxdata/k8s-idpe,gh,sync-yaml
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-25T20:30:00Z,success,status,job,master,build,influxdata/quartz,gh,build-test
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-25T21:00:00Z,success,status,job,master,build,influxdata/quartz,gh,build-test
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-25T21:30:00Z,success,status,job,master,sync-yaml,influxdata/k8s-idpe,gh,sync-yaml
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-25T22:30:00Z,success,status,job,master,jslint,influxdata/influxdb,gh,build
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-25T23:00:00Z,success,status,job,master,build,influxdata/quartz,gh,build-test
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-25T23:30:00Z,success,status,job,master,build,influxdata/quartz,gh,build-test
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-26T00:30:00Z,success,status,job,master,build,influxdata/quartz,gh,build-test
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-26T01:00:00Z,success,status,job,master,build,influxdata/quartz,gh,build-test
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-26T01:30:00Z,failed,status,job,master,smoketest,influxdata/quartz,gh,smoke
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-26T02:30:00Z,failed,status,job,master,smoketest,influxdata/quartz,gh,smoke
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-26T03:30:00Z,failed,status,job,master,smoketest,influxdata/quartz,gh,smoke
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-26T04:30:00Z,failed,status,job,master,smoketest,influxdata/quartz,gh,smoke
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-26T05:30:00Z,failed,status,job,master,smoketest,influxdata/quartz,gh,smoke
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-26T06:00:00Z,success,status,job,master,litmus_nightly,influxdata/influxdb,gh,nightly
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-26T06:30:00Z,failed,status,job,master,smoketest,influxdata/quartz,gh,smoke
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-26T07:30:00Z,success,status,job,master,test-go-darwin,influxdata/telegraf,gh,nightly
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-26T08:00:00Z,success,status,job,master,jslint,influxdata/influxdb,gh,build
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-26T08:30:00Z,failed,status,job,master,smoketest,influxdata/quartz,gh,smoke
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-26T09:30:00Z,failed,status,job,master,smoketest,influxdata/quartz,gh,smoke
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-26T10:30:00Z,failed,status,job,master,smoketest,influxdata/quartz,gh,smoke
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-26T11:30:00Z,failed,status,job,master,smoketest,influxdata/quartz,gh,smoke
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-26T12:30:00Z,failed,status,job,master,smoketest,influxdata/quartz,gh,smoke
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-26T13:30:00Z,failed,status,job,master,smoketest,influxdata/quartz,gh,smoke
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-26T14:30:00Z,failed,status,job,master,smoketest,influxdata/quartz,gh,smoke
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-26T15:30:00Z,failed,status,job,master,smoketest,influxdata/quartz,gh,smoke
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-26T16:30:00Z,failed,status,job,master,smoketest,influxdata/quartz,gh,smoke
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-26T17:30:00Z,failed,status,job,master,smoketest,influxdata/quartz,gh,smoke
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-26T18:30:00Z,failed,status,job,master,smoketest,influxdata/quartz,gh,smoke
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-26T19:30:00Z,failed,status,job,master,smoketest,influxdata/quartz,gh,smoke
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-26T20:30:00Z,failed,status,job,master,smoketest,influxdata/quartz,gh,smoke
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-26T21:30:00Z,failed,status,job,master,smoketest,influxdata/quartz,gh,smoke
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-26T22:30:00Z,failed,status,job,master,smoketest,influxdata/quartz,gh,smoke
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-26T23:30:00Z,failed,status,job,master,smoketest,influxdata/quartz,gh,smoke
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-27T00:30:00Z,failed,status,job,master,smoketest,influxdata/quartz,gh,smoke
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-27T01:30:00Z,failed,status,job,master,smoketest,influxdata/quartz,gh,smoke
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-27T02:30:00Z,failed,status,job,master,smoketest,influxdata/quartz,gh,smoke
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-27T03:30:00Z,failed,status,job,master,smoketest,influxdata/quartz,gh,smoke
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-27T04:30:00Z,failed,status,job,master,smoketest,influxdata/quartz,gh,smoke
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-27T05:30:00Z,success,status,job,master,litmus_nightly,influxdata/influxdb,gh,nightly
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-27T06:30:00Z,failed,status,job,master,smoketest,influxdata/quartz,gh,smoke
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-27T07:30:00Z,success,status,job,master,test-go-darwin,influxdata/telegraf,gh,nightly
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-27T08:30:00Z,failed,status,job,master,smoketest,influxdata/quartz,gh,smoke
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-27T09:30:00Z,failed,status,job,master,smoketest,influxdata/quartz,gh,smoke
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-27T10:30:00Z,failed,status,job,master,smoketest,influxdata/quartz,gh,smoke
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-27T11:30:00Z,failed,status,job,master,smoketest,influxdata/quartz,gh,smoke
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-27T12:30:00Z,failed,status,job,master,smoketest,influxdata/quartz,gh,smoke
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-27T13:30:00Z,failed,status,job,master,smoketest,influxdata/quartz,gh,smoke
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-27T14:30:00Z,failed,status,job,master,smoketest,influxdata/quartz,gh,smoke
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-27T15:30:00Z,failed,status,job,master,smoketest,influxdata/quartz,gh,smoke
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-27T16:30:00Z,failed,status,job,master,smoketest,influxdata/quartz,gh,smoke
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-27T17:30:00Z,failed,status,job,master,smoketest,influxdata/quartz,gh,smoke
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-27T18:30:00Z,failed,status,job,master,smoketest,influxdata/quartz,gh,smoke
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-27T19:30:00Z,failed,status,job,master,smoketest,influxdata/quartz,gh,smoke
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-27T20:30:00Z,failed,status,job,master,smoketest,influxdata/quartz,gh,smoke
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-27T21:30:00Z,failed,status,job,master,smoketest,influxdata/quartz,gh,smoke
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-27T22:30:00Z,failed,status,job,master,smoketest,influxdata/quartz,gh,smoke
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-27T23:30:00Z,failed,status,job,master,smoketest,influxdata/quartz,gh,smoke
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-28T00:30:00Z,failed,status,job,master,smoketest,influxdata/quartz,gh,smoke
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-28T01:30:00Z,failed,status,job,master,smoketest,influxdata/quartz,gh,smoke
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-28T02:30:00Z,failed,status,job,master,smoketest,influxdata/quartz,gh,smoke
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-28T03:30:00Z,failed,status,job,master,smoketest,influxdata/quartz,gh,smoke
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-28T04:30:00Z,failed,status,job,master,smoketest,influxdata/quartz,gh,smoke
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-28T05:30:00Z,failed,status,job,master,smoketest,influxdata/quartz,gh,smoke
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-28T06:00:00Z,success,status,job,master,litmus_nightly,influxdata/influxdb,gh,nightly
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-28T06:30:00Z,failed,status,job,master,smoketest,influxdata/quartz,gh,smoke
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-28T07:30:00Z,success,status,job,master,test-go-darwin,influxdata/telegraf,gh,nightly
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-28T08:30:00Z,failed,status,job,master,smoketest,influxdata/quartz,gh,smoke
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-28T09:30:00Z,failed,status,job,master,smoketest,influxdata/quartz,gh,smoke
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-28T10:30:00Z,failed,status,job,master,smoketest,influxdata/quartz,gh,smoke
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-28T11:30:00Z,failed,status,job,master,smoketest,influxdata/quartz,gh,smoke
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-28T12:30:00Z,failed,status,job,master,smoketest,influxdata/quartz,gh,smoke
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-28T13:30:00Z,failed,status,job,master,smoketest,influxdata/quartz,gh,smoke
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-28T14:30:00Z,failed,status,job,master,smoketest,influxdata/quartz,gh,smoke
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-28T15:30:00Z,success,status,job,master,test-go-1.13-386,influxdata/telegraf,gh,check
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-28T16:00:00Z,success,status,job,master,macdeps,influxdata/telegraf,gh,check
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-28T16:30:00Z,success,status,job,master,test-go-1.13-386,influxdata/telegraf,gh,check
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-28T17:00:00Z,success,status,job,master,cd-app-verifyd,influxdata/idpe,gh,cd-images
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-28T17:30:00Z,success,status,job,master,jslint,influxdata/influxdb,gh,build
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-28T18:00:00Z,success,status,job,master,sync-yaml,influxdata/k8s-infra,gh,sync-yaml
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-28T18:30:00Z,success,status,job,master,build,influxdata/quartz,gh,build-test
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-28T19:30:00Z,success,status,job,master,cd-app-verifyd,influxdata/idpe,gh,cd-images
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-28T20:00:00Z,success,status,job,master,sync-yaml,influxdata/k8s-idpe,gh,sync-yaml
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-28T20:30:00Z,failed,status,job,master,smoketest,influxdata/quartz,gh,smoke
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-28T21:30:00Z,failed,status,job,master,smoketest,influxdata/quartz,gh,smoke
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-28T22:00:00Z,success,status,job,master,build,influxdata/quartz,gh,build-test
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-28T22:30:00Z,success,status,job,master,test-go-1.13-386,influxdata/telegraf,gh,check
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-28T23:00:00Z,success,status,job,master,sync-yaml,influxdata/k8s-idpe,gh,sync-yaml
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-28T23:30:00Z,failed,status,job,master,smoketest,influxdata/quartz,gh,smoke
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-29T00:30:00Z,success,status,job,master,test-valgrind,influxdata/flux,gh,build-and-test
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-29T01:30:00Z,failed,status,job,master,smoketest,influxdata/quartz,gh,smoke
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-29T02:30:00Z,failed,status,job,master,smoketest,influxdata/quartz,gh,smoke
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-29T03:30:00Z,failed,status,job,master,smoketest,influxdata/quartz,gh,smoke
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-29T04:30:00Z,failed,status,job,master,smoketest,influxdata/quartz,gh,smoke
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-29T05:30:00Z,success,status,job,master,litmus_nightly,influxdata/influxdb,gh,nightly
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-29T06:30:00Z,success,status,job,master,jslint,influxdata/influxdb,gh,build
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-29T07:00:00Z,success,status,job,master,litmus_integration,influxdata/influxdb,gh,build
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-29T07:30:00Z,success,status,job,master,test-go-darwin,influxdata/telegraf,gh,nightly
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-29T08:30:00Z,success,status,job,master,cd-app-verifyd,influxdata/idpe,gh,cd-images
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-29T09:00:00Z,success,status,job,master,sync-yaml,influxdata/k8s-idpe,gh,sync-yaml
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-29T09:30:00Z,success,status,job,master,sync-yaml,influxdata/k8s-idpe,gh,sync-yaml
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-29T10:30:00Z,failed,status,job,master,smoketest,influxdata/quartz,gh,smoke
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-29T11:30:00Z,failed,status,job,master,smoketest,influxdata/quartz,gh,smoke
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-29T12:30:00Z,failed,status,job,master,smoketest,influxdata/quartz,gh,smoke
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-29T13:30:00Z,success,status,job,master,sync-yaml,influxdata/k8s-infra,gh,sync-yaml
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-29T14:00:00Z,success,status,job,master,cd-app-verifyd,influxdata/idpe,gh,cd-images
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-29T14:30:00Z,success,status,job,master,test-go-1.13-386,influxdata/telegraf,gh,check
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-29T15:00:00Z,success,status,job,master,sync-yaml,influxdata/k8s-idpe,gh,sync-yaml
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-29T15:30:00Z,success,status,job,master,sync-yaml,influxdata/k8s-idpe,gh,sync-yaml
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-29T16:30:00Z,success,status,job,master,jslint,influxdata/influxdb,gh,build
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-29T17:00:00Z,success,status,job,master,sync-yaml,influxdata/k8s-idpe,gh,sync-yaml
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-29T17:30:00Z,success,status,job,master,sync-yaml,influxdata/k8s-idpe,gh,sync-yaml
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-29T18:00:00Z,success,status,job,master,sync-yaml,influxdata/k8s-idpe,gh,sync-yaml
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-29T18:30:00Z,success,status,job,master,test-go-1.13-386,influxdata/telegraf,gh,check
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-29T19:00:00Z,success,status,job,master,sync-yaml,influxdata/k8s-idpe,gh,sync-yaml
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-29T19:30:00Z,failed,status,job,master,smoketest,influxdata/quartz,gh,smoke
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-29T20:00:00Z,success,status,job,master,jslint,influxdata/influxdb,gh,build
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-29T20:30:00Z,success,status,job,master,jslint,influxdata/influxdb,gh,build
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-29T21:00:00Z,success,status,job,master,jslint,influxdata/influxdb,gh,build
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-29T21:30:00Z,success,status,job,master,jslint,influxdata/influxdb,gh,build
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-29T22:00:00Z,success,status,job,master,jslint,influxdata/influxdb,gh,build
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-29T22:30:00Z,success,status,job,master,jslint,influxdata/influxdb,gh,build
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-29T23:00:00Z,success,status,job,master,test-go-1.13-386,influxdata/telegraf,gh,check
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-29T23:30:00Z,success,status,job,master,sync-yaml,influxdata/k8s-idpe,gh,sync-yaml
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-30T00:30:00Z,failed,status,job,master,smoketest,influxdata/quartz,gh,smoke
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-30T01:30:00Z,failed,status,job,master,smoketest,influxdata/quartz,gh,smoke
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-30T02:30:00Z,failed,status,job,master,smoketest,influxdata/quartz,gh,smoke
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-30T03:30:00Z,success,status,job,master,smoketest,influxdata/quartz,gh,smoke
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-30T04:30:00Z,failed,status,job,master,smoketest,influxdata/quartz,gh,smoke
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-30T05:30:00Z,failed,status,job,master,smoketest,influxdata/quartz,gh,smoke
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-30T06:30:00Z,failed,status,job,master,smoketest,influxdata/quartz,gh,smoke
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-30T07:30:00Z,success,status,job,master,test-go-darwin,influxdata/telegraf,gh,nightly
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-30T16:30:00Z,success,status,job,master,cd-app-verifyd,influxdata/idpe,gh,cd-images
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-30T18:30:00Z,success,status,job,master,cd-app-verifyd,influxdata/idpe,gh,cd-images
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-30T19:00:00Z,success,status,job,master,cd-aggregate-images,influxdata/idpe,gh,cd-images
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-30T19:30:00Z,success,status,job,master,cd-app-verifyd,influxdata/idpe,gh,cd-images
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-30T20:00:00Z,success,status,job,master,cd-app-verifyd,influxdata/idpe,gh,cd-images
,,1,2020-09-23T22:08:17.639030103Z,2020-09-30T22:08:17.639030103Z,2020-09-30T21:30:00Z,success,status,job,master,cd-app-e2e-test,influxdata/idpe,gh,cd-images
`

export const cloudy = `#group,false,false,false,false,true,true,false,false,true,false,false,false,false
#datatype,string,long,string,string,dateTime:RFC3339,dateTime:RFC3339,dateTime:RFC3339,string,string,string,string,string,string
#default,_result,,,,,,,,,,,,
,result,table,_field,_measurement,_start,_stop,_time,_value,city,city_id,country,forecast,host
,,0,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-24T17:12:59Z,CLOUDY,Chicago,4887398,US,*,tahoecity.prod
,,0,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-24T18:14:23Z,CLOUDY,Chicago,4887398,US,*,tahoecity.prod
,,0,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-24T19:13:08Z,CLOUDY,Chicago,4887398,US,*,tahoecity.prod
,,0,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-24T20:13:02Z,CLOUDY,Chicago,4887398,US,*,tahoecity.prod
,,0,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-24T21:13:19Z,CLOUDY,Chicago,4887398,US,*,tahoecity.prod
,,0,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-24T22:12:59Z,CLOUDY,Chicago,4887398,US,*,tahoecity.prod
,,0,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-24T23:13:10Z,CLOUDY,Chicago,4887398,US,*,tahoecity.prod
,,0,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T00:13:12Z,NOT_CLOUDY,Chicago,4887398,US,*,tahoecity.prod
,,0,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T01:13:08Z,NOT_CLOUDY,Chicago,4887398,US,*,tahoecity.prod
,,0,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T02:13:08Z,NOT_CLOUDY,Chicago,4887398,US,*,tahoecity.prod
,,0,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T03:13:01Z,CLOUDY,Chicago,4887398,US,*,tahoecity.prod
,,0,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T04:12:57Z,CLOUDY,Chicago,4887398,US,*,tahoecity.prod
,,0,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T05:13:35Z,CLOUDY,Chicago,4887398,US,*,tahoecity.prod
,,0,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T06:13:12Z,CLOUDY,Chicago,4887398,US,*,tahoecity.prod
,,0,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T07:13:08Z,CLOUDY,Chicago,4887398,US,*,tahoecity.prod
,,0,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T08:13:11Z,CLOUDY,Chicago,4887398,US,*,tahoecity.prod
,,0,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T09:13:09Z,CLOUDY,Chicago,4887398,US,*,tahoecity.prod
,,0,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T10:13:09Z,CLOUDY,Chicago,4887398,US,*,tahoecity.prod
,,0,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T11:13:13Z,CLOUDY,Chicago,4887398,US,*,tahoecity.prod
,,0,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T12:13:02Z,CLOUDY,Chicago,4887398,US,*,tahoecity.prod
,,0,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T13:13:09Z,CLOUDY,Chicago,4887398,US,*,tahoecity.prod
,,0,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T14:13:12Z,CLOUDY,Chicago,4887398,US,*,tahoecity.prod
,,0,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T15:13:17Z,CLOUDY,Chicago,4887398,US,*,tahoecity.prod
,,0,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T16:13:20Z,CLOUDY,Chicago,4887398,US,*,tahoecity.prod
,,0,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T17:13:10Z,CLOUDY,Chicago,4887398,US,*,tahoecity.prod
,,0,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T18:14:09Z,CLOUDY,Chicago,4887398,US,*,tahoecity.prod
,,0,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T19:13:09Z,CLOUDY,Chicago,4887398,US,*,tahoecity.prod
,,0,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T20:13:05Z,CLOUDY,Chicago,4887398,US,*,tahoecity.prod
,,0,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:13:01Z,CLOUDY,Chicago,4887398,US,*,tahoecity.prod
,,0,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T22:13:02Z,CLOUDY,Chicago,4887398,US,*,tahoecity.prod
,,0,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T23:12:55Z,CLOUDY,Chicago,4887398,US,*,tahoecity.prod
,,0,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T06:00:00Z,CLOUDY,Chicago,4887398,US,15h,tahoecity.prod
,,0,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T09:00:00Z,CLOUDY,Chicago,4887398,US,15h,tahoecity.prod
,,0,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T12:00:00Z,CLOUDY,Chicago,4887398,US,15h,tahoecity.prod
,,0,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T15:00:00Z,CLOUDY,Chicago,4887398,US,15h,tahoecity.prod
,,0,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T18:00:00Z,CLOUDY,Chicago,4887398,US,15h,tahoecity.prod
,,0,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:00:00Z,CLOUDY,Chicago,4887398,US,15h,tahoecity.prod
,,0,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T09:00:00Z,CLOUDY,Chicago,4887398,US,18h,tahoecity.prod
,,0,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T12:00:00Z,CLOUDY,Chicago,4887398,US,18h,tahoecity.prod
,,0,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T15:00:00Z,CLOUDY,Chicago,4887398,US,18h,tahoecity.prod
,,0,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T18:00:00Z,CLOUDY,Chicago,4887398,US,18h,tahoecity.prod
,,0,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:00:00Z,CLOUDY,Chicago,4887398,US,18h,tahoecity.prod
,,0,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T12:00:00Z,CLOUDY,Chicago,4887398,US,21h,tahoecity.prod
,,0,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T15:00:00Z,CLOUDY,Chicago,4887398,US,21h,tahoecity.prod
,,0,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T18:00:00Z,CLOUDY,Chicago,4887398,US,21h,tahoecity.prod
,,0,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:00:00Z,CLOUDY,Chicago,4887398,US,21h,tahoecity.prod
,,0,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T15:00:00Z,CLOUDY,Chicago,4887398,US,24h,tahoecity.prod
,,0,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T18:00:00Z,CLOUDY,Chicago,4887398,US,24h,tahoecity.prod
,,0,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:00:00Z,CLOUDY,Chicago,4887398,US,24h,tahoecity.prod
,,0,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T18:00:00Z,CLOUDY,Chicago,4887398,US,27h,tahoecity.prod
,,0,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:00:00Z,CLOUDY,Chicago,4887398,US,27h,tahoecity.prod
,,0,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:00:00Z,CLOUDY,Chicago,4887398,US,30h,tahoecity.prod
,,0,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T03:00:00Z,NOT_CLOUDY,Chicago,4887398,US,12h,tahoecity.prod
,,0,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T06:00:00Z,CLOUDY,Chicago,4887398,US,12h,tahoecity.prod
,,0,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T09:00:00Z,CLOUDY,Chicago,4887398,US,12h,tahoecity.prod
,,0,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T12:00:00Z,CLOUDY,Chicago,4887398,US,12h,tahoecity.prod
,,0,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T15:00:00Z,CLOUDY,Chicago,4887398,US,12h,tahoecity.prod
,,0,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T18:00:00Z,CLOUDY,Chicago,4887398,US,12h,tahoecity.prod
,,0,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:00:00Z,CLOUDY,Chicago,4887398,US,12h,tahoecity.prod
,,0,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-24T18:00:00Z,CLOUDY,Chicago,4887398,US,3h,tahoecity.prod
,,0,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-24T21:00:00Z,CLOUDY,Chicago,4887398,US,3h,tahoecity.prod
,,0,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T00:00:00Z,CLOUDY,Chicago,4887398,US,3h,tahoecity.prod
,,0,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T03:00:00Z,CLOUDY,Chicago,4887398,US,3h,tahoecity.prod
,,0,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T06:00:00Z,CLOUDY,Chicago,4887398,US,3h,tahoecity.prod
,,0,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T09:00:00Z,CLOUDY,Chicago,4887398,US,3h,tahoecity.prod
,,0,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T12:00:00Z,CLOUDY,Chicago,4887398,US,3h,tahoecity.prod
,,0,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T15:00:00Z,CLOUDY,Chicago,4887398,US,3h,tahoecity.prod
,,0,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T18:00:00Z,CLOUDY,Chicago,4887398,US,3h,tahoecity.prod
,,0,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:00:00Z,CLOUDY,Chicago,4887398,US,3h,tahoecity.prod
,,0,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-24T21:00:00Z,CLOUDY,Chicago,4887398,US,6h,tahoecity.prod
,,0,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T00:00:00Z,CLOUDY,Chicago,4887398,US,6h,tahoecity.prod
,,0,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T03:00:00Z,CLOUDY,Chicago,4887398,US,6h,tahoecity.prod
,,0,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T06:00:00Z,CLOUDY,Chicago,4887398,US,6h,tahoecity.prod
,,0,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T09:00:00Z,CLOUDY,Chicago,4887398,US,6h,tahoecity.prod
,,0,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T12:00:00Z,CLOUDY,Chicago,4887398,US,6h,tahoecity.prod
,,0,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T15:00:00Z,CLOUDY,Chicago,4887398,US,6h,tahoecity.prod
,,0,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T18:00:00Z,CLOUDY,Chicago,4887398,US,6h,tahoecity.prod
,,0,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:00:00Z,CLOUDY,Chicago,4887398,US,6h,tahoecity.prod
,,0,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T00:00:00Z,CLOUDY,Chicago,4887398,US,9h,tahoecity.prod
,,0,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T03:00:00Z,CLOUDY,Chicago,4887398,US,9h,tahoecity.prod
,,0,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T06:00:00Z,CLOUDY,Chicago,4887398,US,9h,tahoecity.prod
,,0,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T09:00:00Z,CLOUDY,Chicago,4887398,US,9h,tahoecity.prod
,,0,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T12:00:00Z,CLOUDY,Chicago,4887398,US,9h,tahoecity.prod
,,0,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T15:00:00Z,CLOUDY,Chicago,4887398,US,9h,tahoecity.prod
,,0,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T18:00:00Z,CLOUDY,Chicago,4887398,US,9h,tahoecity.prod
,,0,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:00:00Z,CLOUDY,Chicago,4887398,US,9h,tahoecity.prod
,,1,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-24T17:13:12Z,CLOUDY,Napa,5376095,US,*,tahoecity.prod
,,1,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-24T18:14:39Z,CLOUDY,Napa,5376095,US,*,tahoecity.prod
,,1,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-24T19:13:24Z,CLOUDY,Napa,5376095,US,*,tahoecity.prod
,,1,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-24T20:13:17Z,CLOUDY,Napa,5376095,US,*,tahoecity.prod
,,1,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-24T21:13:32Z,CLOUDY,Napa,5376095,US,*,tahoecity.prod
,,1,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-24T22:13:14Z,CLOUDY,Napa,5376095,US,*,tahoecity.prod
,,1,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-24T23:13:23Z,CLOUDY,Napa,5376095,US,*,tahoecity.prod
,,1,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T00:13:25Z,CLOUDY,Napa,5376095,US,*,tahoecity.prod
,,1,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T01:13:20Z,CLOUDY,Napa,5376095,US,*,tahoecity.prod
,,1,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T02:13:18Z,CLOUDY,Napa,5376095,US,*,tahoecity.prod
,,1,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T03:13:15Z,CLOUDY,Napa,5376095,US,*,tahoecity.prod
,,1,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T04:13:10Z,CLOUDY,Napa,5376095,US,*,tahoecity.prod
,,1,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T05:13:52Z,CLOUDY,Napa,5376095,US,*,tahoecity.prod
,,1,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T06:13:23Z,CLOUDY,Napa,5376095,US,*,tahoecity.prod
,,1,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T07:13:22Z,CLOUDY,Napa,5376095,US,*,tahoecity.prod
,,1,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T08:13:28Z,CLOUDY,Napa,5376095,US,*,tahoecity.prod
,,1,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T09:13:20Z,CLOUDY,Napa,5376095,US,*,tahoecity.prod
,,1,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T10:13:23Z,CLOUDY,Napa,5376095,US,*,tahoecity.prod
,,1,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T11:13:27Z,CLOUDY,Napa,5376095,US,*,tahoecity.prod
,,1,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T12:13:14Z,CLOUDY,Napa,5376095,US,*,tahoecity.prod
,,1,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T13:13:21Z,CLOUDY,Napa,5376095,US,*,tahoecity.prod
,,1,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T14:13:27Z,CLOUDY,Napa,5376095,US,*,tahoecity.prod
,,1,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T15:13:28Z,CLOUDY,Napa,5376095,US,*,tahoecity.prod
,,1,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T16:13:34Z,CLOUDY,Napa,5376095,US,*,tahoecity.prod
,,1,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T17:13:27Z,CLOUDY,Napa,5376095,US,*,tahoecity.prod
,,1,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T18:14:21Z,CLOUDY,Napa,5376095,US,*,tahoecity.prod
,,1,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T19:13:23Z,CLOUDY,Napa,5376095,US,*,tahoecity.prod
,,1,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T20:13:17Z,CLOUDY,Napa,5376095,US,*,tahoecity.prod
,,1,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:13:16Z,CLOUDY,Napa,5376095,US,*,tahoecity.prod
,,1,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T22:13:17Z,CLOUDY,Napa,5376095,US,*,tahoecity.prod
,,1,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T23:13:06Z,NOT_CLOUDY,Napa,5376095,US,*,tahoecity.prod
,,1,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T03:00:00Z,CLOUDY,Napa,5376095,US,12h,tahoecity.prod
,,1,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T06:00:00Z,CLOUDY,Napa,5376095,US,12h,tahoecity.prod
,,1,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T09:00:00Z,NOT_CLOUDY,Napa,5376095,US,12h,tahoecity.prod
,,1,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T12:00:00Z,NOT_CLOUDY,Napa,5376095,US,12h,tahoecity.prod
,,1,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T15:00:00Z,NOT_CLOUDY,Napa,5376095,US,12h,tahoecity.prod
,,1,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T18:00:00Z,NOT_CLOUDY,Napa,5376095,US,12h,tahoecity.prod
,,1,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:00:00Z,CLOUDY,Napa,5376095,US,12h,tahoecity.prod
,,1,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T06:00:00Z,NOT_CLOUDY,Napa,5376095,US,15h,tahoecity.prod
,,1,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T09:00:00Z,NOT_CLOUDY,Napa,5376095,US,15h,tahoecity.prod
,,1,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T12:00:00Z,NOT_CLOUDY,Napa,5376095,US,15h,tahoecity.prod
,,1,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T15:00:00Z,NOT_CLOUDY,Napa,5376095,US,15h,tahoecity.prod
,,1,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T18:00:00Z,NOT_CLOUDY,Napa,5376095,US,15h,tahoecity.prod
,,1,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:00:00Z,NOT_CLOUDY,Napa,5376095,US,15h,tahoecity.prod
,,1,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T12:00:00Z,NOT_CLOUDY,Napa,5376095,US,21h,tahoecity.prod
,,1,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T15:00:00Z,NOT_CLOUDY,Napa,5376095,US,21h,tahoecity.prod
,,1,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T18:00:00Z,NOT_CLOUDY,Napa,5376095,US,21h,tahoecity.prod
,,1,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:00:00Z,NOT_CLOUDY,Napa,5376095,US,21h,tahoecity.prod
,,1,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T15:00:00Z,NOT_CLOUDY,Napa,5376095,US,24h,tahoecity.prod
,,1,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T18:00:00Z,NOT_CLOUDY,Napa,5376095,US,24h,tahoecity.prod
,,1,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:00:00Z,NOT_CLOUDY,Napa,5376095,US,24h,tahoecity.prod
,,1,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T18:00:00Z,NOT_CLOUDY,Napa,5376095,US,27h,tahoecity.prod
,,1,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:00:00Z,NOT_CLOUDY,Napa,5376095,US,27h,tahoecity.prod
,,1,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T09:00:00Z,NOT_CLOUDY,Napa,5376095,US,18h,tahoecity.prod
,,1,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T12:00:00Z,NOT_CLOUDY,Napa,5376095,US,18h,tahoecity.prod
,,1,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T15:00:00Z,NOT_CLOUDY,Napa,5376095,US,18h,tahoecity.prod
,,1,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T18:00:00Z,NOT_CLOUDY,Napa,5376095,US,18h,tahoecity.prod
,,1,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:00:00Z,NOT_CLOUDY,Napa,5376095,US,18h,tahoecity.prod
,,1,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:00:00Z,NOT_CLOUDY,Napa,5376095,US,30h,tahoecity.prod
,,1,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-24T18:00:00Z,CLOUDY,Napa,5376095,US,3h,tahoecity.prod
,,1,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-24T21:00:00Z,CLOUDY,Napa,5376095,US,3h,tahoecity.prod
,,1,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T00:00:00Z,CLOUDY,Napa,5376095,US,3h,tahoecity.prod
,,1,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T03:00:00Z,CLOUDY,Napa,5376095,US,3h,tahoecity.prod
,,1,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T06:00:00Z,CLOUDY,Napa,5376095,US,3h,tahoecity.prod
,,1,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T09:00:00Z,CLOUDY,Napa,5376095,US,3h,tahoecity.prod
,,1,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T12:00:00Z,CLOUDY,Napa,5376095,US,3h,tahoecity.prod
,,1,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T15:00:00Z,CLOUDY,Napa,5376095,US,3h,tahoecity.prod
,,1,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T18:00:00Z,CLOUDY,Napa,5376095,US,3h,tahoecity.prod
,,1,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:00:00Z,CLOUDY,Napa,5376095,US,3h,tahoecity.prod
,,1,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-24T21:00:00Z,CLOUDY,Napa,5376095,US,6h,tahoecity.prod
,,1,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T00:00:00Z,CLOUDY,Napa,5376095,US,6h,tahoecity.prod
,,1,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T03:00:00Z,NOT_CLOUDY,Napa,5376095,US,6h,tahoecity.prod
,,1,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T06:00:00Z,NOT_CLOUDY,Napa,5376095,US,6h,tahoecity.prod
,,1,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T09:00:00Z,NOT_CLOUDY,Napa,5376095,US,6h,tahoecity.prod
,,1,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T12:00:00Z,NOT_CLOUDY,Napa,5376095,US,6h,tahoecity.prod
,,1,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T15:00:00Z,CLOUDY,Napa,5376095,US,6h,tahoecity.prod
,,1,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T18:00:00Z,NOT_CLOUDY,Napa,5376095,US,6h,tahoecity.prod
,,1,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:00:00Z,CLOUDY,Napa,5376095,US,6h,tahoecity.prod
,,1,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T00:00:00Z,CLOUDY,Napa,5376095,US,9h,tahoecity.prod
,,1,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T03:00:00Z,CLOUDY,Napa,5376095,US,9h,tahoecity.prod
,,1,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T06:00:00Z,NOT_CLOUDY,Napa,5376095,US,9h,tahoecity.prod
,,1,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T09:00:00Z,NOT_CLOUDY,Napa,5376095,US,9h,tahoecity.prod
,,1,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T12:00:00Z,NOT_CLOUDY,Napa,5376095,US,9h,tahoecity.prod
,,1,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T15:00:00Z,NOT_CLOUDY,Napa,5376095,US,9h,tahoecity.prod
,,1,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T18:00:00Z,CLOUDY,Napa,5376095,US,9h,tahoecity.prod
,,1,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:00:00Z,NOT_CLOUDY,Napa,5376095,US,9h,tahoecity.prod
,,2,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-24T17:12:46Z,CLOUDY,Oakland,4166628,US,*,tahoecity.prod
,,2,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-24T18:14:06Z,CLOUDY,Oakland,4166628,US,*,tahoecity.prod
,,2,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-24T19:12:54Z,CLOUDY,Oakland,4166628,US,*,tahoecity.prod
,,2,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-24T20:12:50Z,CLOUDY,Oakland,4166628,US,*,tahoecity.prod
,,2,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-24T21:13:05Z,CLOUDY,Oakland,4166628,US,*,tahoecity.prod
,,2,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-24T22:12:46Z,CLOUDY,Oakland,4166628,US,*,tahoecity.prod
,,2,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-24T23:12:57Z,CLOUDY,Oakland,4166628,US,*,tahoecity.prod
,,2,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T00:12:58Z,CLOUDY,Oakland,4166628,US,*,tahoecity.prod
,,2,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T01:12:55Z,CLOUDY,Oakland,4166628,US,*,tahoecity.prod
,,2,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T02:12:58Z,CLOUDY,Oakland,4166628,US,*,tahoecity.prod
,,2,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T03:12:49Z,CLOUDY,Oakland,4166628,US,*,tahoecity.prod
,,2,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T04:12:46Z,CLOUDY,Oakland,4166628,US,*,tahoecity.prod
,,2,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T05:13:16Z,CLOUDY,Oakland,4166628,US,*,tahoecity.prod
,,2,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T06:13:00Z,CLOUDY,Oakland,4166628,US,*,tahoecity.prod
,,2,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T07:12:55Z,NOT_CLOUDY,Oakland,4166628,US,*,tahoecity.prod
,,2,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T08:12:56Z,CLOUDY,Oakland,4166628,US,*,tahoecity.prod
,,2,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T09:12:55Z,CLOUDY,Oakland,4166628,US,*,tahoecity.prod
,,2,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T10:12:56Z,CLOUDY,Oakland,4166628,US,*,tahoecity.prod
,,2,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T11:12:58Z,CLOUDY,Oakland,4166628,US,*,tahoecity.prod
,,2,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T12:12:51Z,CLOUDY,Oakland,4166628,US,*,tahoecity.prod
,,2,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T13:12:55Z,CLOUDY,Oakland,4166628,US,*,tahoecity.prod
,,2,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T14:12:57Z,CLOUDY,Oakland,4166628,US,*,tahoecity.prod
,,2,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T15:13:01Z,CLOUDY,Oakland,4166628,US,*,tahoecity.prod
,,2,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T16:13:07Z,CLOUDY,Oakland,4166628,US,*,tahoecity.prod
,,2,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T17:12:55Z,CLOUDY,Oakland,4166628,US,*,tahoecity.prod
,,2,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T18:13:51Z,CLOUDY,Oakland,4166628,US,*,tahoecity.prod
,,2,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T19:12:56Z,CLOUDY,Oakland,4166628,US,*,tahoecity.prod
,,2,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T20:12:52Z,CLOUDY,Oakland,4166628,US,*,tahoecity.prod
,,2,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:12:49Z,CLOUDY,Oakland,4166628,US,*,tahoecity.prod
,,2,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T22:12:50Z,CLOUDY,Oakland,4166628,US,*,tahoecity.prod
,,2,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T23:12:42Z,CLOUDY,Oakland,4166628,US,*,tahoecity.prod
,,2,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T03:00:00Z,CLOUDY,Oakland,4166628,US,12h,tahoecity.prod
,,2,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T06:00:00Z,CLOUDY,Oakland,4166628,US,12h,tahoecity.prod
,,2,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T09:00:00Z,CLOUDY,Oakland,4166628,US,12h,tahoecity.prod
,,2,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T12:00:00Z,CLOUDY,Oakland,4166628,US,12h,tahoecity.prod
,,2,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T15:00:00Z,CLOUDY,Oakland,4166628,US,12h,tahoecity.prod
,,2,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T18:00:00Z,CLOUDY,Oakland,4166628,US,12h,tahoecity.prod
,,2,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:00:00Z,CLOUDY,Oakland,4166628,US,12h,tahoecity.prod
,,2,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T06:00:00Z,CLOUDY,Oakland,4166628,US,15h,tahoecity.prod
,,2,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T09:00:00Z,CLOUDY,Oakland,4166628,US,15h,tahoecity.prod
,,2,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T12:00:00Z,CLOUDY,Oakland,4166628,US,15h,tahoecity.prod
,,2,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T15:00:00Z,CLOUDY,Oakland,4166628,US,15h,tahoecity.prod
,,2,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T18:00:00Z,CLOUDY,Oakland,4166628,US,15h,tahoecity.prod
,,2,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:00:00Z,CLOUDY,Oakland,4166628,US,15h,tahoecity.prod
,,2,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T09:00:00Z,CLOUDY,Oakland,4166628,US,18h,tahoecity.prod
,,2,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T12:00:00Z,CLOUDY,Oakland,4166628,US,18h,tahoecity.prod
,,2,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T15:00:00Z,CLOUDY,Oakland,4166628,US,18h,tahoecity.prod
,,2,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T18:00:00Z,CLOUDY,Oakland,4166628,US,18h,tahoecity.prod
,,2,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:00:00Z,CLOUDY,Oakland,4166628,US,18h,tahoecity.prod
,,2,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T12:00:00Z,CLOUDY,Oakland,4166628,US,21h,tahoecity.prod
,,2,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T15:00:00Z,CLOUDY,Oakland,4166628,US,21h,tahoecity.prod
,,2,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T18:00:00Z,CLOUDY,Oakland,4166628,US,21h,tahoecity.prod
,,2,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:00:00Z,CLOUDY,Oakland,4166628,US,21h,tahoecity.prod
,,2,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T15:00:00Z,CLOUDY,Oakland,4166628,US,24h,tahoecity.prod
,,2,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T18:00:00Z,CLOUDY,Oakland,4166628,US,24h,tahoecity.prod
,,2,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:00:00Z,CLOUDY,Oakland,4166628,US,24h,tahoecity.prod
,,2,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T18:00:00Z,CLOUDY,Oakland,4166628,US,27h,tahoecity.prod
,,2,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:00:00Z,CLOUDY,Oakland,4166628,US,27h,tahoecity.prod
,,2,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:00:00Z,CLOUDY,Oakland,4166628,US,30h,tahoecity.prod
,,2,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-24T18:00:00Z,CLOUDY,Oakland,4166628,US,3h,tahoecity.prod
,,2,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-24T21:00:00Z,CLOUDY,Oakland,4166628,US,3h,tahoecity.prod
,,2,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T00:00:00Z,CLOUDY,Oakland,4166628,US,3h,tahoecity.prod
,,2,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T03:00:00Z,CLOUDY,Oakland,4166628,US,3h,tahoecity.prod
,,2,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T06:00:00Z,CLOUDY,Oakland,4166628,US,3h,tahoecity.prod
,,2,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T09:00:00Z,CLOUDY,Oakland,4166628,US,3h,tahoecity.prod
,,2,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T12:00:00Z,CLOUDY,Oakland,4166628,US,3h,tahoecity.prod
,,2,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T15:00:00Z,CLOUDY,Oakland,4166628,US,3h,tahoecity.prod
,,2,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T18:00:00Z,CLOUDY,Oakland,4166628,US,3h,tahoecity.prod
,,2,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:00:00Z,CLOUDY,Oakland,4166628,US,3h,tahoecity.prod
,,2,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-24T21:00:00Z,CLOUDY,Oakland,4166628,US,6h,tahoecity.prod
,,2,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T00:00:00Z,CLOUDY,Oakland,4166628,US,6h,tahoecity.prod
,,2,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T03:00:00Z,CLOUDY,Oakland,4166628,US,6h,tahoecity.prod
,,2,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T06:00:00Z,CLOUDY,Oakland,4166628,US,6h,tahoecity.prod
,,2,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T09:00:00Z,CLOUDY,Oakland,4166628,US,6h,tahoecity.prod
,,2,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T12:00:00Z,CLOUDY,Oakland,4166628,US,6h,tahoecity.prod
,,2,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T15:00:00Z,CLOUDY,Oakland,4166628,US,6h,tahoecity.prod
,,2,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T18:00:00Z,CLOUDY,Oakland,4166628,US,6h,tahoecity.prod
,,2,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:00:00Z,CLOUDY,Oakland,4166628,US,6h,tahoecity.prod
,,2,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T00:00:00Z,CLOUDY,Oakland,4166628,US,9h,tahoecity.prod
,,2,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T03:00:00Z,CLOUDY,Oakland,4166628,US,9h,tahoecity.prod
,,2,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T06:00:00Z,CLOUDY,Oakland,4166628,US,9h,tahoecity.prod
,,2,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T09:00:00Z,CLOUDY,Oakland,4166628,US,9h,tahoecity.prod
,,2,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T12:00:00Z,CLOUDY,Oakland,4166628,US,9h,tahoecity.prod
,,2,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T15:00:00Z,CLOUDY,Oakland,4166628,US,9h,tahoecity.prod
,,2,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T18:00:00Z,CLOUDY,Oakland,4166628,US,9h,tahoecity.prod
,,2,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:00:00Z,CLOUDY,Oakland,4166628,US,9h,tahoecity.prod
,,3,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-24T17:13:12Z,CLOUDY,Palo Alto,5380748,US,*,tahoecity.prod
,,3,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-24T18:14:40Z,NOT_CLOUDY,Palo Alto,5380748,US,*,tahoecity.prod
,,3,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-24T19:13:24Z,NOT_CLOUDY,Palo Alto,5380748,US,*,tahoecity.prod
,,3,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-24T20:13:17Z,CLOUDY,Palo Alto,5380748,US,*,tahoecity.prod
,,3,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-24T21:13:32Z,CLOUDY,Palo Alto,5380748,US,*,tahoecity.prod
,,3,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-24T22:13:14Z,CLOUDY,Palo Alto,5380748,US,*,tahoecity.prod
,,3,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-24T23:13:23Z,CLOUDY,Palo Alto,5380748,US,*,tahoecity.prod
,,3,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T00:13:25Z,NOT_CLOUDY,Palo Alto,5380748,US,*,tahoecity.prod
,,3,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T01:13:20Z,CLOUDY,Palo Alto,5380748,US,*,tahoecity.prod
,,3,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T02:13:18Z,NOT_CLOUDY,Palo Alto,5380748,US,*,tahoecity.prod
,,3,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T03:13:15Z,CLOUDY,Palo Alto,5380748,US,*,tahoecity.prod
,,3,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T04:13:10Z,NOT_CLOUDY,Palo Alto,5380748,US,*,tahoecity.prod
,,3,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T05:13:52Z,CLOUDY,Palo Alto,5380748,US,*,tahoecity.prod
,,3,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T06:13:23Z,CLOUDY,Palo Alto,5380748,US,*,tahoecity.prod
,,3,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T07:13:23Z,CLOUDY,Palo Alto,5380748,US,*,tahoecity.prod
,,3,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T08:13:28Z,CLOUDY,Palo Alto,5380748,US,*,tahoecity.prod
,,3,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T09:13:21Z,CLOUDY,Palo Alto,5380748,US,*,tahoecity.prod
,,3,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T10:13:23Z,CLOUDY,Palo Alto,5380748,US,*,tahoecity.prod
,,3,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T11:13:27Z,CLOUDY,Palo Alto,5380748,US,*,tahoecity.prod
,,3,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T12:13:14Z,CLOUDY,Palo Alto,5380748,US,*,tahoecity.prod
,,3,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T13:13:21Z,CLOUDY,Palo Alto,5380748,US,*,tahoecity.prod
,,3,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T14:13:27Z,CLOUDY,Palo Alto,5380748,US,*,tahoecity.prod
,,3,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T15:13:28Z,CLOUDY,Palo Alto,5380748,US,*,tahoecity.prod
,,3,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T16:13:34Z,CLOUDY,Palo Alto,5380748,US,*,tahoecity.prod
,,3,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T17:13:27Z,CLOUDY,Palo Alto,5380748,US,*,tahoecity.prod
,,3,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T18:14:21Z,CLOUDY,Palo Alto,5380748,US,*,tahoecity.prod
,,3,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T19:13:23Z,CLOUDY,Palo Alto,5380748,US,*,tahoecity.prod
,,3,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T20:13:17Z,CLOUDY,Palo Alto,5380748,US,*,tahoecity.prod
,,3,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:13:16Z,CLOUDY,Palo Alto,5380748,US,*,tahoecity.prod
,,3,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T22:13:17Z,CLOUDY,Palo Alto,5380748,US,*,tahoecity.prod
,,3,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T23:13:06Z,CLOUDY,Palo Alto,5380748,US,*,tahoecity.prod
,,3,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T03:00:00Z,NOT_CLOUDY,Palo Alto,5380748,US,12h,tahoecity.prod
,,3,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T06:00:00Z,NOT_CLOUDY,Palo Alto,5380748,US,12h,tahoecity.prod
,,3,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T09:00:00Z,NOT_CLOUDY,Palo Alto,5380748,US,12h,tahoecity.prod
,,3,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T12:00:00Z,NOT_CLOUDY,Palo Alto,5380748,US,12h,tahoecity.prod
,,3,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T15:00:00Z,CLOUDY,Palo Alto,5380748,US,12h,tahoecity.prod
,,3,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T18:00:00Z,CLOUDY,Palo Alto,5380748,US,12h,tahoecity.prod
,,3,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:00:00Z,CLOUDY,Palo Alto,5380748,US,12h,tahoecity.prod
,,3,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T06:00:00Z,NOT_CLOUDY,Palo Alto,5380748,US,15h,tahoecity.prod
,,3,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T09:00:00Z,NOT_CLOUDY,Palo Alto,5380748,US,15h,tahoecity.prod
,,3,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T12:00:00Z,NOT_CLOUDY,Palo Alto,5380748,US,15h,tahoecity.prod
,,3,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T15:00:00Z,CLOUDY,Palo Alto,5380748,US,15h,tahoecity.prod
,,3,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T18:00:00Z,CLOUDY,Palo Alto,5380748,US,15h,tahoecity.prod
,,3,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:00:00Z,CLOUDY,Palo Alto,5380748,US,15h,tahoecity.prod
,,3,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T09:00:00Z,NOT_CLOUDY,Palo Alto,5380748,US,18h,tahoecity.prod
,,3,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T12:00:00Z,NOT_CLOUDY,Palo Alto,5380748,US,18h,tahoecity.prod
,,3,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T15:00:00Z,CLOUDY,Palo Alto,5380748,US,18h,tahoecity.prod
,,3,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T18:00:00Z,CLOUDY,Palo Alto,5380748,US,18h,tahoecity.prod
,,3,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:00:00Z,CLOUDY,Palo Alto,5380748,US,18h,tahoecity.prod
,,3,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T15:00:00Z,NOT_CLOUDY,Palo Alto,5380748,US,24h,tahoecity.prod
,,3,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T18:00:00Z,CLOUDY,Palo Alto,5380748,US,24h,tahoecity.prod
,,3,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:00:00Z,NOT_CLOUDY,Palo Alto,5380748,US,24h,tahoecity.prod
,,3,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T18:00:00Z,NOT_CLOUDY,Palo Alto,5380748,US,27h,tahoecity.prod
,,3,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:00:00Z,NOT_CLOUDY,Palo Alto,5380748,US,27h,tahoecity.prod
,,3,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:00:00Z,NOT_CLOUDY,Palo Alto,5380748,US,30h,tahoecity.prod
,,3,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-24T18:00:00Z,NOT_CLOUDY,Palo Alto,5380748,US,3h,tahoecity.prod
,,3,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-24T21:00:00Z,CLOUDY,Palo Alto,5380748,US,3h,tahoecity.prod
,,3,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T00:00:00Z,NOT_CLOUDY,Palo Alto,5380748,US,3h,tahoecity.prod
,,3,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T03:00:00Z,CLOUDY,Palo Alto,5380748,US,3h,tahoecity.prod
,,3,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T06:00:00Z,CLOUDY,Palo Alto,5380748,US,3h,tahoecity.prod
,,3,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T09:00:00Z,CLOUDY,Palo Alto,5380748,US,3h,tahoecity.prod
,,3,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T12:00:00Z,CLOUDY,Palo Alto,5380748,US,3h,tahoecity.prod
,,3,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T15:00:00Z,CLOUDY,Palo Alto,5380748,US,3h,tahoecity.prod
,,3,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T18:00:00Z,CLOUDY,Palo Alto,5380748,US,3h,tahoecity.prod
,,3,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:00:00Z,CLOUDY,Palo Alto,5380748,US,3h,tahoecity.prod
,,3,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T12:00:00Z,NOT_CLOUDY,Palo Alto,5380748,US,21h,tahoecity.prod
,,3,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T15:00:00Z,CLOUDY,Palo Alto,5380748,US,21h,tahoecity.prod
,,3,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T18:00:00Z,CLOUDY,Palo Alto,5380748,US,21h,tahoecity.prod
,,3,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:00:00Z,CLOUDY,Palo Alto,5380748,US,21h,tahoecity.prod
,,3,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-24T21:00:00Z,NOT_CLOUDY,Palo Alto,5380748,US,6h,tahoecity.prod
,,3,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T00:00:00Z,CLOUDY,Palo Alto,5380748,US,6h,tahoecity.prod
,,3,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T03:00:00Z,NOT_CLOUDY,Palo Alto,5380748,US,6h,tahoecity.prod
,,3,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T06:00:00Z,CLOUDY,Palo Alto,5380748,US,6h,tahoecity.prod
,,3,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T09:00:00Z,CLOUDY,Palo Alto,5380748,US,6h,tahoecity.prod
,,3,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T12:00:00Z,CLOUDY,Palo Alto,5380748,US,6h,tahoecity.prod
,,3,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T15:00:00Z,CLOUDY,Palo Alto,5380748,US,6h,tahoecity.prod
,,3,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T18:00:00Z,CLOUDY,Palo Alto,5380748,US,6h,tahoecity.prod
,,3,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:00:00Z,CLOUDY,Palo Alto,5380748,US,6h,tahoecity.prod
,,3,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T00:00:00Z,NOT_CLOUDY,Palo Alto,5380748,US,9h,tahoecity.prod
,,3,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T03:00:00Z,NOT_CLOUDY,Palo Alto,5380748,US,9h,tahoecity.prod
,,3,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T06:00:00Z,NOT_CLOUDY,Palo Alto,5380748,US,9h,tahoecity.prod
,,3,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T09:00:00Z,NOT_CLOUDY,Palo Alto,5380748,US,9h,tahoecity.prod
,,3,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T12:00:00Z,CLOUDY,Palo Alto,5380748,US,9h,tahoecity.prod
,,3,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T15:00:00Z,CLOUDY,Palo Alto,5380748,US,9h,tahoecity.prod
,,3,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T18:00:00Z,CLOUDY,Palo Alto,5380748,US,9h,tahoecity.prod
,,3,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:00:00Z,CLOUDY,Palo Alto,5380748,US,9h,tahoecity.prod
,,4,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-24T17:13:09Z,CLOUDY,Pittsburgh,5206379,US,*,tahoecity.prod
,,4,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-24T18:14:35Z,CLOUDY,Pittsburgh,5206379,US,*,tahoecity.prod
,,4,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-24T19:13:20Z,CLOUDY,Pittsburgh,5206379,US,*,tahoecity.prod
,,4,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-24T20:13:13Z,NOT_CLOUDY,Pittsburgh,5206379,US,*,tahoecity.prod
,,4,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-24T21:13:27Z,CLOUDY,Pittsburgh,5206379,US,*,tahoecity.prod
,,4,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-24T22:13:10Z,CLOUDY,Pittsburgh,5206379,US,*,tahoecity.prod
,,4,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-24T23:13:19Z,CLOUDY,Pittsburgh,5206379,US,*,tahoecity.prod
,,4,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T00:13:21Z,CLOUDY,Pittsburgh,5206379,US,*,tahoecity.prod
,,4,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T01:13:17Z,CLOUDY,Pittsburgh,5206379,US,*,tahoecity.prod
,,4,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T02:13:17Z,CLOUDY,Pittsburgh,5206379,US,*,tahoecity.prod
,,4,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T03:13:11Z,CLOUDY,Pittsburgh,5206379,US,*,tahoecity.prod
,,4,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T04:13:07Z,CLOUDY,Pittsburgh,5206379,US,*,tahoecity.prod
,,4,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T05:13:47Z,CLOUDY,Pittsburgh,5206379,US,*,tahoecity.prod
,,4,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T06:13:21Z,CLOUDY,Pittsburgh,5206379,US,*,tahoecity.prod
,,4,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T07:13:20Z,CLOUDY,Pittsburgh,5206379,US,*,tahoecity.prod
,,4,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T08:13:24Z,CLOUDY,Pittsburgh,5206379,US,*,tahoecity.prod
,,4,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T09:13:18Z,CLOUDY,Pittsburgh,5206379,US,*,tahoecity.prod
,,4,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T10:13:18Z,CLOUDY,Pittsburgh,5206379,US,*,tahoecity.prod
,,4,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T11:13:23Z,CLOUDY,Pittsburgh,5206379,US,*,tahoecity.prod
,,4,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T12:13:12Z,CLOUDY,Pittsburgh,5206379,US,*,tahoecity.prod
,,4,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T13:13:17Z,CLOUDY,Pittsburgh,5206379,US,*,tahoecity.prod
,,4,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T14:13:22Z,CLOUDY,Pittsburgh,5206379,US,*,tahoecity.prod
,,4,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T15:13:26Z,CLOUDY,Pittsburgh,5206379,US,*,tahoecity.prod
,,4,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T16:13:30Z,CLOUDY,Pittsburgh,5206379,US,*,tahoecity.prod
,,4,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T17:13:23Z,CLOUDY,Pittsburgh,5206379,US,*,tahoecity.prod
,,4,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T18:14:17Z,CLOUDY,Pittsburgh,5206379,US,*,tahoecity.prod
,,4,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T19:13:20Z,CLOUDY,Pittsburgh,5206379,US,*,tahoecity.prod
,,4,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T20:13:15Z,CLOUDY,Pittsburgh,5206379,US,*,tahoecity.prod
,,4,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:13:12Z,CLOUDY,Pittsburgh,5206379,US,*,tahoecity.prod
,,4,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T22:13:14Z,CLOUDY,Pittsburgh,5206379,US,*,tahoecity.prod
,,4,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T23:13:01Z,CLOUDY,Pittsburgh,5206379,US,*,tahoecity.prod
,,4,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T03:00:00Z,CLOUDY,Pittsburgh,5206379,US,12h,tahoecity.prod
,,4,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T06:00:00Z,CLOUDY,Pittsburgh,5206379,US,12h,tahoecity.prod
,,4,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T09:00:00Z,CLOUDY,Pittsburgh,5206379,US,12h,tahoecity.prod
,,4,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T12:00:00Z,CLOUDY,Pittsburgh,5206379,US,12h,tahoecity.prod
,,4,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T15:00:00Z,CLOUDY,Pittsburgh,5206379,US,12h,tahoecity.prod
,,4,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T18:00:00Z,CLOUDY,Pittsburgh,5206379,US,12h,tahoecity.prod
,,4,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:00:00Z,CLOUDY,Pittsburgh,5206379,US,12h,tahoecity.prod
,,4,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T06:00:00Z,CLOUDY,Pittsburgh,5206379,US,15h,tahoecity.prod
,,4,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T09:00:00Z,CLOUDY,Pittsburgh,5206379,US,15h,tahoecity.prod
,,4,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T12:00:00Z,CLOUDY,Pittsburgh,5206379,US,15h,tahoecity.prod
,,4,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T15:00:00Z,CLOUDY,Pittsburgh,5206379,US,15h,tahoecity.prod
,,4,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T18:00:00Z,CLOUDY,Pittsburgh,5206379,US,15h,tahoecity.prod
,,4,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:00:00Z,CLOUDY,Pittsburgh,5206379,US,15h,tahoecity.prod
,,4,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T09:00:00Z,CLOUDY,Pittsburgh,5206379,US,18h,tahoecity.prod
,,4,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T12:00:00Z,CLOUDY,Pittsburgh,5206379,US,18h,tahoecity.prod
,,4,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T15:00:00Z,CLOUDY,Pittsburgh,5206379,US,18h,tahoecity.prod
,,4,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T18:00:00Z,CLOUDY,Pittsburgh,5206379,US,18h,tahoecity.prod
,,4,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:00:00Z,CLOUDY,Pittsburgh,5206379,US,18h,tahoecity.prod
,,4,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T12:00:00Z,CLOUDY,Pittsburgh,5206379,US,21h,tahoecity.prod
,,4,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T15:00:00Z,CLOUDY,Pittsburgh,5206379,US,21h,tahoecity.prod
,,4,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T18:00:00Z,CLOUDY,Pittsburgh,5206379,US,21h,tahoecity.prod
,,4,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:00:00Z,CLOUDY,Pittsburgh,5206379,US,21h,tahoecity.prod
,,4,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T15:00:00Z,CLOUDY,Pittsburgh,5206379,US,24h,tahoecity.prod
,,4,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T18:00:00Z,CLOUDY,Pittsburgh,5206379,US,24h,tahoecity.prod
,,4,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:00:00Z,CLOUDY,Pittsburgh,5206379,US,24h,tahoecity.prod
,,4,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T18:00:00Z,CLOUDY,Pittsburgh,5206379,US,27h,tahoecity.prod
,,4,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:00:00Z,CLOUDY,Pittsburgh,5206379,US,27h,tahoecity.prod
,,4,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:00:00Z,CLOUDY,Pittsburgh,5206379,US,30h,tahoecity.prod
,,4,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-24T18:00:00Z,CLOUDY,Pittsburgh,5206379,US,3h,tahoecity.prod
,,4,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-24T21:00:00Z,CLOUDY,Pittsburgh,5206379,US,3h,tahoecity.prod
,,4,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T00:00:00Z,CLOUDY,Pittsburgh,5206379,US,3h,tahoecity.prod
,,4,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T03:00:00Z,CLOUDY,Pittsburgh,5206379,US,3h,tahoecity.prod
,,4,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T06:00:00Z,CLOUDY,Pittsburgh,5206379,US,3h,tahoecity.prod
,,4,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T09:00:00Z,CLOUDY,Pittsburgh,5206379,US,3h,tahoecity.prod
,,4,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T12:00:00Z,CLOUDY,Pittsburgh,5206379,US,3h,tahoecity.prod
,,4,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T15:00:00Z,CLOUDY,Pittsburgh,5206379,US,3h,tahoecity.prod
,,4,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T18:00:00Z,CLOUDY,Pittsburgh,5206379,US,3h,tahoecity.prod
,,4,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:00:00Z,CLOUDY,Pittsburgh,5206379,US,3h,tahoecity.prod
,,4,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-24T21:00:00Z,CLOUDY,Pittsburgh,5206379,US,6h,tahoecity.prod
,,4,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T00:00:00Z,CLOUDY,Pittsburgh,5206379,US,6h,tahoecity.prod
,,4,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T03:00:00Z,CLOUDY,Pittsburgh,5206379,US,6h,tahoecity.prod
,,4,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T06:00:00Z,CLOUDY,Pittsburgh,5206379,US,6h,tahoecity.prod
,,4,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T09:00:00Z,CLOUDY,Pittsburgh,5206379,US,6h,tahoecity.prod
,,4,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T12:00:00Z,CLOUDY,Pittsburgh,5206379,US,6h,tahoecity.prod
,,4,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T15:00:00Z,CLOUDY,Pittsburgh,5206379,US,6h,tahoecity.prod
,,4,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T18:00:00Z,CLOUDY,Pittsburgh,5206379,US,6h,tahoecity.prod
,,4,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:00:00Z,CLOUDY,Pittsburgh,5206379,US,6h,tahoecity.prod
,,4,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T00:00:00Z,CLOUDY,Pittsburgh,5206379,US,9h,tahoecity.prod
,,4,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T03:00:00Z,CLOUDY,Pittsburgh,5206379,US,9h,tahoecity.prod
,,4,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T06:00:00Z,CLOUDY,Pittsburgh,5206379,US,9h,tahoecity.prod
,,4,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T09:00:00Z,CLOUDY,Pittsburgh,5206379,US,9h,tahoecity.prod
,,4,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T12:00:00Z,CLOUDY,Pittsburgh,5206379,US,9h,tahoecity.prod
,,4,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T15:00:00Z,CLOUDY,Pittsburgh,5206379,US,9h,tahoecity.prod
,,4,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T18:00:00Z,CLOUDY,Pittsburgh,5206379,US,9h,tahoecity.prod
,,4,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:00:00Z,CLOUDY,Pittsburgh,5206379,US,9h,tahoecity.prod
,,5,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-24T17:13:12Z,CLOUDY,San Francisco,5391959,US,*,tahoecity.prod
,,5,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-24T18:14:40Z,CLOUDY,San Francisco,5391959,US,*,tahoecity.prod
,,5,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-24T19:13:24Z,CLOUDY,San Francisco,5391959,US,*,tahoecity.prod
,,5,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-24T20:13:17Z,CLOUDY,San Francisco,5391959,US,*,tahoecity.prod
,,5,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-24T21:13:32Z,CLOUDY,San Francisco,5391959,US,*,tahoecity.prod
,,5,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-24T22:13:14Z,CLOUDY,San Francisco,5391959,US,*,tahoecity.prod
,,5,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-24T23:13:23Z,CLOUDY,San Francisco,5391959,US,*,tahoecity.prod
,,5,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T00:13:26Z,CLOUDY,San Francisco,5391959,US,*,tahoecity.prod
,,5,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T01:13:20Z,CLOUDY,San Francisco,5391959,US,*,tahoecity.prod
,,5,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T02:13:19Z,CLOUDY,San Francisco,5391959,US,*,tahoecity.prod
,,5,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T03:13:15Z,CLOUDY,San Francisco,5391959,US,*,tahoecity.prod
,,5,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T04:13:10Z,CLOUDY,San Francisco,5391959,US,*,tahoecity.prod
,,5,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T05:13:52Z,CLOUDY,San Francisco,5391959,US,*,tahoecity.prod
,,5,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T06:13:23Z,CLOUDY,San Francisco,5391959,US,*,tahoecity.prod
,,5,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T07:13:23Z,CLOUDY,San Francisco,5391959,US,*,tahoecity.prod
,,5,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T08:13:29Z,CLOUDY,San Francisco,5391959,US,*,tahoecity.prod
,,5,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T09:13:21Z,CLOUDY,San Francisco,5391959,US,*,tahoecity.prod
,,5,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T10:13:23Z,CLOUDY,San Francisco,5391959,US,*,tahoecity.prod
,,5,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T11:13:27Z,CLOUDY,San Francisco,5391959,US,*,tahoecity.prod
,,5,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T12:13:14Z,CLOUDY,San Francisco,5391959,US,*,tahoecity.prod
,,5,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T13:13:21Z,CLOUDY,San Francisco,5391959,US,*,tahoecity.prod
,,5,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T14:13:27Z,CLOUDY,San Francisco,5391959,US,*,tahoecity.prod
,,5,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T15:13:28Z,CLOUDY,San Francisco,5391959,US,*,tahoecity.prod
,,5,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T16:13:34Z,CLOUDY,San Francisco,5391959,US,*,tahoecity.prod
,,5,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T17:13:27Z,CLOUDY,San Francisco,5391959,US,*,tahoecity.prod
,,5,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T18:14:21Z,CLOUDY,San Francisco,5391959,US,*,tahoecity.prod
,,5,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T19:13:24Z,CLOUDY,San Francisco,5391959,US,*,tahoecity.prod
,,5,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T20:13:17Z,CLOUDY,San Francisco,5391959,US,*,tahoecity.prod
,,5,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:13:16Z,CLOUDY,San Francisco,5391959,US,*,tahoecity.prod
,,5,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T22:13:18Z,CLOUDY,San Francisco,5391959,US,*,tahoecity.prod
,,5,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T23:13:06Z,CLOUDY,San Francisco,5391959,US,*,tahoecity.prod
,,5,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T03:00:00Z,CLOUDY,San Francisco,5391959,US,12h,tahoecity.prod
,,5,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T06:00:00Z,CLOUDY,San Francisco,5391959,US,12h,tahoecity.prod
,,5,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T09:00:00Z,NOT_CLOUDY,San Francisco,5391959,US,12h,tahoecity.prod
,,5,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T12:00:00Z,CLOUDY,San Francisco,5391959,US,12h,tahoecity.prod
,,5,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T15:00:00Z,CLOUDY,San Francisco,5391959,US,12h,tahoecity.prod
,,5,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T18:00:00Z,CLOUDY,San Francisco,5391959,US,12h,tahoecity.prod
,,5,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:00:00Z,CLOUDY,San Francisco,5391959,US,12h,tahoecity.prod
,,5,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T06:00:00Z,NOT_CLOUDY,San Francisco,5391959,US,15h,tahoecity.prod
,,5,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T09:00:00Z,NOT_CLOUDY,San Francisco,5391959,US,15h,tahoecity.prod
,,5,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T12:00:00Z,NOT_CLOUDY,San Francisco,5391959,US,15h,tahoecity.prod
,,5,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T15:00:00Z,CLOUDY,San Francisco,5391959,US,15h,tahoecity.prod
,,5,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T18:00:00Z,CLOUDY,San Francisco,5391959,US,15h,tahoecity.prod
,,5,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:00:00Z,CLOUDY,San Francisco,5391959,US,15h,tahoecity.prod
,,5,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T09:00:00Z,NOT_CLOUDY,San Francisco,5391959,US,18h,tahoecity.prod
,,5,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T12:00:00Z,NOT_CLOUDY,San Francisco,5391959,US,18h,tahoecity.prod
,,5,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T15:00:00Z,CLOUDY,San Francisco,5391959,US,18h,tahoecity.prod
,,5,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T18:00:00Z,CLOUDY,San Francisco,5391959,US,18h,tahoecity.prod
,,5,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:00:00Z,CLOUDY,San Francisco,5391959,US,18h,tahoecity.prod
,,5,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T12:00:00Z,NOT_CLOUDY,San Francisco,5391959,US,21h,tahoecity.prod
,,5,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T15:00:00Z,CLOUDY,San Francisco,5391959,US,21h,tahoecity.prod
,,5,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T18:00:00Z,CLOUDY,San Francisco,5391959,US,21h,tahoecity.prod
,,5,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:00:00Z,CLOUDY,San Francisco,5391959,US,21h,tahoecity.prod
,,5,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T15:00:00Z,NOT_CLOUDY,San Francisco,5391959,US,24h,tahoecity.prod
,,5,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T18:00:00Z,CLOUDY,San Francisco,5391959,US,24h,tahoecity.prod
,,5,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:00:00Z,NOT_CLOUDY,San Francisco,5391959,US,24h,tahoecity.prod
,,5,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T18:00:00Z,NOT_CLOUDY,San Francisco,5391959,US,27h,tahoecity.prod
,,5,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:00:00Z,NOT_CLOUDY,San Francisco,5391959,US,27h,tahoecity.prod
,,5,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:00:00Z,NOT_CLOUDY,San Francisco,5391959,US,30h,tahoecity.prod
,,5,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-24T18:00:00Z,CLOUDY,San Francisco,5391959,US,3h,tahoecity.prod
,,5,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-24T21:00:00Z,CLOUDY,San Francisco,5391959,US,3h,tahoecity.prod
,,5,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T00:00:00Z,CLOUDY,San Francisco,5391959,US,3h,tahoecity.prod
,,5,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T03:00:00Z,CLOUDY,San Francisco,5391959,US,3h,tahoecity.prod
,,5,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T06:00:00Z,CLOUDY,San Francisco,5391959,US,3h,tahoecity.prod
,,5,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T09:00:00Z,CLOUDY,San Francisco,5391959,US,3h,tahoecity.prod
,,5,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T12:00:00Z,CLOUDY,San Francisco,5391959,US,3h,tahoecity.prod
,,5,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T15:00:00Z,CLOUDY,San Francisco,5391959,US,3h,tahoecity.prod
,,5,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T18:00:00Z,CLOUDY,San Francisco,5391959,US,3h,tahoecity.prod
,,5,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:00:00Z,CLOUDY,San Francisco,5391959,US,3h,tahoecity.prod
,,5,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-24T21:00:00Z,CLOUDY,San Francisco,5391959,US,6h,tahoecity.prod
,,5,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T00:00:00Z,CLOUDY,San Francisco,5391959,US,6h,tahoecity.prod
,,5,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T03:00:00Z,CLOUDY,San Francisco,5391959,US,6h,tahoecity.prod
,,5,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T06:00:00Z,CLOUDY,San Francisco,5391959,US,6h,tahoecity.prod
,,5,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T09:00:00Z,CLOUDY,San Francisco,5391959,US,6h,tahoecity.prod
,,5,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T12:00:00Z,CLOUDY,San Francisco,5391959,US,6h,tahoecity.prod
,,5,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T15:00:00Z,CLOUDY,San Francisco,5391959,US,6h,tahoecity.prod
,,5,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T18:00:00Z,CLOUDY,San Francisco,5391959,US,6h,tahoecity.prod
,,5,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:00:00Z,CLOUDY,San Francisco,5391959,US,6h,tahoecity.prod
,,5,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T00:00:00Z,CLOUDY,San Francisco,5391959,US,9h,tahoecity.prod
,,5,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T03:00:00Z,CLOUDY,San Francisco,5391959,US,9h,tahoecity.prod
,,5,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T06:00:00Z,CLOUDY,San Francisco,5391959,US,9h,tahoecity.prod
,,5,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T09:00:00Z,CLOUDY,San Francisco,5391959,US,9h,tahoecity.prod
,,5,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T12:00:00Z,CLOUDY,San Francisco,5391959,US,9h,tahoecity.prod
,,5,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T15:00:00Z,CLOUDY,San Francisco,5391959,US,9h,tahoecity.prod
,,5,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T18:00:00Z,CLOUDY,San Francisco,5391959,US,9h,tahoecity.prod
,,5,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:00:00Z,CLOUDY,San Francisco,5391959,US,9h,tahoecity.prod
,,6,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-24T17:13:12Z,CLOUDY,San Jose,5392171,US,*,tahoecity.prod
,,6,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-24T18:14:40Z,CLOUDY,San Jose,5392171,US,*,tahoecity.prod
,,6,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-24T19:13:24Z,CLOUDY,San Jose,5392171,US,*,tahoecity.prod
,,6,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-24T20:13:17Z,CLOUDY,San Jose,5392171,US,*,tahoecity.prod
,,6,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-24T21:13:32Z,CLOUDY,San Jose,5392171,US,*,tahoecity.prod
,,6,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-24T22:13:14Z,CLOUDY,San Jose,5392171,US,*,tahoecity.prod
,,6,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-24T23:13:23Z,CLOUDY,San Jose,5392171,US,*,tahoecity.prod
,,6,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T00:13:26Z,CLOUDY,San Jose,5392171,US,*,tahoecity.prod
,,6,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T01:13:20Z,CLOUDY,San Jose,5392171,US,*,tahoecity.prod
,,6,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T02:13:19Z,CLOUDY,San Jose,5392171,US,*,tahoecity.prod
,,6,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T03:13:15Z,CLOUDY,San Jose,5392171,US,*,tahoecity.prod
,,6,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T04:13:10Z,CLOUDY,San Jose,5392171,US,*,tahoecity.prod
,,6,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T05:13:52Z,CLOUDY,San Jose,5392171,US,*,tahoecity.prod
,,6,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T06:13:23Z,CLOUDY,San Jose,5392171,US,*,tahoecity.prod
,,6,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T07:13:23Z,CLOUDY,San Jose,5392171,US,*,tahoecity.prod
,,6,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T08:13:29Z,CLOUDY,San Jose,5392171,US,*,tahoecity.prod
,,6,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T09:13:21Z,CLOUDY,San Jose,5392171,US,*,tahoecity.prod
,,6,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T10:13:23Z,CLOUDY,San Jose,5392171,US,*,tahoecity.prod
,,6,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T11:13:28Z,CLOUDY,San Jose,5392171,US,*,tahoecity.prod
,,6,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T12:13:14Z,CLOUDY,San Jose,5392171,US,*,tahoecity.prod
,,6,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T13:13:21Z,CLOUDY,San Jose,5392171,US,*,tahoecity.prod
,,6,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T14:13:27Z,CLOUDY,San Jose,5392171,US,*,tahoecity.prod
,,6,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T15:13:28Z,CLOUDY,San Jose,5392171,US,*,tahoecity.prod
,,6,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T16:13:34Z,CLOUDY,San Jose,5392171,US,*,tahoecity.prod
,,6,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T17:13:27Z,CLOUDY,San Jose,5392171,US,*,tahoecity.prod
,,6,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T18:14:21Z,CLOUDY,San Jose,5392171,US,*,tahoecity.prod
,,6,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T19:13:24Z,NOT_CLOUDY,San Jose,5392171,US,*,tahoecity.prod
,,6,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T20:13:17Z,NOT_CLOUDY,San Jose,5392171,US,*,tahoecity.prod
,,6,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:13:16Z,CLOUDY,San Jose,5392171,US,*,tahoecity.prod
,,6,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T22:13:18Z,CLOUDY,San Jose,5392171,US,*,tahoecity.prod
,,6,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T23:13:06Z,NOT_CLOUDY,San Jose,5392171,US,*,tahoecity.prod
,,6,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T03:00:00Z,CLOUDY,San Jose,5392171,US,12h,tahoecity.prod
,,6,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T06:00:00Z,CLOUDY,San Jose,5392171,US,12h,tahoecity.prod
,,6,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T09:00:00Z,CLOUDY,San Jose,5392171,US,12h,tahoecity.prod
,,6,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T12:00:00Z,CLOUDY,San Jose,5392171,US,12h,tahoecity.prod
,,6,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T15:00:00Z,CLOUDY,San Jose,5392171,US,12h,tahoecity.prod
,,6,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T18:00:00Z,CLOUDY,San Jose,5392171,US,12h,tahoecity.prod
,,6,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:00:00Z,CLOUDY,San Jose,5392171,US,12h,tahoecity.prod
,,6,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T06:00:00Z,NOT_CLOUDY,San Jose,5392171,US,15h,tahoecity.prod
,,6,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T09:00:00Z,NOT_CLOUDY,San Jose,5392171,US,15h,tahoecity.prod
,,6,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T12:00:00Z,CLOUDY,San Jose,5392171,US,15h,tahoecity.prod
,,6,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T15:00:00Z,CLOUDY,San Jose,5392171,US,15h,tahoecity.prod
,,6,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T18:00:00Z,CLOUDY,San Jose,5392171,US,15h,tahoecity.prod
,,6,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:00:00Z,NOT_CLOUDY,San Jose,5392171,US,15h,tahoecity.prod
,,6,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T09:00:00Z,NOT_CLOUDY,San Jose,5392171,US,18h,tahoecity.prod
,,6,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T12:00:00Z,CLOUDY,San Jose,5392171,US,18h,tahoecity.prod
,,6,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T15:00:00Z,CLOUDY,San Jose,5392171,US,18h,tahoecity.prod
,,6,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T18:00:00Z,CLOUDY,San Jose,5392171,US,18h,tahoecity.prod
,,6,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:00:00Z,NOT_CLOUDY,San Jose,5392171,US,18h,tahoecity.prod
,,6,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T12:00:00Z,NOT_CLOUDY,San Jose,5392171,US,21h,tahoecity.prod
,,6,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T15:00:00Z,CLOUDY,San Jose,5392171,US,21h,tahoecity.prod
,,6,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T18:00:00Z,CLOUDY,San Jose,5392171,US,21h,tahoecity.prod
,,6,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:00:00Z,NOT_CLOUDY,San Jose,5392171,US,21h,tahoecity.prod
,,6,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T15:00:00Z,NOT_CLOUDY,San Jose,5392171,US,24h,tahoecity.prod
,,6,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T18:00:00Z,CLOUDY,San Jose,5392171,US,24h,tahoecity.prod
,,6,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:00:00Z,NOT_CLOUDY,San Jose,5392171,US,24h,tahoecity.prod
,,6,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T18:00:00Z,NOT_CLOUDY,San Jose,5392171,US,27h,tahoecity.prod
,,6,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:00:00Z,NOT_CLOUDY,San Jose,5392171,US,27h,tahoecity.prod
,,6,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:00:00Z,NOT_CLOUDY,San Jose,5392171,US,30h,tahoecity.prod
,,6,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-24T18:00:00Z,CLOUDY,San Jose,5392171,US,3h,tahoecity.prod
,,6,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-24T21:00:00Z,CLOUDY,San Jose,5392171,US,3h,tahoecity.prod
,,6,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T00:00:00Z,CLOUDY,San Jose,5392171,US,3h,tahoecity.prod
,,6,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T03:00:00Z,CLOUDY,San Jose,5392171,US,3h,tahoecity.prod
,,6,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T06:00:00Z,CLOUDY,San Jose,5392171,US,3h,tahoecity.prod
,,6,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T09:00:00Z,CLOUDY,San Jose,5392171,US,3h,tahoecity.prod
,,6,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T12:00:00Z,CLOUDY,San Jose,5392171,US,3h,tahoecity.prod
,,6,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T15:00:00Z,CLOUDY,San Jose,5392171,US,3h,tahoecity.prod
,,6,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T18:00:00Z,CLOUDY,San Jose,5392171,US,3h,tahoecity.prod
,,6,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:00:00Z,CLOUDY,San Jose,5392171,US,3h,tahoecity.prod
,,6,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-24T21:00:00Z,CLOUDY,San Jose,5392171,US,6h,tahoecity.prod
,,6,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T00:00:00Z,CLOUDY,San Jose,5392171,US,6h,tahoecity.prod
,,6,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T03:00:00Z,CLOUDY,San Jose,5392171,US,6h,tahoecity.prod
,,6,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T06:00:00Z,CLOUDY,San Jose,5392171,US,6h,tahoecity.prod
,,6,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T09:00:00Z,CLOUDY,San Jose,5392171,US,6h,tahoecity.prod
,,6,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T12:00:00Z,CLOUDY,San Jose,5392171,US,6h,tahoecity.prod
,,6,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T15:00:00Z,CLOUDY,San Jose,5392171,US,6h,tahoecity.prod
,,6,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T18:00:00Z,CLOUDY,San Jose,5392171,US,6h,tahoecity.prod
,,6,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:00:00Z,CLOUDY,San Jose,5392171,US,6h,tahoecity.prod
,,6,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T00:00:00Z,CLOUDY,San Jose,5392171,US,9h,tahoecity.prod
,,6,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T03:00:00Z,CLOUDY,San Jose,5392171,US,9h,tahoecity.prod
,,6,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T06:00:00Z,CLOUDY,San Jose,5392171,US,9h,tahoecity.prod
,,6,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T09:00:00Z,CLOUDY,San Jose,5392171,US,9h,tahoecity.prod
,,6,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T12:00:00Z,CLOUDY,San Jose,5392171,US,9h,tahoecity.prod
,,6,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T15:00:00Z,CLOUDY,San Jose,5392171,US,9h,tahoecity.prod
,,6,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T18:00:00Z,CLOUDY,San Jose,5392171,US,9h,tahoecity.prod
,,6,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:00:00Z,CLOUDY,San Jose,5392171,US,9h,tahoecity.prod
,,7,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-24T17:13:16Z,CLOUDY,Seattle,5809844,US,*,tahoecity.prod
,,7,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-24T18:14:44Z,CLOUDY,Seattle,5809844,US,*,tahoecity.prod
,,7,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-24T19:13:29Z,CLOUDY,Seattle,5809844,US,*,tahoecity.prod
,,7,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-24T20:13:22Z,CLOUDY,Seattle,5809844,US,*,tahoecity.prod
,,7,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-24T21:13:38Z,CLOUDY,Seattle,5809844,US,*,tahoecity.prod
,,7,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-24T22:13:19Z,CLOUDY,Seattle,5809844,US,*,tahoecity.prod
,,7,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-24T23:13:27Z,CLOUDY,Seattle,5809844,US,*,tahoecity.prod
,,7,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T00:13:31Z,CLOUDY,Seattle,5809844,US,*,tahoecity.prod
,,7,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T01:13:26Z,CLOUDY,Seattle,5809844,US,*,tahoecity.prod
,,7,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T02:13:23Z,CLOUDY,Seattle,5809844,US,*,tahoecity.prod
,,7,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T03:13:19Z,CLOUDY,Seattle,5809844,US,*,tahoecity.prod
,,7,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T04:13:15Z,CLOUDY,Seattle,5809844,US,*,tahoecity.prod
,,7,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T05:13:58Z,CLOUDY,Seattle,5809844,US,*,tahoecity.prod
,,7,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T06:13:28Z,CLOUDY,Seattle,5809844,US,*,tahoecity.prod
,,7,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T07:13:26Z,CLOUDY,Seattle,5809844,US,*,tahoecity.prod
,,7,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T08:13:34Z,CLOUDY,Seattle,5809844,US,*,tahoecity.prod
,,7,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T09:13:25Z,CLOUDY,Seattle,5809844,US,*,tahoecity.prod
,,7,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T10:13:28Z,CLOUDY,Seattle,5809844,US,*,tahoecity.prod
,,7,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T11:13:33Z,CLOUDY,Seattle,5809844,US,*,tahoecity.prod
,,7,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T12:13:19Z,CLOUDY,Seattle,5809844,US,*,tahoecity.prod
,,7,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T13:13:26Z,CLOUDY,Seattle,5809844,US,*,tahoecity.prod
,,7,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T14:13:32Z,CLOUDY,Seattle,5809844,US,*,tahoecity.prod
,,7,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T15:13:30Z,CLOUDY,Seattle,5809844,US,*,tahoecity.prod
,,7,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T16:13:36Z,CLOUDY,Seattle,5809844,US,*,tahoecity.prod
,,7,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T17:13:33Z,CLOUDY,Seattle,5809844,US,*,tahoecity.prod
,,7,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T18:14:28Z,CLOUDY,Seattle,5809844,US,*,tahoecity.prod
,,7,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T19:13:27Z,CLOUDY,Seattle,5809844,US,*,tahoecity.prod
,,7,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T20:13:22Z,CLOUDY,Seattle,5809844,US,*,tahoecity.prod
,,7,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:13:22Z,CLOUDY,Seattle,5809844,US,*,tahoecity.prod
,,7,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T22:13:23Z,CLOUDY,Seattle,5809844,US,*,tahoecity.prod
,,7,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T23:13:08Z,CLOUDY,Seattle,5809844,US,*,tahoecity.prod
,,7,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T03:00:00Z,CLOUDY,Seattle,5809844,US,12h,tahoecity.prod
,,7,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T06:00:00Z,CLOUDY,Seattle,5809844,US,12h,tahoecity.prod
,,7,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T09:00:00Z,NOT_CLOUDY,Seattle,5809844,US,12h,tahoecity.prod
,,7,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T12:00:00Z,CLOUDY,Seattle,5809844,US,12h,tahoecity.prod
,,7,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T15:00:00Z,CLOUDY,Seattle,5809844,US,12h,tahoecity.prod
,,7,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T18:00:00Z,CLOUDY,Seattle,5809844,US,12h,tahoecity.prod
,,7,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:00:00Z,CLOUDY,Seattle,5809844,US,12h,tahoecity.prod
,,7,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T06:00:00Z,CLOUDY,Seattle,5809844,US,15h,tahoecity.prod
,,7,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T09:00:00Z,NOT_CLOUDY,Seattle,5809844,US,15h,tahoecity.prod
,,7,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T12:00:00Z,NOT_CLOUDY,Seattle,5809844,US,15h,tahoecity.prod
,,7,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T15:00:00Z,CLOUDY,Seattle,5809844,US,15h,tahoecity.prod
,,7,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T18:00:00Z,CLOUDY,Seattle,5809844,US,15h,tahoecity.prod
,,7,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:00:00Z,CLOUDY,Seattle,5809844,US,15h,tahoecity.prod
,,7,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T09:00:00Z,NOT_CLOUDY,Seattle,5809844,US,18h,tahoecity.prod
,,7,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T12:00:00Z,NOT_CLOUDY,Seattle,5809844,US,18h,tahoecity.prod
,,7,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T15:00:00Z,CLOUDY,Seattle,5809844,US,18h,tahoecity.prod
,,7,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T18:00:00Z,CLOUDY,Seattle,5809844,US,18h,tahoecity.prod
,,7,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:00:00Z,NOT_CLOUDY,Seattle,5809844,US,18h,tahoecity.prod
,,7,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T12:00:00Z,NOT_CLOUDY,Seattle,5809844,US,21h,tahoecity.prod
,,7,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T15:00:00Z,CLOUDY,Seattle,5809844,US,21h,tahoecity.prod
,,7,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T18:00:00Z,CLOUDY,Seattle,5809844,US,21h,tahoecity.prod
,,7,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:00:00Z,NOT_CLOUDY,Seattle,5809844,US,21h,tahoecity.prod
,,7,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T15:00:00Z,CLOUDY,Seattle,5809844,US,24h,tahoecity.prod
,,7,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T18:00:00Z,CLOUDY,Seattle,5809844,US,24h,tahoecity.prod
,,7,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:00:00Z,NOT_CLOUDY,Seattle,5809844,US,24h,tahoecity.prod
,,7,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T18:00:00Z,CLOUDY,Seattle,5809844,US,27h,tahoecity.prod
,,7,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:00:00Z,NOT_CLOUDY,Seattle,5809844,US,27h,tahoecity.prod
,,7,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:00:00Z,NOT_CLOUDY,Seattle,5809844,US,30h,tahoecity.prod
,,7,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-24T18:00:00Z,CLOUDY,Seattle,5809844,US,3h,tahoecity.prod
,,7,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-24T21:00:00Z,CLOUDY,Seattle,5809844,US,3h,tahoecity.prod
,,7,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T00:00:00Z,CLOUDY,Seattle,5809844,US,3h,tahoecity.prod
,,7,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T03:00:00Z,CLOUDY,Seattle,5809844,US,3h,tahoecity.prod
,,7,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T06:00:00Z,CLOUDY,Seattle,5809844,US,3h,tahoecity.prod
,,7,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T09:00:00Z,CLOUDY,Seattle,5809844,US,3h,tahoecity.prod
,,7,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T12:00:00Z,CLOUDY,Seattle,5809844,US,3h,tahoecity.prod
,,7,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T15:00:00Z,CLOUDY,Seattle,5809844,US,3h,tahoecity.prod
,,7,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T18:00:00Z,CLOUDY,Seattle,5809844,US,3h,tahoecity.prod
,,7,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:00:00Z,CLOUDY,Seattle,5809844,US,3h,tahoecity.prod
,,7,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-24T21:00:00Z,CLOUDY,Seattle,5809844,US,6h,tahoecity.prod
,,7,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T00:00:00Z,CLOUDY,Seattle,5809844,US,6h,tahoecity.prod
,,7,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T03:00:00Z,CLOUDY,Seattle,5809844,US,6h,tahoecity.prod
,,7,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T06:00:00Z,CLOUDY,Seattle,5809844,US,6h,tahoecity.prod
,,7,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T09:00:00Z,CLOUDY,Seattle,5809844,US,6h,tahoecity.prod
,,7,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T12:00:00Z,NOT_CLOUDY,Seattle,5809844,US,6h,tahoecity.prod
,,7,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T15:00:00Z,CLOUDY,Seattle,5809844,US,6h,tahoecity.prod
,,7,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T18:00:00Z,CLOUDY,Seattle,5809844,US,6h,tahoecity.prod
,,7,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:00:00Z,CLOUDY,Seattle,5809844,US,6h,tahoecity.prod
,,7,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T00:00:00Z,CLOUDY,Seattle,5809844,US,9h,tahoecity.prod
,,7,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T03:00:00Z,CLOUDY,Seattle,5809844,US,9h,tahoecity.prod
,,7,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T06:00:00Z,CLOUDY,Seattle,5809844,US,9h,tahoecity.prod
,,7,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T09:00:00Z,CLOUDY,Seattle,5809844,US,9h,tahoecity.prod
,,7,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T12:00:00Z,CLOUDY,Seattle,5809844,US,9h,tahoecity.prod
,,7,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T15:00:00Z,CLOUDY,Seattle,5809844,US,9h,tahoecity.prod
,,7,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T18:00:00Z,CLOUDY,Seattle,5809844,US,9h,tahoecity.prod
,,7,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:00:00Z,CLOUDY,Seattle,5809844,US,9h,tahoecity.prod
,,8,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-24T17:14:25Z,CLOUDY,Sunnyside-Tahoe City,7262635,US,*,tahoecity.prod
,,8,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-24T18:15:26Z,CLOUDY,Sunnyside-Tahoe City,7262635,US,*,tahoecity.prod
,,8,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-24T19:14:39Z,CLOUDY,Sunnyside-Tahoe City,7262635,US,*,tahoecity.prod
,,8,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-24T20:14:14Z,CLOUDY,Sunnyside-Tahoe City,7262635,US,*,tahoecity.prod
,,8,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-24T21:14:35Z,CLOUDY,Sunnyside-Tahoe City,7262635,US,*,tahoecity.prod
,,8,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-24T22:14:24Z,NOT_CLOUDY,Sunnyside-Tahoe City,7262635,US,*,tahoecity.prod
,,8,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-24T23:14:26Z,CLOUDY,Sunnyside-Tahoe City,7262635,US,*,tahoecity.prod
,,8,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T00:14:31Z,CLOUDY,Sunnyside-Tahoe City,7262635,US,*,tahoecity.prod
,,8,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T01:14:20Z,NOT_CLOUDY,Sunnyside-Tahoe City,7262635,US,*,tahoecity.prod
,,8,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T02:14:19Z,CLOUDY,Sunnyside-Tahoe City,7262635,US,*,tahoecity.prod
,,8,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T03:14:13Z,CLOUDY,Sunnyside-Tahoe City,7262635,US,*,tahoecity.prod
,,8,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T04:14:09Z,CLOUDY,Sunnyside-Tahoe City,7262635,US,*,tahoecity.prod
,,8,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T05:15:05Z,CLOUDY,Sunnyside-Tahoe City,7262635,US,*,tahoecity.prod
,,8,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T06:14:19Z,CLOUDY,Sunnyside-Tahoe City,7262635,US,*,tahoecity.prod
,,8,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T07:14:17Z,CLOUDY,Sunnyside-Tahoe City,7262635,US,*,tahoecity.prod
,,8,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T08:14:25Z,CLOUDY,Sunnyside-Tahoe City,7262635,US,*,tahoecity.prod
,,8,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T09:14:22Z,CLOUDY,Sunnyside-Tahoe City,7262635,US,*,tahoecity.prod
,,8,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T10:14:27Z,CLOUDY,Sunnyside-Tahoe City,7262635,US,*,tahoecity.prod
,,8,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T11:14:21Z,CLOUDY,Sunnyside-Tahoe City,7262635,US,*,tahoecity.prod
,,8,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T12:14:15Z,CLOUDY,Sunnyside-Tahoe City,7262635,US,*,tahoecity.prod
,,8,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T13:14:19Z,CLOUDY,Sunnyside-Tahoe City,7262635,US,*,tahoecity.prod
,,8,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T14:14:33Z,CLOUDY,Sunnyside-Tahoe City,7262635,US,*,tahoecity.prod
,,8,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T15:14:26Z,CLOUDY,Sunnyside-Tahoe City,7262635,US,*,tahoecity.prod
,,8,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T16:14:38Z,CLOUDY,Sunnyside-Tahoe City,7262635,US,*,tahoecity.prod
,,8,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T17:14:43Z,NOT_CLOUDY,Sunnyside-Tahoe City,7262635,US,*,tahoecity.prod
,,8,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T18:15:34Z,CLOUDY,Sunnyside-Tahoe City,7262635,US,*,tahoecity.prod
,,8,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T19:14:26Z,CLOUDY,Sunnyside-Tahoe City,7262635,US,*,tahoecity.prod
,,8,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T20:14:19Z,CLOUDY,Sunnyside-Tahoe City,7262635,US,*,tahoecity.prod
,,8,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:14:20Z,CLOUDY,Sunnyside-Tahoe City,7262635,US,*,tahoecity.prod
,,8,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T22:14:21Z,CLOUDY,Sunnyside-Tahoe City,7262635,US,*,tahoecity.prod
,,8,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T23:14:03Z,CLOUDY,Sunnyside-Tahoe City,7262635,US,*,tahoecity.prod
,,8,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T06:00:00Z,CLOUDY,Sunnyside-Tahoe City,7262635,US,15h,tahoecity.prod
,,8,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T09:00:00Z,NOT_CLOUDY,Sunnyside-Tahoe City,7262635,US,15h,tahoecity.prod
,,8,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T12:00:00Z,NOT_CLOUDY,Sunnyside-Tahoe City,7262635,US,15h,tahoecity.prod
,,8,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T15:00:00Z,NOT_CLOUDY,Sunnyside-Tahoe City,7262635,US,15h,tahoecity.prod
,,8,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T18:00:00Z,NOT_CLOUDY,Sunnyside-Tahoe City,7262635,US,15h,tahoecity.prod
,,8,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:00:00Z,CLOUDY,Sunnyside-Tahoe City,7262635,US,15h,tahoecity.prod
,,8,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T03:00:00Z,CLOUDY,Sunnyside-Tahoe City,7262635,US,12h,tahoecity.prod
,,8,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T06:00:00Z,CLOUDY,Sunnyside-Tahoe City,7262635,US,12h,tahoecity.prod
,,8,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T09:00:00Z,NOT_CLOUDY,Sunnyside-Tahoe City,7262635,US,12h,tahoecity.prod
,,8,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T12:00:00Z,CLOUDY,Sunnyside-Tahoe City,7262635,US,12h,tahoecity.prod
,,8,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T15:00:00Z,NOT_CLOUDY,Sunnyside-Tahoe City,7262635,US,12h,tahoecity.prod
,,8,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T18:00:00Z,NOT_CLOUDY,Sunnyside-Tahoe City,7262635,US,12h,tahoecity.prod
,,8,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:00:00Z,CLOUDY,Sunnyside-Tahoe City,7262635,US,12h,tahoecity.prod
,,8,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T09:00:00Z,NOT_CLOUDY,Sunnyside-Tahoe City,7262635,US,18h,tahoecity.prod
,,8,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T12:00:00Z,NOT_CLOUDY,Sunnyside-Tahoe City,7262635,US,18h,tahoecity.prod
,,8,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T15:00:00Z,NOT_CLOUDY,Sunnyside-Tahoe City,7262635,US,18h,tahoecity.prod
,,8,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T18:00:00Z,NOT_CLOUDY,Sunnyside-Tahoe City,7262635,US,18h,tahoecity.prod
,,8,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:00:00Z,CLOUDY,Sunnyside-Tahoe City,7262635,US,18h,tahoecity.prod
,,8,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T12:00:00Z,NOT_CLOUDY,Sunnyside-Tahoe City,7262635,US,21h,tahoecity.prod
,,8,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T15:00:00Z,NOT_CLOUDY,Sunnyside-Tahoe City,7262635,US,21h,tahoecity.prod
,,8,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T18:00:00Z,NOT_CLOUDY,Sunnyside-Tahoe City,7262635,US,21h,tahoecity.prod
,,8,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:00:00Z,CLOUDY,Sunnyside-Tahoe City,7262635,US,21h,tahoecity.prod
,,8,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T15:00:00Z,NOT_CLOUDY,Sunnyside-Tahoe City,7262635,US,24h,tahoecity.prod
,,8,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T18:00:00Z,NOT_CLOUDY,Sunnyside-Tahoe City,7262635,US,24h,tahoecity.prod
,,8,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:00:00Z,CLOUDY,Sunnyside-Tahoe City,7262635,US,24h,tahoecity.prod
,,8,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T18:00:00Z,NOT_CLOUDY,Sunnyside-Tahoe City,7262635,US,27h,tahoecity.prod
,,8,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:00:00Z,CLOUDY,Sunnyside-Tahoe City,7262635,US,27h,tahoecity.prod
,,8,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:00:00Z,CLOUDY,Sunnyside-Tahoe City,7262635,US,30h,tahoecity.prod
,,8,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-24T18:00:00Z,CLOUDY,Sunnyside-Tahoe City,7262635,US,3h,tahoecity.prod
,,8,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-24T21:00:00Z,CLOUDY,Sunnyside-Tahoe City,7262635,US,3h,tahoecity.prod
,,8,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T00:00:00Z,CLOUDY,Sunnyside-Tahoe City,7262635,US,3h,tahoecity.prod
,,8,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T03:00:00Z,CLOUDY,Sunnyside-Tahoe City,7262635,US,3h,tahoecity.prod
,,8,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T06:00:00Z,CLOUDY,Sunnyside-Tahoe City,7262635,US,3h,tahoecity.prod
,,8,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T09:00:00Z,CLOUDY,Sunnyside-Tahoe City,7262635,US,3h,tahoecity.prod
,,8,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T12:00:00Z,CLOUDY,Sunnyside-Tahoe City,7262635,US,3h,tahoecity.prod
,,8,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T15:00:00Z,CLOUDY,Sunnyside-Tahoe City,7262635,US,3h,tahoecity.prod
,,8,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T18:00:00Z,CLOUDY,Sunnyside-Tahoe City,7262635,US,3h,tahoecity.prod
,,8,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:00:00Z,CLOUDY,Sunnyside-Tahoe City,7262635,US,3h,tahoecity.prod
,,8,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-24T21:00:00Z,CLOUDY,Sunnyside-Tahoe City,7262635,US,6h,tahoecity.prod
,,8,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T00:00:00Z,CLOUDY,Sunnyside-Tahoe City,7262635,US,6h,tahoecity.prod
,,8,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T03:00:00Z,CLOUDY,Sunnyside-Tahoe City,7262635,US,6h,tahoecity.prod
,,8,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T06:00:00Z,CLOUDY,Sunnyside-Tahoe City,7262635,US,6h,tahoecity.prod
,,8,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T09:00:00Z,CLOUDY,Sunnyside-Tahoe City,7262635,US,6h,tahoecity.prod
,,8,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T12:00:00Z,NOT_CLOUDY,Sunnyside-Tahoe City,7262635,US,6h,tahoecity.prod
,,8,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T15:00:00Z,NOT_CLOUDY,Sunnyside-Tahoe City,7262635,US,6h,tahoecity.prod
,,8,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T18:00:00Z,CLOUDY,Sunnyside-Tahoe City,7262635,US,6h,tahoecity.prod
,,8,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:00:00Z,CLOUDY,Sunnyside-Tahoe City,7262635,US,6h,tahoecity.prod
,,8,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T00:00:00Z,CLOUDY,Sunnyside-Tahoe City,7262635,US,9h,tahoecity.prod
,,8,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T03:00:00Z,CLOUDY,Sunnyside-Tahoe City,7262635,US,9h,tahoecity.prod
,,8,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T06:00:00Z,CLOUDY,Sunnyside-Tahoe City,7262635,US,9h,tahoecity.prod
,,8,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T09:00:00Z,CLOUDY,Sunnyside-Tahoe City,7262635,US,9h,tahoecity.prod
,,8,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T12:00:00Z,CLOUDY,Sunnyside-Tahoe City,7262635,US,9h,tahoecity.prod
,,8,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T15:00:00Z,NOT_CLOUDY,Sunnyside-Tahoe City,7262635,US,9h,tahoecity.prod
,,8,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T18:00:00Z,NOT_CLOUDY,Sunnyside-Tahoe City,7262635,US,9h,tahoecity.prod
,,8,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:00:00Z,CLOUDY,Sunnyside-Tahoe City,7262635,US,9h,tahoecity.prod
,,9,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T03:00:00Z,NOT_CLOUDY,Yosemite Valley,7262586,US,12h,tahoecity.prod
,,9,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T06:00:00Z,NOT_CLOUDY,Yosemite Valley,7262586,US,12h,tahoecity.prod
,,9,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T09:00:00Z,NOT_CLOUDY,Yosemite Valley,7262586,US,12h,tahoecity.prod
,,9,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T12:00:00Z,NOT_CLOUDY,Yosemite Valley,7262586,US,12h,tahoecity.prod
,,9,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T15:00:00Z,NOT_CLOUDY,Yosemite Valley,7262586,US,12h,tahoecity.prod
,,9,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T18:00:00Z,NOT_CLOUDY,Yosemite Valley,7262586,US,12h,tahoecity.prod
,,9,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:00:00Z,NOT_CLOUDY,Yosemite Valley,7262586,US,12h,tahoecity.prod
,,9,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-24T17:14:25Z,NOT_CLOUDY,Yosemite Valley,7262586,US,*,tahoecity.prod
,,9,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-24T18:15:26Z,NOT_CLOUDY,Yosemite Valley,7262586,US,*,tahoecity.prod
,,9,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-24T19:14:39Z,NOT_CLOUDY,Yosemite Valley,7262586,US,*,tahoecity.prod
,,9,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-24T20:14:14Z,NOT_CLOUDY,Yosemite Valley,7262586,US,*,tahoecity.prod
,,9,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-24T21:14:35Z,CLOUDY,Yosemite Valley,7262586,US,*,tahoecity.prod
,,9,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-24T22:14:24Z,CLOUDY,Yosemite Valley,7262586,US,*,tahoecity.prod
,,9,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-24T23:14:26Z,CLOUDY,Yosemite Valley,7262586,US,*,tahoecity.prod
,,9,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T00:14:31Z,CLOUDY,Yosemite Valley,7262586,US,*,tahoecity.prod
,,9,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T01:14:19Z,NOT_CLOUDY,Yosemite Valley,7262586,US,*,tahoecity.prod
,,9,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T02:14:19Z,NOT_CLOUDY,Yosemite Valley,7262586,US,*,tahoecity.prod
,,9,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T03:14:13Z,NOT_CLOUDY,Yosemite Valley,7262586,US,*,tahoecity.prod
,,9,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T04:14:09Z,NOT_CLOUDY,Yosemite Valley,7262586,US,*,tahoecity.prod
,,9,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T05:15:05Z,NOT_CLOUDY,Yosemite Valley,7262586,US,*,tahoecity.prod
,,9,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T06:14:19Z,NOT_CLOUDY,Yosemite Valley,7262586,US,*,tahoecity.prod
,,9,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T07:14:17Z,NOT_CLOUDY,Yosemite Valley,7262586,US,*,tahoecity.prod
,,9,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T08:14:25Z,NOT_CLOUDY,Yosemite Valley,7262586,US,*,tahoecity.prod
,,9,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T09:14:22Z,NOT_CLOUDY,Yosemite Valley,7262586,US,*,tahoecity.prod
,,9,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T10:14:27Z,NOT_CLOUDY,Yosemite Valley,7262586,US,*,tahoecity.prod
,,9,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T11:14:21Z,NOT_CLOUDY,Yosemite Valley,7262586,US,*,tahoecity.prod
,,9,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T12:14:15Z,NOT_CLOUDY,Yosemite Valley,7262586,US,*,tahoecity.prod
,,9,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T13:14:19Z,NOT_CLOUDY,Yosemite Valley,7262586,US,*,tahoecity.prod
,,9,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T14:14:33Z,NOT_CLOUDY,Yosemite Valley,7262586,US,*,tahoecity.prod
,,9,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T15:14:26Z,NOT_CLOUDY,Yosemite Valley,7262586,US,*,tahoecity.prod
,,9,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T16:14:38Z,NOT_CLOUDY,Yosemite Valley,7262586,US,*,tahoecity.prod
,,9,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T17:14:43Z,NOT_CLOUDY,Yosemite Valley,7262586,US,*,tahoecity.prod
,,9,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T18:15:34Z,NOT_CLOUDY,Yosemite Valley,7262586,US,*,tahoecity.prod
,,9,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T19:14:26Z,NOT_CLOUDY,Yosemite Valley,7262586,US,*,tahoecity.prod
,,9,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T20:14:19Z,NOT_CLOUDY,Yosemite Valley,7262586,US,*,tahoecity.prod
,,9,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:14:20Z,NOT_CLOUDY,Yosemite Valley,7262586,US,*,tahoecity.prod
,,9,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T22:14:21Z,NOT_CLOUDY,Yosemite Valley,7262586,US,*,tahoecity.prod
,,9,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T23:14:03Z,NOT_CLOUDY,Yosemite Valley,7262586,US,*,tahoecity.prod
,,9,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T06:00:00Z,NOT_CLOUDY,Yosemite Valley,7262586,US,15h,tahoecity.prod
,,9,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T09:00:00Z,NOT_CLOUDY,Yosemite Valley,7262586,US,15h,tahoecity.prod
,,9,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T12:00:00Z,NOT_CLOUDY,Yosemite Valley,7262586,US,15h,tahoecity.prod
,,9,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T15:00:00Z,NOT_CLOUDY,Yosemite Valley,7262586,US,15h,tahoecity.prod
,,9,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T18:00:00Z,NOT_CLOUDY,Yosemite Valley,7262586,US,15h,tahoecity.prod
,,9,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:00:00Z,NOT_CLOUDY,Yosemite Valley,7262586,US,15h,tahoecity.prod
,,9,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T09:00:00Z,NOT_CLOUDY,Yosemite Valley,7262586,US,18h,tahoecity.prod
,,9,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T12:00:00Z,NOT_CLOUDY,Yosemite Valley,7262586,US,18h,tahoecity.prod
,,9,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T15:00:00Z,NOT_CLOUDY,Yosemite Valley,7262586,US,18h,tahoecity.prod
,,9,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T18:00:00Z,NOT_CLOUDY,Yosemite Valley,7262586,US,18h,tahoecity.prod
,,9,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:00:00Z,NOT_CLOUDY,Yosemite Valley,7262586,US,18h,tahoecity.prod
,,9,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T12:00:00Z,NOT_CLOUDY,Yosemite Valley,7262586,US,21h,tahoecity.prod
,,9,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T15:00:00Z,NOT_CLOUDY,Yosemite Valley,7262586,US,21h,tahoecity.prod
,,9,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T18:00:00Z,NOT_CLOUDY,Yosemite Valley,7262586,US,21h,tahoecity.prod
,,9,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:00:00Z,NOT_CLOUDY,Yosemite Valley,7262586,US,21h,tahoecity.prod
,,9,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T15:00:00Z,NOT_CLOUDY,Yosemite Valley,7262586,US,24h,tahoecity.prod
,,9,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T18:00:00Z,NOT_CLOUDY,Yosemite Valley,7262586,US,24h,tahoecity.prod
,,9,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:00:00Z,NOT_CLOUDY,Yosemite Valley,7262586,US,24h,tahoecity.prod
,,9,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T18:00:00Z,NOT_CLOUDY,Yosemite Valley,7262586,US,27h,tahoecity.prod
,,9,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:00:00Z,NOT_CLOUDY,Yosemite Valley,7262586,US,27h,tahoecity.prod
,,9,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:00:00Z,NOT_CLOUDY,Yosemite Valley,7262586,US,30h,tahoecity.prod
,,9,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-24T18:00:00Z,NOT_CLOUDY,Yosemite Valley,7262586,US,3h,tahoecity.prod
,,9,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-24T21:00:00Z,CLOUDY,Yosemite Valley,7262586,US,3h,tahoecity.prod
,,9,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T00:00:00Z,CLOUDY,Yosemite Valley,7262586,US,3h,tahoecity.prod
,,9,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T03:00:00Z,NOT_CLOUDY,Yosemite Valley,7262586,US,3h,tahoecity.prod
,,9,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T06:00:00Z,NOT_CLOUDY,Yosemite Valley,7262586,US,3h,tahoecity.prod
,,9,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T09:00:00Z,NOT_CLOUDY,Yosemite Valley,7262586,US,3h,tahoecity.prod
,,9,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T12:00:00Z,NOT_CLOUDY,Yosemite Valley,7262586,US,3h,tahoecity.prod
,,9,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T15:00:00Z,NOT_CLOUDY,Yosemite Valley,7262586,US,3h,tahoecity.prod
,,9,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T18:00:00Z,NOT_CLOUDY,Yosemite Valley,7262586,US,3h,tahoecity.prod
,,9,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:00:00Z,NOT_CLOUDY,Yosemite Valley,7262586,US,3h,tahoecity.prod
,,9,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-24T21:00:00Z,CLOUDY,Yosemite Valley,7262586,US,6h,tahoecity.prod
,,9,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T00:00:00Z,CLOUDY,Yosemite Valley,7262586,US,6h,tahoecity.prod
,,9,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T03:00:00Z,CLOUDY,Yosemite Valley,7262586,US,6h,tahoecity.prod
,,9,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T06:00:00Z,NOT_CLOUDY,Yosemite Valley,7262586,US,6h,tahoecity.prod
,,9,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T09:00:00Z,NOT_CLOUDY,Yosemite Valley,7262586,US,6h,tahoecity.prod
,,9,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T12:00:00Z,NOT_CLOUDY,Yosemite Valley,7262586,US,6h,tahoecity.prod
,,9,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T15:00:00Z,NOT_CLOUDY,Yosemite Valley,7262586,US,6h,tahoecity.prod
,,9,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T18:00:00Z,NOT_CLOUDY,Yosemite Valley,7262586,US,6h,tahoecity.prod
,,9,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:00:00Z,NOT_CLOUDY,Yosemite Valley,7262586,US,6h,tahoecity.prod
,,9,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T00:00:00Z,CLOUDY,Yosemite Valley,7262586,US,9h,tahoecity.prod
,,9,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T03:00:00Z,NOT_CLOUDY,Yosemite Valley,7262586,US,9h,tahoecity.prod
,,9,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T06:00:00Z,NOT_CLOUDY,Yosemite Valley,7262586,US,9h,tahoecity.prod
,,9,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T09:00:00Z,NOT_CLOUDY,Yosemite Valley,7262586,US,9h,tahoecity.prod
,,9,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T12:00:00Z,NOT_CLOUDY,Yosemite Valley,7262586,US,9h,tahoecity.prod
,,9,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T15:00:00Z,NOT_CLOUDY,Yosemite Valley,7262586,US,9h,tahoecity.prod
,,9,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T18:00:00Z,NOT_CLOUDY,Yosemite Valley,7262586,US,9h,tahoecity.prod
,,9,cloudiness,weather,2020-08-24T00:00:00Z,2020-08-26T00:00:00Z,2020-08-25T21:00:00Z,NOT_CLOUDY,Yosemite Valley,7262586,US,9h,tahoecity.prod
`
