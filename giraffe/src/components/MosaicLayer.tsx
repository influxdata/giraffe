import * as React from 'react'
import {useRef, FunctionComponent} from 'react'

import {useCanvas} from '../utils/useCanvas'
import {drawMosaic} from '../utils/drawMosaic'
import {
  MosaicLayerConfig,
  MosaicLayerSpec,
  LayerProps,
  LegendData,
} from '../types'
import {
  findHoveredBoxes,
  getMosaicTooltipData,
} from '../utils/legend/mosaicTooltip'
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
  const hoveredRowIndices = findHoveredBoxes(
    config.hoverDimension,
    hoverX,
    hoverY,
    spec.table,
    xScale,
    yScale,
    spec.yDomain,
    spec.ySeries,
    width,
    height
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

  let tooltipData: LegendData = []
  if (hoveredRowIndices.length > 0) {
    tooltipData = getMosaicTooltipData(
      hoveredRowIndices,
      spec.table,
      spec.inputTable,
      config.x,
      spec.yColumnsName,
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
