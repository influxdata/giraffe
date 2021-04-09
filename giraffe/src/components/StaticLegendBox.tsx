import React, {FunctionComponent} from 'react'

// Types
import {LegendData, StaticLegend, SizedConfig} from '../types'
import {ActualLegend} from './Tooltip'

interface StaticLegendBoxProps extends StaticLegend {
  height: number
  top: number
  width: number
  legendData: LegendData
  config: SizedConfig
}

export const StaticLegendBox: FunctionComponent<StaticLegendBoxProps> = props => {
  const {
    border,
    fontBrightColor,
    height,
    top,
    width,
    legendData,
    config,
  } = props

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
        padding: 10,
        overflow: 'auto',
        border,
      }}
    >
      <ActualLegend data={legendData} config={config} />
    </div>
  )
}
