import React, {FC, RefObject, useMemo} from 'react'

import {
  LayerTypes,
  LegendData,
  LineData,
  PlotDimensions,
  SizedConfig,
} from '../types'

import {FILL} from '../constants/columnKeys'

import {get} from '../utils/get'
import {resizePlotWithStaticLegend} from '../utils/legend/resizePlot'
import {usePlotEnv} from '../utils/usePlotEnv'

import {SizedPlot} from './SizedPlot'
import {StaticLegendBox} from './StaticLegend'
import {SizedTable} from './SizedTable'

interface PlotResizerProps {
  axesCanvasRef?: RefObject<HTMLCanvasElement>
  config: SizedConfig
  height: number
  layerCanvasRef?: RefObject<HTMLCanvasElement>
  width: number
}

const convertLineSpec = (spec): LegendData => {
  console.log('about to do conversion: (jilla)', spec)

  const mappings = spec?.columnGroupMaps?.fill?.mappings

  // this is an object; lineData isn't an array, it's an object with keys from 0->n
  const lineData: LineData = spec?.lineData

  const colors = Object.values(lineData).map(value => value?.fill)

  // assume all keys are the same
  const objKeys = spec?.columnGroupMaps?.fill?.columnKeys

  if (!objKeys) {
    return null
  }

  const result = objKeys.map(key => {
    const values: string[] = mappings.map(dataLine => dataLine[key])

    return {
      key,
      name: key,
      type: spec.table.getColumnType(FILL),
      values,
      colors,
    }
  })

  console.log('result of convert line spec: ', result)
  return result
}

export const PlotResizer: FC<PlotResizerProps> = props => {
  const {axesCanvasRef, children, config, height, layerCanvasRef, width} = props
  const resized: PlotDimensions = resizePlotWithStaticLegend(
    height,
    width,
    config.staticLegend
  )

  const sizedConfig: SizedConfig = useMemo(
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
          legendData={convertLineSpec(env.getSpec(0))}
          config={config}
        />
      ) : null}
    </>
  )
}
