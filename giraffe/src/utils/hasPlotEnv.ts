import {Config, LayerTypes} from '../types'
import {get} from './get'

export const hasPlotEnv = (config: Config): boolean => {
  const graphType = get(config, 'layers.0.type')
  if (
    graphType === LayerTypes.Table ||
    graphType === LayerTypes.RawFluxDataTable ||
    graphType === LayerTypes.Gauge ||
    graphType === LayerTypes.SimpleTable
  ) {
    return false
  }
  return true
}
