// Libraries
import React, {FunctionComponent, RefObject, useRef} from 'react'
import AutoSizer from 'react-virtualized-auto-sizer'

// Components
import {PlotResizer, TableResizer} from './PlotResizer'

// Types
import {Config, SizedConfig} from '../types'

// Utils
import {hasPlotEnv} from '../utils/hasPlotEnv'

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
    return hasPlotEnv(config) ? (
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
    ) : (
      <TableResizer
        config={config as SizedConfig}
        height={config.height}
        width={config.width}
      >
        {children}
      </TableResizer>
    )
  }

  return hasPlotEnv(config) ? (
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
  ) : (
    <AutoSizer className="giraffe-autosizer">
      {({width, height}) => (
        <TableResizer
          config={config as SizedConfig}
          height={height}
          width={width}
        >
          {children}
        </TableResizer>
      )}
    </AutoSizer>
  )
}

Plot.displayName = 'Plot'
