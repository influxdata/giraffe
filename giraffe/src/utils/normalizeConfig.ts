import {Config, LayerConfig} from '../types'

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

export const normalizeConfig = (config: Config): Config => ({
  ...config,
  layers: normalizeLayers(config?.layers),
})
