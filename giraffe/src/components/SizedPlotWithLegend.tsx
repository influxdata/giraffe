import React, {FC} from 'react'
import {SizedPlot, SizedPlotProps} from './SizedPlot'
import {StaticLegendBox} from './StaticLegend'
import {ColumnType, LineData, PlotDimensions, SizedConfig, TooltipData} from '../types'
import {usePlotEnv} from "../utils/usePlotEnv";

interface Props extends SizedPlotProps {
  resized: PlotDimensions
}

const convertLineSpec = (spec):TooltipData =>  {
    const mappings = spec?.columnGroupMaps?.fill?.mappings

    // this is an object; lineData isn't an array, it's an object with keys from 0->n
    const lineData: LineData = spec?.lineData

    const colors = Object.values(lineData).map(value => value?.fill)

    // assume all keys are the same
    let objKeys = Object.keys(mappings[0])

    let result = objKeys.map(key => {
        const values: string[] = mappings.map(dataLine => dataLine[key])

        return {
            key,
            name: key,
            type: 'string' as ColumnType,
            values,
            colors,
        }
    })

    return result
}

export const SizedPlotWithLegend: FC<Props> = props => {
  const {axesCanvasRef, children, config, layerCanvasRef, resized} = props

    const env = usePlotEnv(config)
    const spec = env.getSpec(0)

    const tooltipData = convertLineSpec(spec)
    console.log('got line spec: (converted (1))', tooltipData)
    console.log('static legend config.....(1)', config.staticLegend)
    console.log("entire config....(1)", config)

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
          tooltipData={tooltipData}
        config={config}
      />
    </>
  )
}
