import React, {
  CSSProperties,
  FunctionComponent,
  RefObject,
  useCallback,
} from 'react'

import {Axes} from './Axes'
import {
  AnnotationLayerConfig,
  BandLayerConfig,
  InteractionHandlerArguments,
  LayerTypes,
  LineLayerConfig,
  MosaicLayerConfig,
  RectLayerConfig,
  ScatterLayerConfig,
  SingleStatLayerConfig,
  SizedConfig,
  SpecTypes,
} from '../types'

import {AnnotationLayer} from './AnnotationLayer'
import {SingleStatLayer} from './SingleStatLayer'
import {LineLayer} from './LineLayer'
import {BandLayer} from './BandLayer'
import {ScatterLayer} from './ScatterLayer'
import {RectLayer} from './RectLayer'
import {MosaicLayer} from './MosaicLayer'
import GeoLayer from './GeoLayer'

import {Brush} from './Brush'
import {rangeToDomain} from '../utils/brush'
import {PlotEnv} from '../utils/PlotEnv'
import {useMousePos} from '../utils/useMousePos'
import {useDragEvent} from '../utils/useDragEvent'
import {useForceUpdate} from '../utils/useForceUpdate'
import {LatestValueTransform} from './LatestValueTransform'
import {newTableFromConfig} from '../utils/newTable'
import {GeoLayerConfig} from '../types/geo'
import {nearestTimestamp} from '../utils/nearestTimestamp'

export interface SizedPlotProps {
  axesCanvasRef: RefObject<HTMLCanvasElement>
  config: SizedConfig
  env: PlotEnv
  layerCanvasRef: RefObject<HTMLCanvasElement>
}

export const SizedPlot: FunctionComponent<SizedPlotProps> = ({
  axesCanvasRef,
  children,
  config: userConfig,
  env,
  layerCanvasRef,
}) => {
  const forceUpdate = useForceUpdate()
  const [hoverEvent, hoverTargetProps] = useMousePos()
  const [dragEvent, dragTargetProps] = useDragEvent()
  const hoverX = dragEvent ? null : hoverEvent.x
  const hoverY = dragEvent ? null : hoverEvent.y

  const handleYBrushEnd = useCallback(
    (yRange: number[]) => {
      env.yDomain = rangeToDomain(yRange, env.yScale, env.innerHeight).reverse()
      forceUpdate()
    },
    [env.yScale, env.innerHeight, forceUpdate]
  )

  const {margins, config} = env
  const {width, height, showAxes} = config

  const resetDomains = env => {
    env.resetDomains()
    forceUpdate()
  }

  // spec types applicable to annotations.
  // add to this set as new plot types are added.
  const annotationSpecTypes = new Set<string>()
  annotationSpecTypes.add(SpecTypes.Line)
  annotationSpecTypes.add(SpecTypes.Band)

  const memoizedResetDomains = useCallback(() => {
    env.resetDomains()
    forceUpdate()
  }, [env])

  const defaultSpec = env.getSpec(0)

  const getNearestDataPoint = graphPoint => {
    // this gets the actual value of the point given:
    // (the x value of a particular point on the x axis)
    const valueX = env.xScale.invert(graphPoint)

    // now find the nearest data point:
    let nearest = NaN
    if (
      valueX &&
      defaultSpec &&
      'lineData' in defaultSpec &&
      annotationSpecTypes.has(defaultSpec.type)
    ) {
      const timestamps = defaultSpec.lineData[0]?.xs ?? []
      nearest = nearestTimestamp(timestamps, valueX)
    }
    return nearest
  }

  // need them both (need the actual value for hovering)
  // so expanding it out
  const valueX = env.xScale.invert(hoverEvent.x)
  const clampedValueX = getNearestDataPoint(hoverEvent.x)

  const plotInteraction: InteractionHandlerArguments = {
    clampedValueX,
    hoverX: hoverEvent.x,
    hoverY: hoverEvent.y,
    valueX,
    valueY: env.yScale.invert(hoverEvent.y),
    xDomain: env.xDomain,
    yDomain: env.yDomain,
    resetDomains: () => {
      resetDomains(env)
    },
  }

  const handleXBrushEnd = useCallback(
    (xRange: number[]) => {
      if (userConfig?.interactionHandlers?.onXBrush) {
        const beginning = getNearestDataPoint(xRange[0])
        const end = getNearestDataPoint(xRange[1])
        userConfig.interactionHandlers.onXBrush(beginning, end)
      } else {
        env.xDomain = rangeToDomain(xRange, env.xScale, env.innerWidth)
        forceUpdate()
      }
    },
    [env.xScale, env.innerWidth, userConfig.interactionHandlers, forceUpdate]
  )

  const noOp = () => {}
  const singleClick = userConfig.interactionHandlers?.singleClick
    ? event => {
        // If a click happens on an annotation line or annotation click handler, don't call the interaction handler.
        // There's already an annotation-specific handler for this, that'll handle this.
        if (
          event.target.classList.contains('giraffe-annotation-click-target') ||
          event.target.classList.contains('giraffe-annotation-line')
        ) {
          return
        }
        userConfig.interactionHandlers.singleClick(plotInteraction)
      }
    : noOp

  if (userConfig.interactionHandlers?.hover) {
    userConfig.interactionHandlers.hover(plotInteraction)
  }

  const fullsizeStyle: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  }

  // for single clicking:
  // the brush element we are using uses a dragListener that consumes the
  // 'onMouseDown'; thus the 'onClick' does not trigger.
  // the Drag listener keeps track of the difference between a drag and a single click,
  // and calls our 'singleClick' method when a single click happens.
  // see useDragEvents.ts (the DragEvent in particular)
  // in the src/util directory for more details.

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
      {showAxes && (
        <Axes env={env} canvasRef={axesCanvasRef} style={fullsizeStyle} />
      )}
      <div
        className="giraffe-inner-plot"
        data-testid="giraffe-inner-plot"
        style={{
          position: 'absolute',
          top: `${margins.top}px`,
          right: `${margins.right}px`,
          bottom: `${margins.bottom}px`,
          left: `${margins.left}px`,
          cursor: `${userConfig.cursor || 'crosshair'}`,
        }}
        onDoubleClick={memoizedResetDomains}
        {...hoverTargetProps}
        {...dragTargetProps}
      >
        <div className="giraffe-layers" style={fullsizeStyle}>
          {config.layers.map((layerConfig, layerIndex) => {
            if (layerConfig.type === LayerTypes.Geo) {
              return (
                <GeoLayer
                  key={layerIndex}
                  table={newTableFromConfig(config)}
                  config={layerConfig as GeoLayerConfig}
                  plotConfig={config}
                />
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
                yColumnType: env.yColumnType,
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
              yColumnType: spec.yColumnType,
              columnFormatter: env.getFormatterForColumn,
            }

            switch (spec.type) {
              case SpecTypes.Annotation:
                return (
                  <AnnotationLayer
                    key={layerIndex}
                    {...sharedProps}
                    spec={spec}
                    config={layerConfig as AnnotationLayerConfig}
                  />
                )
              case SpecTypes.Line:
                return (
                  <LineLayer
                    canvasRef={layerCanvasRef}
                    key={layerIndex}
                    {...sharedProps}
                    spec={spec}
                    config={layerConfig as LineLayerConfig}
                  />
                )

              case SpecTypes.Band:
                return (
                  <BandLayer
                    canvasRef={layerCanvasRef}
                    key={layerIndex}
                    {...sharedProps}
                    spec={spec}
                    config={layerConfig as BandLayerConfig}
                  />
                )

              case SpecTypes.Scatter:
                return (
                  <ScatterLayer
                    key={layerIndex}
                    {...sharedProps}
                    spec={spec}
                    config={layerConfig as ScatterLayerConfig}
                  />
                )

              case SpecTypes.Rect:
                return (
                  <RectLayer
                    canvasRef={layerCanvasRef}
                    key={layerIndex}
                    {...sharedProps}
                    spec={spec}
                    config={layerConfig as RectLayerConfig}
                  />
                )

              case SpecTypes.Mosaic: {
                return (
                  <MosaicLayer
                    key={layerIndex}
                    {...sharedProps}
                    spec={spec}
                    config={layerConfig as MosaicLayerConfig}
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
          onClick={singleClick}
        />
      </div>
    </div>
  )
}

SizedPlot.displayName = 'SizedPlot'
