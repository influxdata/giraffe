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

/** for static legend config:
// todo:  add 'valueColumn' which defaults to 'y' if not present, valid values are 'y' or 'x'
// todo:  add 'layer' which defaults to 0 if not present, can be a number (0->n where n is the number of layers).
 */

// use the first layer for the tooltip.
// putting here so we can parameterize/change this later
const tooltipLayer = 0
const valueColumn = 'y'

const convertLineSpec = (env, config): LegendData => {
  const spec = env.getSpec(tooltipLayer)

  const valueKey = config[valueColumn]
  const valueFormatter = env.getFormatterForColumn(valueKey)

  console.log('about to do conversion: (jilla)', spec)
  //console.log("config obj....(foo-b)", config)

  const mappings = spec?.columnGroupMaps?.fill?.mappings

  // this is an object; lineData isn't an array, it's an object with keys from 0->n
  const lineData: LineData = spec?.lineData

  const colors = Object.values(lineData).map(value => value?.fill)

  // todo: add ability to specify the x instead of the y for the values
  const peek = (arr: number[]): number => {
    const len = arr.length
    if (len >= 1) {
      return arr[len - 1]
    }
    return 0
  }

  const dimension = valueColumn === 'y' ? 'ys' : 'xs'

  const values = Object.values(lineData).map(line =>
    valueFormatter(peek(line[dimension]))
  )

  console.log('got values??? ick-i', values)
  console.log('config??? ick-i-2', config)

  // assume all keys are the same
  const objKeys = spec?.columnGroupMaps?.fill?.columnKeys

  if (!objKeys) {
    return null
  }

  const legendLines = objKeys.map(key => {
    const values: string[] = mappings.map(dataLine => dataLine[key])

    return {
      key,
      name: key,
      type: spec.table.getColumnType(FILL),
      values,
      colors,
    }
  })

  const valueLine = {
    key: valueKey,
    name: `Latest ${valueKey}`,
    type: spec.table.getColumnType(valueKey),
    colors,
    values,
  }

  const result = [valueLine, ...legendLines]

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
          legendData={convertLineSpec(env, config.layers[tooltipLayer])}
          config={config}
        />
      ) : null}
    </>
  )
}
