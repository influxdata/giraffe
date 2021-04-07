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

        <ActualTooltip data={tooltipData} config={config} />

    </div>
  )
}
