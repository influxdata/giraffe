import * as React from 'react'
import {FunctionComponent} from 'react'
import AutoSizer from 'react-virtualized-auto-sizer'

import {Config, SizedConfig} from '../types'
import {SizedPlot} from './SizedPlot'

interface Props {
  config: Config
}

export const Plot: FunctionComponent<Props> = ({config}) => {
  if (config.width && config.height) {
    return <SizedPlot config={config as SizedConfig} />
  }

  return (
    <AutoSizer>
      {({width, height}) => {
        if (width === 0 || height === 0) {
          return null
        }

        return <SizedPlot config={{...config, width, height}} />
      }}
    </AutoSizer>
  )
}
