import {Config} from '../types'
import {normalizeConfig, normalizeLayers} from './normalizeConfig'
import {newTable} from './newTable'

describe('normalizeConfig', () => {
  const emptyConfig = {layers: []}
  const normalizedDataConfig = {table: newTable(0), layers: []}

  it('handles unexpected arguments', () => {
    expect(normalizeConfig(undefined)).toEqual(emptyConfig)
    expect(normalizeConfig(null)).toEqual(emptyConfig)
    expect(normalizeConfig(emptyConfig)).toEqual(normalizedDataConfig)
  })

  describe('config for Band Layer', () => {
    it('returns the config when it has a proper band layer', () => {
      const config = {
        layers: [
          {
            type: 'band',
            x: '_time',
            y: '_value',
            fill: ['result', '_field', '_measurement', 'cpu', 'host'],
            mainColumnName: '_result',
          },
        ],
      } as Config
      expect(normalizeConfig(config)).toEqual({
        ...normalizedDataConfig,
        ...config,
        layers: [
          {
            ...config.layers[0],
            lowerColumnName: '',
            upperColumnName: '',
          },
        ],
      })
    })

    it('overrides the "lowerColumnName" when it matches "mainColumnName"', () => {
      const mainColumnName = 'mean'
      const config = {
        layers: [
          {
            type: 'band',
            x: '_time',
            y: '_value',
            fill: ['result', '_field', '_measurement', 'cpu', 'host'],
            mainColumnName,
            lowerColumnName: mainColumnName,
          },
        ],
      } as Config
      expect(normalizeConfig(config)).toEqual({
        ...normalizedDataConfig,
        ...config,
        layers: [
          {
            ...config.layers[0],
            upperColumnName: '',
            mainColumnName,
            lowerColumnName: '',
          },
        ],
      })
    })

    it('overrides the "upperColumnName" when it matches "mainColumnName"', () => {
      const mainColumnName = 'mean'
      const config = {
        layers: [
          {
            type: 'band',
            x: '_time',
            y: '_value',
            fill: ['result', '_field', '_measurement', 'cpu', 'host'],
            upperColumnName: mainColumnName,
            mainColumnName,
          },
        ],
      } as Config
      expect(normalizeConfig(config)).toEqual({
        ...normalizedDataConfig,
        ...config,
        layers: [
          {
            ...config.layers[0],
            upperColumnName: '',
            mainColumnName,
            lowerColumnName: '',
          },
        ],
      })
    })

    it('overrides the "lowerColumnName" and "upperColumnName" when they both match "mainColumnName"', () => {
      const mainColumnName = 'mean'
      const config = {
        layers: [
          {
            type: 'band',
            x: '_time',
            y: '_value',
            fill: ['result', '_field', '_measurement', 'cpu', 'host'],
            upperColumnName: mainColumnName,
            mainColumnName,
            lowerColumnName: mainColumnName,
          },
        ],
      } as Config
      expect(normalizeConfig(config)).toEqual({
        ...normalizedDataConfig,
        ...config,
        layers: [
          {
            ...config.layers[0],
            upperColumnName: '',
            mainColumnName,
            lowerColumnName: '',
          },
        ],
      })
    })

    it('uses the "lowerColumnName" and "upperColumnName" when they do not match "mainColumnName"', () => {
      const upperColumnName = 'max'
      const mainColumnName = 'mean'
      const lowerColumnName = 'min'
      const config = {
        layers: [
          {
            type: 'band',
            x: '_time',
            y: '_value',
            fill: ['result', '_field', '_measurement', 'cpu', 'host'],
            upperColumnName,
            mainColumnName,
            lowerColumnName,
          },
        ],
      } as Config
      expect(normalizeConfig(config)).toEqual({
        ...normalizedDataConfig,
        ...config,
        layers: [
          {
            ...config.layers[0],
            upperColumnName,
            mainColumnName,
            lowerColumnName,
          },
        ],
      })
    })

    it('allows lowerColumnName and upperColumnName to match if they do not match mainColumnName', () => {
      const upperColumnName = 'upperandlower'
      const mainColumnName = 'mean'
      const lowerColumnName = upperColumnName
      const config = {
        layers: [
          {
            type: 'band',
            x: '_time',
            y: '_value',
            fill: ['result', '_field', '_measurement', 'cpu', 'host'],
            upperColumnName,
            mainColumnName,
            lowerColumnName,
          },
        ],
      } as Config
      expect(normalizeConfig(config)).toEqual({
        ...normalizedDataConfig,
        ...config,
        layers: [
          {
            ...config.layers[0],
            upperColumnName,
            mainColumnName,
            lowerColumnName,
          },
        ],
      })
    })
  })

  describe('config for SimpleTable', () => {
    it('ignores the table property and can find the fromFluxResult property', () => {
      const fromFluxResult = {
        table: newTable(2),
        fluxGroupKeyUnion: [],
        resultColumnNames: [],
      }
      const config = {
        fromFluxResult,
        layers: [
          {
            type: 'simple table',
            showAll: true,
          },
        ],
      } as Config

      expect(normalizeConfig(config)).toEqual(config)

      config.table = newTable(10)
      expect(normalizeConfig(config)).toEqual(config)

      config.table = newTable(1000)
      expect(normalizeConfig(config)).toEqual(config)

      delete config.table
      expect(normalizeConfig(config)).toEqual(config)
    })

    it('ignores the table property and can find the fluxResponse property', () => {
      const fluxResponse = `#group,false,false,true,true,false,false,true,true,true,true
#datatype,string,long,dateTime:RFC3339,dateTime:RFC3339,dateTime:RFC3339,double,string,string,string,string
#default,_result,,,,,,,,,
,result,table,_start,_stop,_time,_value,_field,_measurement,cpu,host
`
      const config = {
        fluxResponse,
        layers: [
          {
            type: 'simple table',
            showAll: true,
          },
        ],
      } as Config

      expect(normalizeConfig(config)).toEqual(config)

      config.table = newTable(0)
      expect(normalizeConfig(config)).toEqual(config)

      config.table = newTable(100000)
      expect(normalizeConfig(config)).toEqual(config)

      delete config.table
      expect(normalizeConfig(config)).toEqual(config)
    })

    it('uses the fromFluxResult property over the fluxResponse property', () => {
      const fromFluxResult = {
        table: newTable(2),
        fluxGroupKeyUnion: [],
        resultColumnNames: [],
      }

      const config = {
        fromFluxResult,
        layers: [
          {
            type: 'simple table',
            showAll: true,
          },
        ],
      } as Config

      config.fluxResponse = ''
      let firstResult = normalizeConfig(config)
      expect(firstResult).toEqual(config)
      expect(firstResult.table).toBeUndefined()

      config.fluxResponse = 'not valid csv'
      let secondResult = normalizeConfig(config)
      expect(secondResult).toEqual(config)
      expect(secondResult.table).toBeUndefined()

      expect(firstResult.fromFluxResult).toEqual(secondResult.fromFluxResult)
    })

    it('creates a default fromFluxResult property when fromFromResult and fluxResponse are both missing', () => {
      const defaultFromFluxResult = {
        table: newTable(0),
        fluxGroupKeyUnion: [],
        resultColumnNames: [],
      }
      const config = {
        layers: [
          {
            type: 'simple table',
            showAll: true,
          },
        ],
      } as Config

      expect(normalizeConfig(config)).toEqual({
        fromFluxResult: {...defaultFromFluxResult},
        ...config,
      })
    })
  })

  /*
    TODO: see https://github.com/influxdata/giraffe/issues/447
      when ready add the tests for
      - AnnotationLayerConfig
      - CustomLayerConfig
      - GaugeLayerConfig
      - GeoLayerConfig
      - HeatmapLayerConfig
      - HistogramLayerConfig
      - LineLayerConfig
      - MosaicLayerConfig
      - RawFluxDataTableLayerConfig
      - ScatterLayerConfig
      - SingleStatLayerConfig
      - TableGraphLayerConfig
  */
})

describe('normalizeLayers', () => {
  it('handles incorrect usage', () => {
    expect(normalizeLayers(undefined)).toEqual([])
    expect(normalizeLayers(null)).toEqual([])
  })
})
