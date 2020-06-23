import * as React from 'react'
import {useCallback, FunctionComponent, CSSProperties} from 'react'

import {Axes} from './Axes'
import {
  SizedConfig,
  GaugeLayerConfig,
  SingleStatLayerConfig,
  LineLayerConfig,
  ScatterLayerConfig,
  RectLayerConfig,
  LayerTypes,
  SpecTypes,
} from '../types'
import {GaugeLayer} from './GaugeLayer'
import {SingleStatLayer} from './SingleStatLayer'
import {LineLayer} from './LineLayer'
import {ScatterLayer} from './ScatterLayer'
import {RectLayer} from './RectLayer'
import {Brush} from './Brush'
import {rangeToDomain} from '../utils/brush'
import {usePlotEnv} from '../utils/usePlotEnv'
import {useMousePos} from '../utils/useMousePos'
import {useDragEvent} from '../utils/useDragEvent'
import {useForceUpdate} from '../utils/useForceUpdate'
import {LatestValueTransform} from './LatestValueTransform'
import {newTableFromConfig} from '../utils/newTable'

interface Props {
  config: SizedConfig
}

export const SizedPlot: FunctionComponent<Props> = ({
  config: userConfig,
  children,
}) => {
  const env = usePlotEnv(userConfig)

  const forceUpdate = useForceUpdate()
  const [hoverEvent, hoverTargetProps] = useMousePos()
  const [dragEvent, dragTargetProps] = useDragEvent()
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
        onDoubleClick={handleResetDomains}
        {...hoverTargetProps}
        {...dragTargetProps}
      >
        <div className="giraffe-layers" style={fullsizeStyle}>
          {config.layers.map((layerConfig, layerIndex) => {
            if (layerConfig.type === LayerTypes.Gauge) {
              return (
                <LatestValueTransform
                  key={layerIndex}
                  table={newTableFromConfig(config)}
                  allowString={true}
                >
                  {latestValue => (
                    <GaugeLayer
                      value={latestValue}
                      config={layerConfig as GaugeLayerConfig}
                    />
                  )}
                </LatestValueTransform>
              )
            }

            if (layerConfig.type === LayerTypes.Custom) {
              const renderProps = {
                key: layerIndex,
                width,
                height,
                innerWidth: env.innerWidth,
                innerHeight: env.innerHeight,
                xScale: env.xScale,
                yScale: env.yScale,
                xDomain: env.xDomain,
                yDomain: env.yDomain,
                columnFormatter: env.getFormatterForColumn,
              }

              return layerConfig.render(renderProps)
            }

            if (layerConfig.type === LayerTypes.SingleStat) {
              return (
                <LatestValueTransform
                  key={layerIndex}
                  table={newTableFromConfig(config)}
                  allowString={true}
                >
                  {latestValue => (
                    <SingleStatLayer
                      stat={latestValue}
                      config={layerConfig as SingleStatLayerConfig}
                    />
                  )}
                </LatestValueTransform>
              )
            }

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
              case SpecTypes.Line:
                return (
                  <LineLayer
                    key={layerIndex}
                    {...sharedProps}
                    spec={spec}
                    config={layerConfig as LineLayerConfig}
                  />
                )

              case SpecTypes.Scatter: {
                return (
                  <ScatterLayer
                    key={layerIndex}
                    {...sharedProps}
                    spec={spec}
                    config={layerConfig as ScatterLayerConfig}
                  />
                )
              }

              case SpecTypes.Rect: {
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

SizedPlot.displayName = 'SizedPlot'
