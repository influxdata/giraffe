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
import {SingleStatLayer} from './SingleStatLayer'
import {LineLayer} from './LineLayer'
import {BandLayer} from './BandLayer'
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
import {MosaicLayer} from './MosaicLayer'
import {GeoLayerConfig} from '../types/geo'
import GeoLayer from './GeoLayer'
import {AnnotationLayer} from './AnnotationLayer'

interface Props {
  config: SizedConfig
  axesCanvasRef: RefObject<HTMLCanvasElement>
  layerCanvasRef: RefObject<HTMLCanvasElement>
}

export const SizedPlot: FunctionComponent<Props> = ({
  config: userConfig,
  children,
  axesCanvasRef,
  layerCanvasRef,
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

  const plotInteraction: InteractionHandlerArguments = {
    hoverX: hoverEvent.x,
    hoverY: hoverEvent.y,
    valueX: env.xScale.invert(hoverEvent.x),
    valueY: env.yScale.invert(hoverEvent.y),
    xDomain: env.xDomain,
    yDomain: env.yDomain,
    resetDomains: () => {
      resetDomains(env)
    },
  }

  const singleClick = config.interactionHandlers?.singleClick
    ? (event) => {
    console.log(config.layers)
    console.log(env.xScale.invert(event.clientX))
    console.log(env.xScale.invert(config.layers[1]['annotations'][0].startValue))
    // const annotation = config.layers[1].annotations[0].startValue
    //     console.log(annotation)
        config.interactionHandlers.singleClick(plotInteraction)
      }
    : memoizedResetDomains

  if (config.interactionHandlers?.hover) {
    config.interactionHandlers.hover(plotInteraction)
  }

  const callbacks = {
    singleClick,
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
        onMouseUp={callbacks.singleClick}
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
        />
      </div>
    </div>
  )
}

SizedPlot.displayName = 'SizedPlot'
