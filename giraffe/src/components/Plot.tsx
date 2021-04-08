import React, {FunctionComponent, RefObject, useMemo, useRef} from 'react'
import AutoSizer from 'react-virtualized-auto-sizer'

import {Config, SizedConfig, PlotDimensions} from '../types'

import {PlotEnv} from '../utils/PlotEnv'
import {resizePlotWithStaticLegend} from '../utils/legend/resizePlot'
import {usePlotEnv} from '../utils/usePlotEnv'

import {AutoSizedPlot} from './AutoSizedPlot'
import {SizedPlot} from './SizedPlot'
import {StaticLegendBox} from './StaticLegend'

interface PlotProps {
  config: Config
  axesCanvasRef?: RefObject<HTMLCanvasElement>
  layerCanvasRef?: RefObject<HTMLCanvasElement>
}

export const Plot: FunctionComponent<PlotProps> = ({
  config,
  children,
  axesCanvasRef = useRef<HTMLCanvasElement>(null),
  layerCanvasRef = useRef<HTMLCanvasElement>(null),
}) => {
  const resized: PlotDimensions = resizePlotWithStaticLegend(
    config.height,
    config.width,
    config.staticLegend
  )
  const sizedConfig = useMemo(
    () => ({
      ...config,
      height: resized.height,
      width: resized.width,
    }),
    [config]
  )
  const env: PlotEnv = usePlotEnv(sizedConfig)

  if (config.width && config.height) {
    return (
      <div className="giraffe-fixedsizer" style={{position: 'relative'}}>
        <SizedPlot
          axesCanvasRef={axesCanvasRef}
          config={sizedConfig}
          layerCanvasRef={layerCanvasRef}
          env={env}
        >
          {children}
        </SizedPlot>
        {config.staticLegend ? (
          <StaticLegendBox
            height={config.height - resized.height}
            top={resized.height}
            width={resized.width}
            {...config.staticLegend}
          />
        ) : null}
      </div>
    )
  }

  return (
    <AutoSizer className="giraffe-autosizer">
      {({width, height}) => (
        <AutoSizedPlot
          axesCanvasRef={axesCanvasRef}
          config={config as SizedConfig}
          height={height}
          layerCanvasRef={layerCanvasRef}
          width={width}
        />
      )}
    </AutoSizer>
  )
}

Plot.displayName = 'Plot'
