import * as React from 'react'
import {useRef, FunctionComponent, CSSProperties} from 'react'

import {Axes} from './Axes'
import {SizedConfig} from '../types'
import {HistogramLayer} from './HistogramLayer'
import {LineLayer} from './LineLayer'
import {HeatmapLayer} from './HeatmapLayer'
import {usePlotEnv} from '../utils/usePlotEnv'
import {useMousePos} from '../utils/useMousePos'

interface Props {
  config: SizedConfig
}

export const SizedPlot: FunctionComponent<Props> = ({config}) => {
  const env = usePlotEnv(config)

  const {
    margins,
    config: {width, height},
  } = env

  const plotStyle: CSSProperties = {
    position: 'relative',
    width: `${width}px`,
    height: `${height}px`,
  }

  const layersStyle: CSSProperties = {
    position: 'absolute',
    top: `${margins.top}px`,
    right: `${margins.right}px`,
    bottom: `${margins.bottom}px`,
    left: `${margins.left}px`,
  }

  const mouseRegion = useRef<HTMLDivElement>(null)
  const {x: hoverX, y: hoverY} = useMousePos(mouseRegion.current)

  return (
    <div className="minard-plot" style={plotStyle}>
      <Axes env={env}>
        <div className="minard-layers" style={layersStyle}>
          {config.layers.map((layer, i) => {
            switch (layer.type) {
              case 'line':
                return <LineLayer key={i} layerIndex={i} env={env} />
              case 'histogram':
                return (
                  <HistogramLayer
                    key={i}
                    layerIndex={i}
                    env={env}
                    hoverX={hoverX}
                    hoverY={hoverY}
                  />
                )
              case 'heatmap':
                return <HeatmapLayer key={i} layerIndex={i} env={env} />
              default:
                return null
            }
          })}
        </div>
        <div
          className="minard-interaction-region"
          style={layersStyle}
          ref={mouseRegion}
        />
      </Axes>
    </div>
  )
}
