import * as React from 'react'
import {useRef, FunctionComponent} from 'react'

import {useCanvas} from '../utils/useCanvas'
import {drawMosaic} from '../utils/drawMosaic'
import {MosaicLayerConfig, MosaicLayerSpec, LayerProps} from '../types'
// import {
//   findHoveredRects,
//   get1DTooltipData,
//   get2DTooltipData,
// } from '../utils/rectTooltip'

export interface Props extends LayerProps {
  spec: MosaicLayerSpec
  config: MosaicLayerConfig
}

export const MosaicLayer: FunctionComponent<Props> = ({
  spec,
  config,
  width,
  height,
  xScale,
  yScale,
  yColumnType,
}) => {
  const drawMosaicOptions = {
    table: spec.table,
    xScale,
    yScale,
    fillScale: spec.scales.fill,
    yColumnType,
    strokeWidth: config.strokeWidth,
    strokePadding: config.strokePadding,
    strokeOpacity: config.strokeOpacity,
    fillOpacity: config.fillOpacity,
  }
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useCanvas(
    canvasRef,
    width,
    height,
    context => drawMosaic({context, ...drawMosaicOptions}),
    Object.values(drawMosaicOptions)
  )

  return (
    <>
      <canvas
        className="giraffe-layer giraffe-layer-mosaic"
        ref={canvasRef}
        style={{position: 'absolute'}}
        data-testid="giraffe-layer-mosaic"
      />
    </>
  )
}

MosaicLayer.displayName = 'MosaicLayer'
