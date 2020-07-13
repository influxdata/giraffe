import * as React from 'react'
import {useRef, FunctionComponent} from 'react'

import {useCanvas} from '../utils/useCanvas'
import {drawMosaic} from '../utils/drawMosaic'
import {
  MosaicLayerConfig,
  MosaicLayerSpec,
  LayerProps,
  TooltipData,
} from '../types'
import {findHoveredBoxes, getMosaicTooltipData} from '../utils/mosaicTooltip'
import {Tooltip} from './Tooltip'

export interface Props extends LayerProps {
  spec: MosaicLayerSpec
  config: MosaicLayerConfig
}

export const MosaicLayer: FunctionComponent<Props> = ({
  spec,
  config,
  plotConfig,
  width,
  height,
  xScale,
  yScale,
  hoverX,
  hoverY,
  yColumnType,
  columnFormatter,
}) => {
  console.log('YSCALE', yScale)
  const hoveredRowIndices = findHoveredBoxes(
    spec.table,
    hoverX,
    hoverY,
    xScale,
    yScale,
    spec.yDomain
  )

  const drawMosaicOptions = {
    table: spec.table,
    xScale,
    yScale,
    fillScale: spec.scales.fill,
    hoveredRowIndices,
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

  let tooltipData: TooltipData = []
  if (hoveredRowIndices.length > 0) {
    tooltipData = getMosaicTooltipData(
      hoveredRowIndices,
      spec.table,
      spec.inputTable,
      config.x,
      config.y,
      spec.columnGroupMaps.fill,
      spec.scales.fill,
      columnFormatter
    )
  }

  return (
    <>
      <canvas
        className="giraffe-layer giraffe-layer-mosaic"
        ref={canvasRef}
        style={{position: 'absolute'}}
        data-testid="giraffe-layer-mosaic"
      />
      {tooltipData.length > 0 && (
        <Tooltip data={tooltipData} config={plotConfig} />
      )}
    </>
  )
}

MosaicLayer.displayName = 'MosaicLayer'
