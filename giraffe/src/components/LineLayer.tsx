import * as React from 'react'
import {useMemo, useRef, FunctionComponent} from 'react'

import {LayerProps, LineLayerSpec, LineLayerConfig, DomainLabel} from '../types'
import {LineHoverLayer} from './LineHoverLayer'
import {simplifyLineData, getDomainDataFromLines} from '../utils/lineData'
import {useCanvas} from '../utils/useCanvas'
import {drawLines} from '../utils/drawLines'
import {useHoverPointIndices} from '../utils/useHoverPointIndices'
import {FILL} from '../constants/columnKeys'

export interface Props extends LayerProps {
  spec: LineLayerSpec
  config: LineLayerConfig
}

export const LineLayer: FunctionComponent<Props> = props => {
  const {config, spec, width, height, xScale, yScale, hoverX, hoverY} = props
  const {position} = config

  const simplifiedLineData = useMemo(
    () => simplifyLineData(spec.lineData, xScale, yScale),
    [spec.lineData, xScale, yScale]
  )

  const drawLinesOptions = {
    lineData: simplifiedLineData,
    interpolation: config.interpolation,
    lineWidth: config.lineWidth,
    shadeBelow: config.shadeBelow,
    shadeBelowOpacity: config.shadeBelowOpacity,
    shadeAboveY: height,
  }

  const canvasRef = useRef<HTMLCanvasElement>(null)

  useCanvas(
    canvasRef,
    width,
    height,
    context => drawLines({context, ...drawLinesOptions}),
    Object.values(drawLinesOptions)
  )

  let hoverDimension: 'x' | 'y' | 'xy'

  if (
    config.hoverDimension === 'auto' &&
    Object.keys(spec.lineData).length > config.maxTooltipRows
  ) {
    hoverDimension = 'xy'
  } else if (config.hoverDimension === 'auto') {
    hoverDimension = 'x'
  } else {
    hoverDimension = config.hoverDimension
  }

  const hoverYColumnData =
    position === 'stacked'
      ? getDomainDataFromLines(spec.lineData, DomainLabel.Y)
      : spec.table.getColumn(config.y, 'number')
  const hoverRowIndices = useHoverPointIndices(
    hoverDimension,
    hoverX,
    hoverY,
    spec.table.getColumn(config.x, 'number'),
    hoverYColumnData,
    spec.table.getColumn(FILL, 'number'),
    xScale,
    yScale,
    width,
    height
  )

  const hasHoverData = hoverRowIndices && hoverRowIndices.length > 0

  return (
    <>
      <canvas
        className="giraffe-layer giraffe-layer-line"
        ref={canvasRef}
        style={{
          position: 'absolute',
          opacity: hoverDimension === 'xy' && hasHoverData ? 0.4 : 1,
        }}
        data-testid="giraffe-layer-line"
      />
      {hasHoverData && (
        <LineHoverLayer
          {...props}
          rowIndices={hoverRowIndices}
          dimension={hoverDimension}
          simplifiedLineData={simplifiedLineData}
        />
      )}
    </>
  )
}

LineLayer.displayName = 'LineLayer'
