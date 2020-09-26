import * as React from 'react'
import {FunctionComponent} from 'react'
import AutoSizer from 'react-virtualized-auto-sizer'

import {Config, SizedConfig, LayerTypes} from '../types'
import {SizedPlot} from './SizedPlot'
import {SizedTable} from './SizedTable'

import {get} from '../utils/get'

interface Props {
  config: Config
}

export const Plot: FunctionComponent<Props> = ({config, children}) => {
  const graphType = get(config, 'layers.0.type')

  if (config.width && config.height) {
    return <SizedPlot config={config as SizedConfig}>{children}</SizedPlot>
  }

  return (
    <AutoSizer className="giraffe-autosizer">
      {({width, height}) => {
        if (width === 0 || height === 0) {
          return null
        }

        if (
          graphType === LayerTypes.Table ||
          graphType === LayerTypes.RawFluxDataTable ||
          graphType === LayerTypes.Gauge
        ) {
          return (
            <SizedTable config={{...config, width, height}}>
              {children}
            </SizedTable>
          )
        }
        return (
          <SizedPlot config={{...config, width, height}}>{children}</SizedPlot>
        )
      }}
    </AutoSizer>
  )
}

Plot.displayName = 'Plot'
