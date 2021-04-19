import React, {FunctionComponent} from 'react'

import {
  Formatter,
  LayerSpec,
  LegendData,
  LineData,
  StaticLegend,
  SizedConfig,
} from '../types'

import {Legend} from './Legend'

import {FILL} from '../constants/columnKeys'

interface StaticLegendBoxProps extends StaticLegend {
  config: SizedConfig
  columnFormatter: (columnKey: string) => Formatter
  height: number
  spec: LayerSpec
  top: number
  width: number
}

const convertLineSpec = (config, spec, columnFormatter): LegendData => {
  const staticLegendConfig = config.staticLegend
  const tooltipLayer = staticLegendConfig.layer ?? 0
  const layerConfig = config.layers[tooltipLayer]

  const valueAxis = staticLegendConfig.valueAxis ?? 'y'

  const valueKey = layerConfig[valueAxis]
  const valueFormatter = columnFormatter(valueKey)

  const mappings = spec?.columnGroupMaps?.fill?.mappings

  const lineData: LineData = spec?.lineData

  const colors = Object.values(lineData).map(value => value?.fill)

  const peek = (arr: number[]): number => {
    const len = arr.length
    if (len >= 1) {
      return arr[len - 1]
    }
    return 0
  }

  const dimension = valueAxis === 'x' ? 'xs' : 'ys'

  const values = Object.values(lineData).map(line =>
    valueFormatter(peek(line[dimension]))
  )

  const objKeys = spec?.columnGroupMaps?.fill?.columnKeys

  if (!objKeys) {
    return null
  }

  const legendLines = objKeys.map(key => {
    const values: string[] = mappings.map(dataLine => dataLine[key])

    return {
      key,
      name: key,
      type: spec.table.getColumnType(FILL),
      values,
      colors,
    }
  })

  const valueLine = {
    key: valueKey,
    name: `Latest ${valueKey}`,
    type: spec.table.getColumnType(valueKey),
    colors,
    values,
  }

  const result = [valueLine, ...legendLines]

  return result
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
