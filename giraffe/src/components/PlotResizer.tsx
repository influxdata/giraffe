import React, {FC, RefObject, useMemo} from 'react'

import {PlotDimensions, SizedConfig} from '../types'

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

  if (width === 0 || height === 0) {
    return null
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

interface TableResizerProps {
  config: SizedConfig
  height: number
  width: number
}

export const TableResizer: FC<TableResizerProps> = props => {
  const {children, config, height, width} = props

  const normalizedConfig: SizedConfig = useMemo(
    () => ({
      ...normalizeConfig(config),
      height,
      width,
    }),
    [config, height, width]
  )

  if (width === 0 || height === 0) {
    return null
  }

  return <SizedTable config={normalizedConfig}>{children}</SizedTable>
}
