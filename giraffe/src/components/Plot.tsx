import React, {FunctionComponent, RefObject, useRef} from 'react'
import AutoSizer from 'react-virtualized-auto-sizer'

import {Config, SizedConfig, LayerTypes} from '../types'
import {SizedPlot} from './SizedPlot'
import {SizedTable} from './SizedTable'

import {get} from '../utils/get'

interface Props {
  config: Config
  axesCanvasRef?: RefObject<HTMLCanvasElement>
  layerCanvasRef?: RefObject<HTMLCanvasElement>
}

export const Plot: FunctionComponent<Props> = ({
  config,
  children,
  axesCanvasRef = useRef<HTMLCanvasElement>(null),
  layerCanvasRef = useRef<HTMLCanvasElement>(null),
}) => {
  const graphType = get(config, 'layers.0.type')

  if (config.width && config.height) {
    return (
        <div>
      <SizedPlot
        config={config as SizedConfig}
        axesCanvasRef={axesCanvasRef}
        layerCanvasRef={layerCanvasRef}
      >
        {children}
      </SizedPlot>
          <div style={{width:'90%', height: 100}}>
            hi there from jill!
          </div>
        </div>
    )
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
            <div>
          <SizedPlot
            config={{...config, width, height}}
            axesCanvasRef={axesCanvasRef}
            layerCanvasRef={layerCanvasRef}
          >
            {children}
          </SizedPlot>
              <div style={{width:'90%', height: 100}}> hi from jill---again! </div>
            </div>
        )
      }}
    </AutoSizer>
  )
}

Plot.displayName = 'Plot'
