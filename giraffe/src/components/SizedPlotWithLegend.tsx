import React, {FC} from 'react'
import {SizedPlot, SizedPlotProps} from './SizedPlot'
import {StaticLegendBox} from './StaticLegend'
import {PlotDimensions, SizedConfig} from '../types'

interface Props extends SizedPlotProps {
  resized: PlotDimensions
}

export const SizedPlotWithLegend: FC<Props> = props => {
  const {axesCanvasRef, children, config, layerCanvasRef, resized} = props

    console.log("here...in props...(jill-fa-1)", props)
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
