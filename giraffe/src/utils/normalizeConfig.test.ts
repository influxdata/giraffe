import {Config} from '../types'
import {normalizeConfig} from './normalizeConfig'

describe('normalizeConfig', () => {
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

    it('overrides the "lowerColumnName" and "upperColumnName" when they match "mainColumnName"', () => {
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
      - SimpleTableLayerConfig
      - SingleStatLayerConfig
      - TableGraphLayerConfig
  */
})
