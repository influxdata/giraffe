import React, {
  CSSProperties,
  FunctionComponent,
  RefObject,
  useCallback,
  useEffect,
  useState,
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

  const [interactionHandlers, setInteractionHandlers] = useState(
    userConfig.interactionHandlers
  )
  // This will launch only if propName value has chaged.
  useEffect(() => {
    console.log('int handlers changed!', userConfig.interactionHandlers)
    setInteractionHandlers(userConfig.interactionHandlers)
  }, [userConfig.interactionHandlers])

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

  const memoizedResetDomains = useCallback(() => {
    env.resetDomains()
    forceUpdate()
  }, [env])

  const defaultSpec = env.getSpec(0)

  const valueX = env.xScale.invert(hoverEvent.x)
  let clampedValueX = NaN

  if (
    valueX &&
    (defaultSpec?.type === SpecTypes.Band ||
      defaultSpec?.type === SpecTypes.Line)
  ) {
    const timestamps = defaultSpec?.lineData[0]?.xs ?? []
    clampedValueX = nearestTimestamp(timestamps, valueX)
  }

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
      console.log('in handleXBrushEnd; range??', xRange)
      console.log('plot interaction??', plotInteraction)

      if (interactionHandlers?.onXBrush) {
        console.log('in my xbrush!!! ack 44a')
        interactionHandlers.onXBrush(xRange)
      } else {
        env.xDomain = rangeToDomain(xRange, env.xScale, env.innerWidth)
        console.log('(normal zooming) new env domain???', env.xDomain)
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

        console.log(
          '(ACK!!! 53) in singleclick, using plot interaction:',
          plotInteraction
        )
        userConfig.interactionHandlers.singleClick(plotInteraction)
      }
    : noOp

  if (userConfig.interactionHandlers?.hover) {
    userConfig.interactionHandlers.hover(plotInteraction)
  }

  const handleOnMouseUpEnd = event => {
    console.log(
      '22-UPDATED  here in on handle on mouse up end-ACK-updated; ',
      clampedValueX,
      plotInteraction
    )
    singleClick(event)
  }

  const fullsizeStyle: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  }

  // for single clicking; using mouseup, since the onClick only gets through
  // with a double click; and the hover and drag target does not use a mouse up;
  // they are:  hover:  mouseEnter, mousemove, mouseleave
  //            drag target: mouseDown
  // and every time there is a single click, the mouse goes up.  so using that instead.
  //console.log("switched to single click..... ACK")

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
          onMouseUpEnd={handleOnMouseUpEnd}
        />
      </div>
    </div>
  )
}

SizedPlot.displayName = 'SizedPlot'
