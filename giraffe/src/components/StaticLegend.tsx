import React, {FunctionComponent} from 'react'

// Types
import {StaticLegend} from '../types'

interface StaticLegendBoxProps extends StaticLegend {
  height: number
  top: number
  width: number
    legendInfo: any
}

export const StaticLegendBox: FunctionComponent<StaticLegendBoxProps> = props => {
  const {legendInfo, border, fontBrightColor, height, top, width} = props

    console.log("in static legend...got info??",legendInfo)
  return (
    <div
      className="giraffe-static-legend"
      style={{
        position: 'absolute',
        top: `${top}px`,
        bottom: 0,
        left: 0,
        right: 0,
        height: `${height}px`,
        width: `${width}px`,
        color: fontBrightColor,
        border,
      }}
    >
        <div>
      Static Legend content goes here

        </div>
        <div>second line here</div>
        <div>third line here</div>
    </div>
  )
}
