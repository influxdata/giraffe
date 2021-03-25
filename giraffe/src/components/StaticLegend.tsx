import React, {FunctionComponent} from 'react'

// Types
import {StaticLegend} from '../types'

// Utils
import {resizePlotWithStaticLegend} from '../utils/resizePlot'

interface StaticLegendBoxProps extends StaticLegend {
  height: number
  width: number
}

export const StaticLegendBox: FunctionComponent<StaticLegendBoxProps> = props => {
  const {
    border,
    fontBrightColor,
    height,
    width,
    heightRatio,
    widthRatio,
  } = props

  const plotSize = resizePlotWithStaticLegend(height, width, {
    heightRatio,
    widthRatio,
  })

  const staticLegendHeight = height - plotSize.height
  return (
    <div
      style={{
        position: 'absolute',
        top: `${plotSize.height}px`,
        height: `${staticLegendHeight}px`,
        width: `${width}px`,
        color: fontBrightColor,
        border,
      }}
    >
      Static Legend content goes here
    </div>
  )
}
