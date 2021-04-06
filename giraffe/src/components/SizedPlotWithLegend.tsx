import React, {FC} from 'react'
import {SizedPlot, SizedPlotProps} from './SizedPlot'
import {StaticLegendBox} from './StaticLegend'
import {LineData, PlotDimensions, SizedConfig} from '../types'
import {usePlotEnv} from "../utils/usePlotEnv";

interface Props extends SizedPlotProps {
  resized: PlotDimensions
}

const convertLineSpec = spec => {
    const mappings = spec?.columnGroupMaps?.fill?.mappings

    // this is an object; lineData isn't an array, it's an object with keys from 0->n
    const lineData: LineData = spec?.lineData

    const colors = Object.values(lineData).map(value => value?.fill)

    // assume all keys are the same
    let objKeys = Object.keys(mappings[0])

    let result = objKeys.map(key => {
        const values = mappings.map(dataLine => dataLine[key])

        return {
            colors,
            key,
            name: key,
            type: 'string',
            values,
        }
    })

    return result
}

export const SizedPlotWithLegend: FC<Props> = props => {
  const {axesCanvasRef, children, config, layerCanvasRef, resized} = props

    const env = usePlotEnv(config)
    const spec = env.getSpec(0)

    const tooltipData = convertLineSpec(spec)

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
          tooltipdata={tooltipData}
      />
    </>
  )
}
