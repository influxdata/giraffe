import React, {FunctionComponent} from 'react'

// Types
import {SizedConfig, StaticLegend, TooltipData} from '../types'
import {ActualTooltip} from "./Tooltip";

interface StaticLegendBoxProps extends StaticLegend {
  height: number
  top: number
  width: number
    tooltipData: TooltipData
    config: SizedConfig
}

export const StaticLegendBox: FunctionComponent<StaticLegendBoxProps> = props => {
  const {border, fontBrightColor, height, top, width, tooltipData, config} = props
console.log("got top???", top);

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
          paddingTop:10,
          paddingLeft:10,
          marginTop:8,
        border,
          overflow:'scroll',
      }}
    >

        <ActualTooltip data={tooltipData} config={config} />

    </div>
  )
}
