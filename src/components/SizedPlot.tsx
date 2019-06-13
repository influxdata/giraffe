import * as React from 'react'
import {useRef, useCallback, FunctionComponent, CSSProperties} from 'react'

import {Axes} from './Axes'
import {
  SizedConfig,
  LineLayerConfig,
  ScatterLayerConfig,
  RectLayerConfig,
} from '../types'
import {LineLayer} from './LineLayer'
import {ScatterLayer} from './ScatterLayer'
import {RectLayer} from './RectLayer'
import {Brush} from './Brush'
import {rangeToDomain} from '../utils/brush'
import {usePlotEnv} from '../utils/usePlotEnv'
import {useMousePos} from '../utils/useMousePos'
import {useDragEvent} from '../utils/useDragEvent'
import {useForceUpdate} from '../utils/useForceUpdate'

interface Props {
  config: SizedConfig
}

export const SizedPlot: FunctionComponent<Props> = ({
  config: userConfig,
  children,
}) => {
  const env = usePlotEnv(userConfig)

  const forceUpdate = useForceUpdate()
  const innerPlotRef = useRef<HTMLDivElement>(null)
  const [hoverEvent, hoverProps] = useMousePos()
  const dragEvent = useDragEvent(innerPlotRef.current)
  const hoverX = dragEvent ? null : hoverEvent.x
  const hoverY = dragEvent ? null : hoverEvent.y

  const handleXBrushEnd = useCallback(
    (xRange: number[]) => {
      env.xDomain = rangeToDomain(xRange, env.xScale, env.innerWidth)
      forceUpdate()
    },
    [env.xScale, env.innerWidth, forceUpdate]
  )

  const handleYBrushEnd = useCallback(
    (yRange: number[]) => {
      env.yDomain = rangeToDomain(yRange, env.yScale, env.innerHeight).reverse()
      forceUpdate()
    },
    [env.yScale, env.innerHeight, forceUpdate]
  )

  const handleResetDomains = useCallback(() => {
    env.resetDomains()
    forceUpdate()
  }, [env])

  const {margins, config} = env
  const {width, height, showAxes} = config

  const fullsizeStyle: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  }

  return (
    <div
      className="giraffe-plot"
      style={{
        position: 'relative',
        width: `${width}px`,
        height: `${height}px`,
        userSelect: 'none',
      }}
    >
      {showAxes && <Axes env={env} style={fullsizeStyle} />}
      <div
        className="giraffe-inner-plot"
        style={{
          position: 'absolute',
          top: `${margins.top}px`,
          right: `${margins.right}px`,
          bottom: `${margins.bottom}px`,
          left: `${margins.left}px`,
          cursor: 'crosshair',
        }}
        ref={innerPlotRef}
        onDoubleClick={handleResetDomains}
        {...hoverProps}
      >
        <div className="giraffe-layers" style={fullsizeStyle}>
          {config.layers.map((layerConfig, layerIndex) => {
            const spec = env.getSpec(layerIndex)

            const sharedProps = {
              hoverX,
              hoverY,
              plotConfig: config,
              xScale: env.xScale,
              yScale: env.yScale,
              width: env.innerWidth,
              height: env.innerHeight,
              columnFormatter: env.getFormatterForColumn,
            }

            switch (spec.type) {
              case 'line':
                return (
                  <LineLayer
                    key={layerIndex}
                    {...sharedProps}
                    spec={spec}
                    config={layerConfig as LineLayerConfig}
                  />
                )

              case 'scatter': {
                return (
                  <ScatterLayer
                    key={layerIndex}
                    {...sharedProps}
                    spec={spec}
                    config={layerConfig as ScatterLayerConfig}
                  />
                )
              }

              case 'rect': {
                return (
                  <RectLayer
                    key={layerIndex}
                    {...sharedProps}
                    spec={spec}
                    config={layerConfig as RectLayerConfig}
                  />
                )
              }

              default:
                return null
            }
          })}
          {children && children}
        </div>
        <Brush
          event={dragEvent}
          width={env.innerWidth}
          height={env.innerHeight}
          onXBrushEnd={handleXBrushEnd}
          onYBrushEnd={handleYBrushEnd}
        />
      </div>
    </div>
  )
}
