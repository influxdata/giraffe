// Libraries
import React, {FunctionComponent} from 'react'
import AutoSizer from 'react-virtualized-auto-sizer'

// Types
import {GaugeMiniLayerConfig} from '../types'
import {GaugeMini} from './GaugeMini'

import {GAUGE_MINI_THEME_BULLET_DARK} from '../constants/gaugeMiniStyles'

interface Props {
  value: number | string
  theme: GaugeMiniLayerConfig
}

export const GaugeMiniLayer: FunctionComponent<Props> = (props: Props) => {
  const {theme, value} = props
  const themeOrDefault: Required<GaugeMiniLayerConfig> = {
    ...GAUGE_MINI_THEME_BULLET_DARK,
    ...theme,
  }

  const valueNumber = typeof value === 'string' ? parseFloat(value) : value

  return (
    <AutoSizer className="giraffe-autosizer">
      {({width, height}) => (
        <div
          className="giraffe-layer giraffe-layer-gauge-mini"
          data-testid="giraffe-layer-gauge-mini"
        >
          <GaugeMini
            width={width}
            height={height}
            value={valueNumber}
            theme={themeOrDefault}
          />
        </div>
      )}
    </AutoSizer>
  )
}
