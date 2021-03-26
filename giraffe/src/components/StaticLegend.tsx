import React, {FunctionComponent} from 'react'

// Types
import {StaticLegend} from '../types'

interface StaticLegendBoxProps extends StaticLegend {
  height: number
  top: number
  width: number
}

export const StaticLegendBox: FunctionComponent<StaticLegendBoxProps> = props => {
  const {border, fontBrightColor, height, top, width} = props
  console.log('Static Legend Box: props: width:', width, 'height:', height)

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
      Static Legend content goes here
    </div>
  )
}
