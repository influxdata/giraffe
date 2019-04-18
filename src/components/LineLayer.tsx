import * as React from 'react'
import {useRef, useLayoutEffect, useMemo, FunctionComponent} from 'react'

import {LineLayerConfig} from '../types'
import {PlotEnv} from '../utils/PlotEnv'
import {Tooltip} from './Tooltip'
import {useHoverLineIndices} from '../utils/useHoverLineIndices'
import {getLineTooltipData} from '../utils/getLineTooltipData'
import {getLineHoverPoints} from '../utils/getLineHoverPoints'
import {drawLinePoints} from '../utils/drawLinePoints'
import {drawLines} from '../utils/drawLines'
import {collectLineData, simplifyLineData} from '../utils/lineData'

interface Props {
  env: PlotEnv
  layerIndex: number
  hoverX: number
  hoverY: number
}

export const LineLayer: FunctionComponent<Props> = ({
  env,
  layerIndex,
  hoverX,
}) => {
  const linesCanvas = useRef<HTMLCanvasElement>(null)
  const legendCanvas = useRef<HTMLCanvasElement>(null)
  const table = env.getTable(layerIndex)
  const fillScale = env.getScale(layerIndex, 'fill')
  const layer = env.config.layers[layerIndex] as LineLayerConfig
  const {interpolation, x: xColKey, y: yColKey, fill: fillColKeys} = layer
  const {
    xScale,
    yScale,
    innerWidth: width,
    innerHeight: height,
    config: {legendCrosshairColor: hoverLineColor},
  } = env

  const lineData = useMemo(
    () => collectLineData(table, xColKey, yColKey, fillScale),
    [table, xColKey, yColKey, fillScale]
  )

  // TODO: Simplify in data domain, resimplify when dimensions change on a
  // debounced timer (for fast resizes)
  const simplifiedLineData = useMemo(
    () => simplifyLineData(lineData, xScale, yScale),
    [lineData, xScale, yScale]
  )

  const hoverRowIndices = useHoverLineIndices(
    table,
    hoverX,
    xColKey,
    xScale,
    width
  )

  const tooltipData = getLineTooltipData(
    table,
    hoverRowIndices,
    xColKey,
    yColKey,
    fillColKeys,
    fillScale
  )

  const hoverLinePosition = tooltipData ? xScale(tooltipData.xMin) : null

  const hoverPoints = getLineHoverPoints(
    table,
    hoverRowIndices,
    xColKey,
    yColKey,
    xScale,
    yScale,
    fillScale
  )

  useLayoutEffect(() => {
    drawLines({
      canvas: linesCanvas.current,
      lineData: simplifiedLineData,
      interpolation,
      width,
      height,
    })
  }, [simplifiedLineData, linesCanvas.current, interpolation, width, height])

  useLayoutEffect(() => {
    drawLinePoints({
      canvas: legendCanvas.current,
      hoverLinePosition,
      hoverLineColor,
      hoverPoints,
      width,
      height,
    })
  }, [
    hoverPoints,
    hoverLineColor,
    hoverLinePosition,
    width,
    height,
    legendCanvas.current,
  ])

  return (
    <>
      <canvas
        className="vis-layer line"
        ref={linesCanvas}
        style={{position: 'absolute'}}
      />
      <canvas
        className="vis-layer line-interactions"
        ref={legendCanvas}
        style={{position: 'absolute'}}
      />
      {tooltipData && <Tooltip data={tooltipData} env={env} />}
    </>
  )
}
