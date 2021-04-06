import React, {FC, useState} from 'react'
import {SizedPlot, SizedPlotProps} from './SizedPlot'
import {StaticLegendBox} from './StaticLegend'
import {PlotDimensions, SizedConfig} from '../types'

import _ from 'lodash'

interface Props extends SizedPlotProps {
  resized: PlotDimensions
}

export const SizedPlotWithLegend: FC<Props> = props => {
  const {axesCanvasRef, children, config, layerCanvasRef, resized} = props

  const [legendInfo, setLegendInfo] = useState(null)
  console.log('here...in props...(jill-fa-1)', props)

  const onLegendChange = info => {
    console.log('got legend info...', info)
    //are the number of items the same?  if not update
    if (!info) {
      return
    }

    if (!legendInfo) {
      //it's null; not set yet; just set it
      console.log('setting legend info:  (a-null)', info)

      setLegendInfo(info)
      return
    }
    if (info.length === legendInfo.length) {
      return
    }

    //get each list of keys:
    const origKeys = legendInfo.map(one => one.key)

    const newKeys = info.map(one => one.key)

    //are they the same???
    if (!_.isEqual(origKeys, newKeys)) {
      console.log('setting legend info:  (b-change)', info)
      //if they are different, set the legend
      setLegendInfo(info)
    }
  }

  // useEffect(() => {
  //     ;
  // }, [defaultChanged]);
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
        onLegendChange={onLegendChange}
      >
        {children}
      </SizedPlot>
      <StaticLegendBox
        height={config.height - resized.height}
        top={resized.height}
        width={resized.width}
        {...config.staticLegend}
        legendInfo={legendInfo}
      />
    </>
  )
}
