import React, {FC, RefObject, useMemo} from 'react'

import {LayerTypes, PlotDimensions, SizedConfig} from '../types'

import {get} from '../utils/get'
import {resizePlotWithStaticLegend} from '../utils/legend/resizePlot'
import {normalizeConfig} from '../utils/normalizeConfig'
import {usePlotEnv} from '../utils/usePlotEnv'

import {SizedPlot} from './SizedPlot'
import {StaticLegendBox} from './StaticLegendBox'
import {SizedTable} from './SizedTable'

// note: the config here is for the ENTIRE plot; not for each layer.
// those are inside config.layerConfig
interface PlotResizerProps {
  axesCanvasRef?: RefObject<HTMLCanvasElement>
  config: SizedConfig
  height: number
  layerCanvasRef?: RefObject<HTMLCanvasElement>
  width: number
}

export const PlotResizer: FC<PlotResizerProps> = props => {
  const {axesCanvasRef, children, config, height, layerCanvasRef, width} = props
  const resized: PlotDimensions = resizePlotWithStaticLegend(
    height,
    width,
    config.staticLegend
  )

  const normalizedConfig: SizedConfig = useMemo(
    () => ({
      ...normalizeConfig(config),
      height: resized.height,
      width: resized.width,
    }),
    [config, height, width] // eslint-disable-line react-hooks/exhaustive-deps
  )

  const env = usePlotEnv(normalizedConfig)
  const spec = env.getSpec(0)
  const graphType = get(config, 'layers.0.type')

  if (width === 0 || height === 0) {
    return null
  }

  if (
    graphType === LayerTypes.Table ||
    graphType === LayerTypes.RawFluxDataTable ||
    graphType === LayerTypes.Gauge ||
    graphType === LayerTypes.SimpleTable
  ) {
    return <SizedTable config={normalizedConfig}>{children}</SizedTable>
  }

  return (
    <>
      <SizedPlot
        axesCanvasRef={axesCanvasRef}
        config={normalizedConfig}
        layerCanvasRef={layerCanvasRef}
        env={env}
      >
        {children}
      </SizedPlot>
      {config.staticLegend && !config.staticLegend.hide ? (
        <StaticLegendBox
          columnFormatter={env.getFormatterForColumn}
          config={normalizedConfig}
          height={height - resized.height}
          spec={spec}
          top={resized.height}
          width={resized.width}
        />
      ) : null}
    </>
  )
}
