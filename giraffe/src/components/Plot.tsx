import React, {FunctionComponent, RefObject, useRef} from 'react'
import AutoSizer from 'react-virtualized-auto-sizer'

import {Config, SizedConfig, LayerTypes, PlotDimensions} from '../types'
import {SizedPlot} from './SizedPlot'
import {SizedPlotWithLegend} from './SizedPlotWithLegend'
import {SizedTable} from './SizedTable'

import {get} from '../utils/get'
import {resizePlotWithStaticLegend} from '../utils/legend/resizePlot'

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

  let resized: PlotDimensions

  if (config.width && config.height) {
    if (config.staticLegend) {
      resized = resizePlotWithStaticLegend(
        config.height,
        config.width,
        config.staticLegend
      )
      return (
        <SizedPlotWithLegend
          axesCanvasRef={axesCanvasRef}
          config={config as SizedConfig}
          layerCanvasRef={layerCanvasRef}
          resized={resized}
        >
          {children}
        </SizedPlotWithLegend>
      )
    }
    return (
      <SizedPlot
        axesCanvasRef={axesCanvasRef}
        config={config as SizedConfig}
        layerCanvasRef={layerCanvasRef}
      >
        {children}
      </SizedPlot>
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
        if (config.staticLegend) {
          resized = resizePlotWithStaticLegend(
            height,
            width,
            config.staticLegend
          )
          return (
            <SizedPlotWithLegend
              axesCanvasRef={axesCanvasRef}
              config={config as SizedConfig}
              layerCanvasRef={layerCanvasRef}
              resized={resized}
            >
              {children}
            </SizedPlotWithLegend>
          )
        }
        return (
          <SizedPlot
            axesCanvasRef={axesCanvasRef}
            config={{...config, width, height}}
            layerCanvasRef={layerCanvasRef}
          >
            {children}
          </SizedPlot>
        )
      }}
    </AutoSizer>
  )
}

Plot.displayName = 'Plot'
