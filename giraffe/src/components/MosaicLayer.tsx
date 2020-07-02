import * as React from 'react'
import {useRef, FunctionComponent} from 'react'

import {useCanvas} from '../utils/useCanvas'
// import {drawRects} from '../utils/drawRects'
import {drawMosaic} from '../utils/drawMosaic'
//import {Tooltip} from './Tooltip'
import {
  MosaicLayerConfig,
  MosaicLayerSpec,
  LayerProps,
  //TooltipData,
} from '../types'

export interface Props extends LayerProps {
  spec: MosaicLayerSpec
  config: MosaicLayerConfig
}

export const MosaicLayer: FunctionComponent<Props> = ({
  spec,
  config,
  // plotConfig,
  width,
  height,
  xScale,
  yScale,
  yColumnType,
  // hoverX,
  // hoverY,
  // columnFormatter,
}) => {
  // const hoveredRowIndices = findHoveredMosaic(
  //   spec.table,
  //   hoverX,
  //   hoverY,
  //   xScale,
  //   yScale,
  //   spec.binDimension
  // )
//   console.log('SPEC IN MOSAICLAYER', spec)
  const drawMosaicOptions = {
    table: spec.table,
    xScale,
    yScale,
    fillScale: spec.scales.fill,
    yColumnType,
    // hoveredRowIndices,
    strokeWidth: config.strokeWidth,
    strokePadding: config.strokePadding,
    strokeOpacity: config.strokeOpacity,
    fillOpacity: config.fillOpacity,
  }
//   console.log('TABLE', drawMosaicOptions.table)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  // const drawRectangle() => {
  //   var ctx = canvas.getContext('2d')
  // }

  // const drawCircle = (
  //   ctx: CanvasRenderingContext2D
  //   //x: number,
  //   //y: number,
  //   // diameter: number = 70
  // ) => {
  //   ctx.beginPath()
  //   ctx.fillStyle = 'red'
  //   ctx.fillRect(100, 100, 100, 100)
  //   ctx.closePath()
  // }

  //   const drawCircle = (canvas: HTMLCanvasElement) => {
  //     //const canvas = document.getElementById('graph')
  //     const ctx = canvas.getContext('2d')
  //     ctx.beginPath()
  //     ctx.fillStyle = 'red'
  //     ctx.fillRect(100, 100, 100, 100)
  //     ctx.closePath()
  //   }

  useCanvas(
    canvasRef,
    width,
    height,
    context => drawMosaic({context, ...drawMosaicOptions}),
    Object.values(drawMosaicOptions)
  )

  // let tooltipData: TooltipData = []

  // if (hoveredRowIndices.length > 0 && spec.binDimension === 'xy') {
  //   tooltipData = get2DTooltipData(
  //     hoveredRowIndices,
  //     spec.table,
  //     spec.inputTable,
  //     config.x,
  //     (config as any).y,
  //     columnFormatter
  //   )
  // } else if (hoveredRowIndices.length > 0 && spec.binDimension === 'x') {
  //   tooltipData = get1DTooltipData(
  //     hoveredRowIndices,
  //     spec.table,
  //     spec.inputTable,
  //     config.x,
  //     spec.columnGroupMaps.fill,
  //     spec.scales.fill,
  //     columnFormatter
  //   )
  // }

  return (
    <>
      {/* <script type="application/javascript">
        function drawCircle() {
          var canvas = document.getElementById('graph');
          const ctx = canvas.getContext('2d');
          ctx.beginPath()
          ctx.fillStyle = 'red'
          ctx.fillRect(100, 100, 100, 100)
          ctx.closePath()
        }
      </script> */}
      {/* <body onLoad={drawCircle(canvas)}> */}
      <canvas
        className="giraffe-layer giraffe-layer-mosaic"
        ref={canvasRef}
        style={{position: 'absolute'}}
        data-testid="giraffe-layer-mosaic"
      />
      {/* {tooltipData.length > 0 && (
            <Tooltip data={tooltipData} config={plotConfig} />
          )} */}
      {/* </body> */}
    </>
  )
}

MosaicLayer.displayName = 'MosaicLayer'
