import * as React from 'react'
import {useRef, useLayoutEffect, useMemo, FunctionComponent} from 'react'
import {line, curveLinear} from 'd3-shape'
import {range} from 'd3-array'

import {Table, Scale, LineInterpolation, LineLayerConfig} from '../types'
import {PlotEnv} from '../utils/PlotEnv'
import {clearCanvas} from '../utils/clearCanvas'
import {CURVES} from '../constants'
import {isDefined} from '../utils/isDefined'
import {getGroupColumn} from '../utils/getGroupColumn'
import {simplify} from '../utils/simplify'
import {Tooltip} from './Tooltip'
import {useHoverLineIndices} from '../utils/useHoverLineIndices'
import {getLineTooltipData} from '../utils/getLineTooltipData'
import {getLineHoverPoints} from '../utils/getLineHoverPoints'

type LineData = Array<{
  xs: number[] | Float64Array
  ys: number[] | Float64Array
  fill: string
}>

const collectLineData = (
  table: Table,
  xColKey: string,
  yColKey: string,
  fillScale: Scale<string, string>
): LineData => {
  const xCol = table.columns[xColKey].data
  const yCol = table.columns[yColKey].data
  const {data: groupCol} = getGroupColumn(table)

  const resultByGroupKey = {}

  for (let i = 0; i < table.length; i++) {
    const groupKey = groupCol[i]

    if (!resultByGroupKey[groupKey]) {
      resultByGroupKey[groupKey] = {
        xs: [],
        ys: [],
        fill: fillScale(groupKey),
      }
    }

    resultByGroupKey[groupKey].xs.push(xCol[i])
    resultByGroupKey[groupKey].ys.push(yCol[i])
  }

  return Object.values(resultByGroupKey)
}

const simplifyLineData = (lineData: LineData, xScale, yScale): LineData =>
  lineData.map(({xs: initialXs, ys: initialYs, fill}) => {
    const [xs, ys] = simplify(
      initialXs.map(x => xScale(x)),
      initialYs.map(y => yScale(y)),
      1
    )

    return {xs, ys, fill}
  })

interface DrawLinesOptions {
  canvas: HTMLCanvasElement
  interpolation: LineInterpolation
  lineData: LineData
  width: number
  height: number
  hoverLinePosition: number | null
  hoverLineColor: string
  hoverPoints: Array<{x: number; y: number; fill: string}> | null
}

const drawLines = ({
  canvas,
  lineData,
  interpolation,
  width,
  height,
  hoverLinePosition,
  hoverLineColor,
  hoverPoints,
}: DrawLinesOptions): void => {
  clearCanvas(canvas, width, height)

  const context = canvas.getContext('2d')

  for (const {xs, ys, fill} of lineData) {
    const lineGenerator: any = line()
      .context(context)
      .x((i: any) => xs[i])
      .y((i: any) => ys[i])
      .defined((i: any) => isDefined(xs[i]) && isDefined(ys[i]))
      .curve(CURVES[interpolation] || curveLinear)

    context.strokeStyle = fill
    context.beginPath()
    lineGenerator(range(0, xs.length))
    context.stroke()
  }

  if (hoverLinePosition !== null) {
    context.strokeStyle = hoverLineColor
    context.beginPath()
    context.moveTo(hoverLinePosition, 0)
    context.lineTo(hoverLinePosition, height)
    context.stroke()
  }

  if (hoverPoints !== null) {
    for (const {x, y, fill} of hoverPoints) {
      context.beginPath()
      context.arc(x, y, 2.5, 0, 2 * Math.PI)
      context.fillStyle = fill
      context.fill()
    }
  }
}

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
  const canvas = useRef<HTMLCanvasElement>(null)
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

  const hoverLinePosition = tooltipData ? xScale(tooltipData.xMin) : hoverX

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
      canvas: canvas.current,
      lineData: simplifiedLineData,
      interpolation,
      width,
      height,
      hoverLinePosition,
      hoverLineColor,
      hoverPoints,
    })
  })

  return (
    <>
      <canvas className="minard-layer histogram" ref={canvas} />
      {tooltipData && <Tooltip data={tooltipData} env={env} />}
    </>
  )
}
