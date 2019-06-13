import * as React from 'react'
import {useRef, FunctionComponent} from 'react'

import {Tooltip} from './Tooltip'
import {Props as LineLayerProps} from './LineLayer'
import {FILL} from '../constants/columnKeys'
import {LineHoverDimension, LineData} from '../types'
import {getPointsTooltipData} from '../utils/tooltip'
import {getLineHoverPoints} from '../utils/getLineHoverPoints'
import {drawLines} from '../utils/drawLines'
import {drawLineHoverData} from '../utils/drawLineHoverData'
import {useCanvas} from '../utils/useCanvas'

interface Props extends LineLayerProps {
  rowIndices: number[] | null
  dimension: LineHoverDimension
  simplifiedLineData: LineData
}

export const LineHoverLayer: FunctionComponent<Props> = ({
  rowIndices,
  dimension,
  simplifiedLineData,
  config,
  plotConfig,
  spec,
  width,
  height,
  xScale,
  yScale,
  columnFormatter,
}) => {
  const {
    interpolation,
    x: xColKey,
    y: yColKey,
    fill: fillColKeys,
    lineWidth,
    shadeBelow,
    shadeBelowOpacity,
  } = config

  const xColData = spec.table.getColumn(xColKey, 'number')
  const yColData = spec.table.getColumn(yColKey, 'number')
  const groupColData = spec.table.getColumn(FILL, 'number')
  const fillScale = spec.scales.fill

  const points = getLineHoverPoints(
    spec.table,
    rowIndices,
    xColKey,
    yColKey,
    xScale,
    yScale,
    fillScale
  )

  const crosshairColor = plotConfig.legendCrosshairColor

  const crosshairX =
    dimension === 'xy' || dimension === 'x'
      ? xScale(xColData[rowIndices[0]])
      : null

  const crosshairY =
    dimension === 'xy' || dimension === 'y'
      ? yScale(yColData[rowIndices[0]])
      : null

  const canvasRef = useRef<HTMLCanvasElement>(null)

  useCanvas(canvasRef, width, height, context => {
    if (dimension === 'xy') {
      const groupKey = groupColData[rowIndices[0]]
      const lineDatum = simplifiedLineData[groupKey]

      // Highlight the line that the single hovered point belongs to
      drawLines({
        context,
        lineData: {[groupKey]: lineDatum},
        interpolation,
        lineWidth: lineWidth * 2,
        shadeBelow,
        shadeBelowOpacity: shadeBelowOpacity * 1.5,
        shadeAboveY: height,
      })
    }

    drawLineHoverData({
      context,
      width,
      height,
      crosshairX,
      crosshairY,
      crosshairColor,
      points,
      radius: lineWidth * 2,
    })
  })

  const tooltipData = getPointsTooltipData(
    rowIndices,
    spec.table,
    config.x,
    config.y,
    FILL,
    columnFormatter,
    fillColKeys,
    fillScale
  )

  return (
    <>
      <canvas
        className="giraffe-layer giraffe-layer-hover-line"
        ref={canvasRef}
        style={{position: 'absolute'}}
        data-testid="giraffe-layer-hover-line"
      />
      <Tooltip data={tooltipData} config={plotConfig} />
    </>
  )
}
