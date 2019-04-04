import * as React from 'react'
import {useRef, useLayoutEffect, useMemo, FunctionComponent} from 'react'
import {line, curveLinear} from 'd3-shape'
import {range} from 'd3-array'

import {Table, Scale, LineInterpolation, LineLayerConfig} from '../types'
import {PlotEnv} from '../utils/PlotEnv'
import {clearCanvas} from '../utils/clearCanvas'
import {GROUP_COL_KEY, CURVES} from '../constants'
import {isDefined} from '../utils/isDefined'

interface LineDatum {
  xs: number[]
  ys: number[]
  fill: string
}

const computeLineData = (
  table: Table,
  xColKey: string,
  yColKey: string,
  fillScale: Scale<string, string>
): LineDatum[] => {
  const xCol = table.columns[xColKey].data
  const yCol = table.columns[yColKey].data
  const groupCol = table.columns[GROUP_COL_KEY].data as string[]
  const groupKeys = new Set(groupCol)

  const result = []

  for (let groupKey of groupKeys) {
    let xs = []
    let ys = []

    for (let i = 0; i < table.length; i++) {
      if (groupCol[i] !== groupKey) {
        continue
      }

      xs.push(xCol[i])
      ys.push(yCol[i])
    }

    result.push({xs, ys, fill: fillScale(groupKey)})
  }

  return result
}

interface DrawLinesOptions {
  canvas: HTMLCanvasElement
  xScale: Scale<number, number>
  yScale: Scale<number, number>
  interpolation: LineInterpolation
  lineData: LineDatum[]
  width: number
  height: number
}

const drawLines = ({
  canvas,
  xScale,
  yScale,
  lineData,
  interpolation,
  width,
  height,
}: DrawLinesOptions): void => {
  clearCanvas(canvas, width, height)

  const context = canvas.getContext('2d')

  for (const {xs, ys, fill} of lineData) {
    const lineGenerator: any = line()
      .context(context)
      .x((i: any) => xScale(xs[i]))
      .y((i: any) => yScale(ys[i]))
      .defined((i: any) => isDefined(xs[i]) && isDefined(ys[i]))
      .curve(CURVES[interpolation] || curveLinear)

    context.beginPath()
    context.strokeStyle = fill

    lineGenerator(range(0, xs.length))

    context.stroke()
  }
}

interface Props {
  env: PlotEnv
  layerIndex: number
  hoverX: number
  hoverY: number
}

export const LineLayer: FunctionComponent<Props> = ({env, layerIndex}) => {
  const table = env.getTable(layerIndex)
  const fillScale = env.getScale(layerIndex, 'fill')
  const layer = env.config.layers[layerIndex] as LineLayerConfig
  const {interpolation, x: xColKey, y: yColKey} = layer
  const {xScale, yScale, innerWidth: width, innerHeight: height} = env

  const lineData = useMemo(
    // TODO: Simplify with Ramer-Douglas-Peucker as well
    () => computeLineData(table, xColKey, yColKey, fillScale),
    [table, xColKey, yColKey, fillScale]
  )

  const canvas = useRef<HTMLCanvasElement>(null)

  useLayoutEffect(() => {
    drawLines({
      canvas: canvas.current,
      lineData,
      xScale,
      yScale,
      interpolation,
      width,
      height,
    })
  })

  return <canvas className="minard-layer histogram" ref={canvas} />
}
