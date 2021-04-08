import React, {FC, RefObject, useMemo} from 'react'

import {LayerTypes, PlotDimensions, SizedConfig} from '../types'

import {get} from '../utils/get'
import {resizePlotWithStaticLegend} from '../utils/legend/resizePlot'
import {usePlotEnv} from '../utils/usePlotEnv'

import {SizedPlot} from './SizedPlot'
import {StaticLegendBox} from './StaticLegend'
import {SizedTable} from './SizedTable'

interface AutoSizedPlotProps {
  axesCanvasRef?: RefObject<HTMLCanvasElement>
  config: SizedConfig
  height: number
  layerCanvasRef?: RefObject<HTMLCanvasElement>
  width: number
}

export const AutoSizedPlot: FC<AutoSizedPlotProps> = props => {
  const {axesCanvasRef, children, config, height, layerCanvasRef, width} = props
  const resized: PlotDimensions = resizePlotWithStaticLegend(
    height,
    width,
    config.staticLegend
  )

  const sizedConfig = useMemo(
    () => ({
      ...config,
      height: resized.height,
      width: resized.width,
    }),
    [config, height, width]
  )

  const env = usePlotEnv(sizedConfig)
  const graphType = get(config, 'layers.0.type')

  if (width === 0 || height === 0) {
    return null
  }

  if (
    graphType === LayerTypes.Table ||
    graphType === LayerTypes.RawFluxDataTable ||
    graphType === LayerTypes.Gauge
  ) {
    return <SizedTable config={sizedConfig}>{children}</SizedTable>
  }

  return (
    <>
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
          height={height - resized.height}
          top={resized.height}
          width={resized.width}
          {...config.staticLegend}
        />
      ) : null}
    </>
  )
}
