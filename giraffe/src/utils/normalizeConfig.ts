import {Config, LayerConfig} from '../types'
import {newTable} from './newTable'

// TODO: move all layer defaults here, see: https://github.com/influxdata/giraffe/issues/447
export const normalizeLayers = (layers: LayerConfig[]): LayerConfig[] =>
  layers?.map(layerConfig => {
    if (layerConfig.type === 'band') {
      let {upperColumnName, lowerColumnName} = layerConfig
      if (!upperColumnName || upperColumnName === layerConfig.mainColumnName) {
        upperColumnName = ''
      }
      if (!lowerColumnName || lowerColumnName === layerConfig.mainColumnName) {
        lowerColumnName = ''
      }
      return {...layerConfig, upperColumnName, lowerColumnName}
    }
    return layerConfig
  }) || []

export const normalizeConfig = (config: Config): Config => {
  const dataProperties: Partial<Config> = {}

  if (config) {
    const {fluxResponse, fromFluxResult, table} = config

    switch (config.layers?.[0]?.type) {
      case 'simple table':
        if (fromFluxResult) {
          dataProperties.fromFluxResult = fromFluxResult
        } else if (fluxResponse) {
          dataProperties.fluxResponse = fluxResponse
        } else {
          dataProperties.fromFluxResult = {
            table: newTable(0),
            fluxGroupKeyUnion: [],
            resultColumnNames: [],
          }
        }
        break

      case 'table':
        dataProperties.fluxResponse = fluxResponse ? fluxResponse : ''
        break

      default:
        if (table) {
          dataProperties.table = table
        } else if (fluxResponse) {
          dataProperties.fluxResponse = fluxResponse
        } else {
          dataProperties.table = newTable(0)
        }
    }
  }

  return {
    ...config,
    ...dataProperties,
    layers: normalizeLayers(config?.layers),
  }
}
