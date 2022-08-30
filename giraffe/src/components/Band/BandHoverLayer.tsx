import * as React from 'react'
import {useRef, FunctionComponent} from 'react'

import {Tooltip} from '../Tooltip'
import {Props as BandLayerProps} from './BandLayer'
import {FILL} from '../../constants/columnKeys'
import {BandLineMap, LineHoverDimension, LineData} from '../../types'
import {getBandTooltipData} from '../../utils/legend/tooltip'
import {getBandHoverPoints} from '../../utils/bandHover'
import {drawLines} from '../../utils/drawLines'
import {drawLineHoverData} from '../../utils/drawLineHoverData'
import {useCanvas} from '../../utils/useCanvas'

interface Props extends BandLayerProps {
  bandHoverIndices: BandLineMap
  dimension: LineHoverDimension
  simplifiedLineData: LineData
}

export const BandHoverLayer: FunctionComponent<Props> = ({
  bandHoverIndices,
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
    lowerColumnName,
    mainColumnName: rowColumnName,
    shadeOpacity,
    upperColumnName,
  } = config

  const xColData = spec.table.getColumn(xColKey, 'number')
  const yColData = spec.table.getColumn(yColKey, 'number')
  const groupColData = spec.table.getColumn(FILL, 'number')

  const {rowLines} = bandHoverIndices

  const points = getBandHoverPoints(
    spec.table,
    rowLines,
    xColKey,
    yColKey,
    xScale,
    yScale,
    spec.lineData
  )

  const crosshairColor = plotConfig.legendCrosshairColor

  const crosshairX =
    dimension === 'xy' || dimension === 'x'
      ? xScale(xColData[rowLines[0]])
      : null

  const crosshairY =
    dimension === 'xy' || dimension === 'y'
      ? yScale(yColData[rowLines[0]])
      : null

  const canvasRef = useRef<HTMLCanvasElement>(null)

  useCanvas(canvasRef, width, height, context => {
    if (dimension === 'xy') {
      const groupKey = groupColData[rowLines[0]]
      const lineDatum = simplifiedLineData[groupKey]

      // Highlight the line that the single hovered point belongs to
      drawLines({
        context,
        lineData: {[groupKey]: lineDatum},
        interpolation,
        lineWidth: lineWidth * 2,
        shadeBelow: false,
        shadeBelowOpacity: shadeOpacity * 1.5,
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

  const tooltipData = getBandTooltipData(
    bandHoverIndices,
    config.x,
    config.y,
    rowColumnName,
    lowerColumnName,
    upperColumnName,
    columnFormatter,
    fillColKeys,
    spec
  )

  return (
    <>
      <canvas
        className="giraffe-layer giraffe-band-hover-line"
        ref={canvasRef}
        style={{position: 'absolute'}}
        data-testid="giraffe-band-hover-line"
      />
      <Tooltip data={tooltipData} config={plotConfig} />
    </>
  )
}

BandHoverLayer.displayName = 'BandHoverLayer'
