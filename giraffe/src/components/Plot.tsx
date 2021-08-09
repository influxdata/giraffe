import React, {FunctionComponent, RefObject, useRef} from 'react'
import AutoSizer from 'react-virtualized-auto-sizer'

import {Config, SizedConfig} from '../types'

import {PlotResizer} from './PlotResizer'
interface PlotProps {
  config: Config
  axesCanvasRef?: RefObject<HTMLCanvasElement>
  layerCanvasRef?: RefObject<HTMLCanvasElement>
}

export const Plot: FunctionComponent<PlotProps> = props => {
  const {children, config} = props

  let axesCanvasRef = useRef<HTMLCanvasElement>(null)
  let layerCanvasRef = useRef<HTMLCanvasElement>(null)

  if (props.axesCanvasRef) {
    axesCanvasRef = props.axesCanvasRef
  }

  if (props.layerCanvasRef) {
    layerCanvasRef = props.layerCanvasRef
  }

  if (config.width && config.height) {
    return (
      <div className="giraffe-fixedsizer" style={{position: 'relative'}}>
        <PlotResizer
          axesCanvasRef={axesCanvasRef}
          config={config as SizedConfig}
          height={config.height}
          layerCanvasRef={layerCanvasRef}
          width={config.width}
        >
          {children}
        </PlotResizer>
      </div>
    )
  }

  return (
    <AutoSizer className="giraffe-autosizer">
      {({width, height}) => (
        <PlotResizer
          axesCanvasRef={axesCanvasRef}
          config={config as SizedConfig}
          height={height}
          layerCanvasRef={layerCanvasRef}
          width={width}
        >
          {children}
        </PlotResizer>
      )}
    </AutoSizer>
  )
}

Plot.displayName = 'Plot'
