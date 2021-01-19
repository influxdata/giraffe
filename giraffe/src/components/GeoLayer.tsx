// Libraries
import React, {FunctionComponent, useState} from 'react'
import {AutoSizer} from 'react-virtualized'

// Types
import {
  LastRenderProperties,
  onAutoResize,
  GeoLayerProps,
} from './geo/GeoLayerUtils'

const GeoLayer: FunctionComponent<GeoLayerProps> = React.memo(props => {
  const [lastRenderProperties] = useState({} as LastRenderProperties)
  if (props.config.tileServerConfiguration) {
    return (
      <AutoSizer>
        {(() => {
          return ({width, height}) =>
            onAutoResize(props, lastRenderProperties, width, height)
        })()}
      </AutoSizer>
    )
  }
  return null
})

export default GeoLayer
