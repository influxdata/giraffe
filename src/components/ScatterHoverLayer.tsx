import React, {useRef, useLayoutEffect, FunctionComponent} from 'react'

import {PlotEnv} from '../utils/PlotEnv'
import {ScatterLayerConfig} from '../types'
import {useHoverPointIndices} from '../utils/useHoverPointIndices'
import {drawPoints} from '../utils/drawPoints'
import {Tooltip} from './Tooltip'
import {getPointsTooltipData} from '../utils/tooltip'
import {SCATTER_HOVER_POINT_SIZE} from '../constants'
import {FILL, SYMBOL} from '../constants/columnKeys'

interface Props {
  env: PlotEnv
  layerIndex: number
  hoverX: number
  hoverY: number
}

export const ScatterHoverLayer: FunctionComponent<Props> = ({
  env,
  layerIndex,
  hoverX,
  hoverY,
}) => {
  const layerConfig = env.config.layers[layerIndex] as ScatterLayerConfig
  const {
    x: xColKey,
    y: yColKey,
    fill: fillColKeys,
    symbol: symbolColKeys,
  } = layerConfig

  const {xScale, yScale, innerWidth: width, innerHeight: height} = env
  const fillScale = env.getScale(layerIndex, 'fill')
  const symbolScale = env.getScale(layerIndex, 'symbol')

  const table = env.getTable(layerIndex)
  const xColData = table.getColumn(xColKey, 'number')
  const yColData = table.getColumn(yColKey, 'number')
  const fillColData = table.getColumn(FILL, 'string')
  const symbolColData = table.getColumn(SYMBOL, 'string')

  const rowIndices = useHoverPointIndices(
    'xy',
    hoverX,
    hoverY,
    xColData,
    yColData,
    [],
    xScale,
    yScale,
    width,
    height
  )

  const canvasRef = useRef<HTMLCanvasElement>(null)

  useLayoutEffect(() => {
    if (!canvasRef.current) {
      return
    }

    drawPoints({
      canvas: canvasRef.current,
      width,
      height,
      xColData,
      yColData,
      fillColData,
      symbolColData,
      xScale,
      yScale,
      fillScale,
      symbolScale,
      rowIndices,
      pointSize: SCATTER_HOVER_POINT_SIZE,
    })
  })

  if (!rowIndices) {
    return null
  }

  const tooltipData = getPointsTooltipData(
    rowIndices,
    table,
    xColKey,
    yColKey,
    FILL,
    env.getFormatterForColumn,
    [...new Set([...fillColKeys, ...symbolColKeys])],
    fillScale
  )

  return (
    <>
      <canvas
        className="giraffe-layer scatter-interactions"
        ref={canvasRef}
        style={{position: 'absolute'}}
        data-testid="giraffe-layer--scatter-interact"
      />
      {tooltipData && <Tooltip data={tooltipData} env={env} />}
    </>
  )
}
