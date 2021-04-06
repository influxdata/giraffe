import React, {FC} from 'react'
import {SizedPlot, SizedPlotProps} from './SizedPlot'
import {StaticLegendBox} from './StaticLegend'
import {PlotDimensions, SizedConfig} from '../types'
import {usePlotEnv} from "../utils/usePlotEnv";

interface Props extends SizedPlotProps {
  resized: PlotDimensions
}

export const SizedPlotWithLegend: FC<Props> = props => {
  const {axesCanvasRef, children, config, layerCanvasRef, resized} = props

    const env = usePlotEnv(config)
    const spec = env.getSpec(0)

  return (
    <>
      <SizedPlot
        axesCanvasRef={axesCanvasRef}
        config={{
          ...(config as SizedConfig),
          height: resized.height,
          width: resized.width,
        }}
        layerCanvasRef={layerCanvasRef}
        env={env}
        spec={spec}
      >
        {children}
      </SizedPlot>
      <StaticLegendBox
        height={config.height - resized.height}
        top={resized.height}
        width={resized.width}
        {...config.staticLegend}
      />
    </>
  )
}
