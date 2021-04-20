import React, {FunctionComponent} from 'react'
import {Formatter, LayerSpec, StaticLegend, SizedConfig} from '../types'
import {Legend} from './Legend'
import {convertLineSpec} from '../utils/legend/staticLegend'

interface StaticLegendBoxProps extends StaticLegend {
  config: SizedConfig
  columnFormatter: (columnKey: string) => Formatter
  height: number
  spec: LayerSpec
  top: number
  width: number
}

export const StaticLegendBox: FunctionComponent<StaticLegendBoxProps> = props => {
  const {
    border,
    config,
    fontBrightColor,
    columnFormatter,
    height,
    spec,
    top,
    width,
  } = props

  const legendData = convertLineSpec(config, spec, columnFormatter)
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
      <Legend data={legendData} config={config} />
    </div>
  )
}
