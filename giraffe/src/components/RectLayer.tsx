import React, {FunctionComponent, RefObject} from 'react'

import {useCanvas} from '../utils/useCanvas'
import {drawRects} from '../utils/drawRects'
import {
  findHoveredRects,
  get1DTooltipData,
  get2DTooltipData,
} from '../utils/rectTooltip'
import {Tooltip} from './Tooltip'
import {RectLayerConfig, RectLayerSpec, LayerProps, TooltipData} from '../types'

export interface Props extends LayerProps {
  spec: RectLayerSpec
  config: RectLayerConfig
  canvasRef: RefObject<HTMLCanvasElement>
}

export const RectLayer: FunctionComponent<Props> = ({
  spec,
  config,
  plotConfig,
  width,
  height,
  xScale,
  yScale,
  hoverX,
  hoverY,
  columnFormatter,
  canvasRef,
}) => {
  const hoveredRowIndices = findHoveredRects(
    spec.table,
    hoverX,
    hoverY,
    xScale,
    yScale,
    spec.binDimension
  )

  const drawRectsOptions = {
    table: spec.table,
    xScale,
    yScale,
    fillScale: spec.scales.fill,
    hoveredRowIndices,
    strokeWidth: config.strokeWidth,
    strokePadding: config.strokePadding,
    strokeOpacity: config.strokeOpacity,
    fillOpacity: config.fillOpacity,
  }

  useCanvas(
    canvasRef,
    width,
    height,
    context => drawRects({context, ...drawRectsOptions}),
    Object.values(drawRectsOptions)
  )

  let tooltipData: TooltipData = []

  if (hoveredRowIndices.length > 0 && spec.binDimension === 'xy') {
    tooltipData = get2DTooltipData(
      hoveredRowIndices,
      spec.table,
      spec.inputTable,
      config.x,
      (config as any).y,
      columnFormatter
    )
  } else if (hoveredRowIndices.length > 0 && spec.binDimension === 'x') {
    tooltipData = get1DTooltipData(
      hoveredRowIndices,
      spec.table,
      spec.inputTable,
      config.x,
      spec.columnGroupMaps.fill,
      spec.scales.fill,
      columnFormatter
    )
  }

  return (
    <>
      <canvas
        className="giraffe-layer giraffe-layer-rect"
        ref={canvasRef}
        style={{position: 'absolute'}}
        data-testid="giraffe-layer-rect"
      />
      {tooltipData.length > 0 && (
        <Tooltip data={tooltipData} config={plotConfig} />
      )}
    </>
  )
}

RectLayer.displayName = 'RectLayer'
