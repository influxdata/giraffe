// Libraries
import React, {FunctionComponent} from 'react'
import AutoSizer from 'react-virtualized-auto-sizer'

// Types
import {GaugeLayerConfig} from '../../types'
import {Gauge} from './Gauge'

// Constants
import {GAUGE_THEME_DARK} from '../../constants/gaugeStyles'

interface Props {
  value: number
  config: GaugeLayerConfig
}

export const GaugeLayer: FunctionComponent<Props> = (props: Props) => {
  const {value, config} = props
  const {
    prefix = '',
    suffix = '',
    tickPrefix = '',
    tickSuffix = '',
    decimalPlaces = {},
    gaugeColors,
    gaugeSize = Math.PI,
    gaugeTheme = {},
  } = config

  const MAX_PI_DECIMALS = 3 // values above 3 distort Gauge styling

  /* 
    Gauge size is measured in radians https://www.mathsisfun.com/geometry/radians.html
      minimum: pi (half a circle)
      maximum: 2 * pi (whole circle)
  */
  const validGaugeSize = Number(
    Math.min(Math.max(gaugeSize, Math.PI), 2 * Math.PI).toFixed(MAX_PI_DECIMALS)
  )

  return (
    <AutoSizer className="giraffe-autosizer">
      {({width, height}) => (
        <div
          className="giraffe-layer giraffe-layer-gauge"
          data-testid="giraffe-layer-gauge"
        >
          <Gauge
            width={width}
            height={height}
            colors={gaugeColors}
            prefix={prefix}
            tickPrefix={tickPrefix}
            suffix={suffix}
            tickSuffix={tickSuffix}
            gaugePosition={value}
            decimalPlaces={decimalPlaces}
            gaugeSize={validGaugeSize}
            theme={{...GAUGE_THEME_DARK, ...gaugeTheme}}
          />
        </div>
      )}
    </AutoSizer>
  )
}
