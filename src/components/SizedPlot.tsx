import * as React from 'react'
import {
  useRef,
  useMemo,
  useCallback,
  FunctionComponent,
  CSSProperties,
} from 'react'

import {Axes} from './Axes'
import {SizedConfig} from '../types'
import {HistogramLayer} from './HistogramLayer'
import {LineLayer} from './LineLayer'
import {HeatmapLayer} from './HeatmapLayer'
import {Brush} from './Brush'
import {usePlotEnv} from '../utils/usePlotEnv'
import {useMousePos} from '../utils/useMousePos'
import {useDragEvent} from '../utils/useDragEvent'
import {useForceUpdate} from '../utils/useForceUpdate'

interface Props {
  config: SizedConfig
}

export const SizedPlot: FunctionComponent<Props> = ({config}) => {
  const env = usePlotEnv(config)
  const forceUpdate = useForceUpdate()

  const {
    margins,
    config: {width, height},
  } = env

  const plotStyle = useMemo(
    () =>
      ({
        position: 'relative',
        width: `${width}px`,
        height: `${height}px`,
      } as CSSProperties),
    [width, height]
  )

  const layersStyle = useMemo(
    () =>
      ({
        position: 'absolute',
        top: `${margins.top}px`,
        right: `${margins.right}px`,
        bottom: `${margins.bottom}px`,
        left: `${margins.left}px`,
        cursor: 'crosshair',
      } as CSSProperties),
    [margins]
  )

  const mouseRegion = useRef<HTMLDivElement>(null)
  const hoverEvent = useMousePos(mouseRegion.current)
  const dragEvent = useDragEvent(mouseRegion.current)
  const hoverX = dragEvent ? null : hoverEvent.x
  const hoverY = dragEvent ? null : hoverEvent.y

  const setXDomain = useCallback(
    (xDomain: number[]) => {
      env.xDomain = xDomain
      forceUpdate()
    },
    [env]
  )

  const setYDomain = useCallback(
    (yDomain: number[]) => {
      env.yDomain = yDomain
      forceUpdate()
    },
    [env]
  )

  const resetDomains = useCallback(() => {
    env.resetDomains()
    forceUpdate()
  }, [env])

  return (
    <div className="minard-plot" style={plotStyle}>
      <Axes env={env}>
        <div className="minard-layers" style={layersStyle}>
          {config.layers.map((layer, i) => {
            switch (layer.type) {
              case 'line':
                return (
                  <LineLayer
                    key={i}
                    layerIndex={i}
                    env={env}
                    hoverX={hoverX}
                    hoverY={hoverY}
                  />
                )
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
          onDoubleClick={resetDomains}
        >
          <Brush
            event={dragEvent}
            env={env}
            onSetXDomain={setXDomain}
            onSetYDomain={setYDomain}
          />
        </div>
      </Axes>
    </div>
  )
}
