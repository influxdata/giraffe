import * as React from 'react'
import {useRef, FunctionComponent} from 'react'

import {useCanvas} from '../utils/useCanvas'
import {drawMosaic} from '../utils/drawMosaic'
import {MosaicLayerConfig, MosaicLayerSpec, LayerProps} from '../types'
import {findHoveredBoxes, getMosaicTooltipData} from '../utils/mosaicTooltip'
import {Tooltip} from './Tooltip'
//import {TooltipData} from '../types'

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
  hoverX,
  hoverY,
  yColumnType,
  columnFormatter,
}) => {
  const hoveredRowIndices = findHoveredBoxes(
    spec.table,
    hoverX,
    hoverY,
    xScale,
    yScale
    //spec.binDimension
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

  const tooltipData = getMosaicTooltipData(
    hoveredRowIndices,
    spec.table,
    spec.inputTable,
    config.x,
    //(config as any).y,
    columnFormatter
  )

  // const tooltipData: TooltipData = [
  //   {
  //     colors: ['white'],
  //     key: '',
  //     name: 'type',
  //     type: 'string',
  //     values: ['Mosaic'],
  //   },
  //   {
  //     colors: ['orange'],
  //     key: '',
  //     name: 'data',
  //     type: 'string',
  //     values: ['cpu'],
  //   },
  // ]
  const plotConfig = {
    layers: [],
    legendBackgroundColor: '#1c1c21',
    legendBorder: '1px solid #202028',
    legendCrosshairColor: '#31313d',
    legendFont: '12px sans-serif',
    legendFontBrightColor: '#c6cad3',
    legendFontColor: '#8e91a1',
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
