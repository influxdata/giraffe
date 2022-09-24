import {Config, LayerTypes} from '../types'
import {get} from './get'

export const hasPlotEnv = (config: Config): boolean => {
  const graphType = get(config, 'layers.0.type')
  if (
    graphType === LayerTypes.Gauge ||
    graphType === LayerTypes.RawFluxDataTable ||
    graphType === LayerTypes.SimpleTable ||
    graphType === LayerTypes.Table
  ) {
    return false
  }
  return true
}
