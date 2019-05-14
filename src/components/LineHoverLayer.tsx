import * as React from 'react'
import {useRef, useLayoutEffect, FunctionComponent} from 'react'

import {Tooltip} from './Tooltip'
import {FILL_COL_KEY} from '../constants'
import {LineLayerConfig, LineHoverDimension} from '../types'
import {PlotEnv} from '../utils/PlotEnv'
import {LineData} from '../utils/lineData'
import {getTooltipData} from '../utils/lineTooltip'
import {getLineHoverPoints} from '../utils/getLineHoverPoints'
import {drawLines} from '../utils/drawLines'
import {drawLineHoverData} from '../utils/drawLineHoverData'
import {getGroupingColumn} from '../utils/getGroupingColumn'
import {getNumericColumn} from '../utils/getNumericColumn'
import {clearCanvas} from '../utils/clearCanvas'

interface Props {
  env: PlotEnv
  layerIndex: number
  lineData: LineData
  rowIndices: number[] | null
  dimension: LineHoverDimension
}

export const LineHoverLayer: FunctionComponent<Props> = ({
  env,
  layerIndex,
  lineData,
  rowIndices,
  dimension,
}) => {
  const table = env.getTable(layerIndex)
  const fillScale = env.getScale(layerIndex, 'fill')
  const layer = env.config.layers[layerIndex] as LineLayerConfig
  const {
    interpolation,
    x: xColKey,
    y: yColKey,
    fill: fillColKeys,
    lineWidth,
  } = layer

  const {
    xScale,
    yScale,
    innerWidth: width,
    innerHeight: height,
    config: {legendCrosshairColor: crosshairColor},
  } = env

  const {data: xColData} = getNumericColumn(table, xColKey)
  const {data: yColData} = getNumericColumn(table, yColKey)
  const {data: groupColData} = getGroupingColumn(table, FILL_COL_KEY)

  const tooltipData = getTooltipData(
    rowIndices,
    table,
    xColKey,
    yColKey,
    FILL_COL_KEY,
    env.getFormatterForColumn,
    fillColKeys,
    fillScale
  )

  // TODO: Pass cols directly
  const points = getLineHoverPoints(
    table,
    rowIndices,
    xColKey,
    yColKey,
    xScale,
    yScale,
    fillScale
  )

  let crosshairX =
    dimension === 'xy' || dimension === 'x'
      ? xScale(xColData[rowIndices[0]])
      : null

  let crosshairY =
    dimension === 'xy' || dimension === 'y'
      ? yScale(yColData[rowIndices[0]])
      : null

  const canvasRef = useRef<HTMLCanvasElement>(null)

  useLayoutEffect(() => {
    const canvas = canvasRef.current

    clearCanvas(canvas, width, height)

    if (dimension === 'xy') {
      const groupKey = groupColData[rowIndices[0]]
      const lineDatum = lineData[groupKey]

      // Highlight the line that the single hovered point belongs to
      drawLines({
        canvas,
        lineData: {[groupKey]: lineDatum},
        interpolation,
        lineWidth: lineWidth * 2,
      })
    }

    drawLineHoverData({
      canvas,
      width,
      height,
      crosshairX,
      crosshairY,
      crosshairColor,
      points,
      radius: lineWidth * 2,
    })
  })

  return (
    <>
      <canvas
        className="vis-layer line-interactions"
        ref={canvasRef}
        style={{position: 'absolute'}}
      />
      <Tooltip data={tooltipData} env={env} />
    </>
  )
}
