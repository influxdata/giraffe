import * as React from 'react'
import {useRef, useLayoutEffect, FunctionComponent} from 'react'
import {line, curveLinear} from 'd3-shape'
import {range} from 'd3-array'

import {Table, Scale, LineInterpolation, LineLayerConfig} from '../types'
import {PlotEnv} from '../utils/PlotEnv'
import {clearCanvas} from '../utils/clearCanvas'
import {GROUP_COL_KEY, CURVES} from '../constants'
import {isDefined} from '../utils/isDefined'

interface DrawLinesOptions {
  canvas: HTMLCanvasElement
  table: Table
  xColKey: string
  yColKey: string
  xScale: Scale<number, number>
  yScale: Scale<number, number>
  fillScale: Scale<string, string>
  interpolation: LineInterpolation
  width: number
  height: number
}

const drawLines = ({
  canvas,
  table,
  xColKey,
  yColKey,
  xScale,
  yScale,
  fillScale,
  interpolation,
  width,
  height,
}: DrawLinesOptions): void => {
  clearCanvas(canvas, width, height)

  const context = canvas.getContext('2d')

  const xCol = table.columns[xColKey].data
  const yCol = table.columns[yColKey].data
  const groupCol = table.columns[GROUP_COL_KEY].data as string[]

  const groupKeys = new Set(groupCol)

  for (const groupKey of groupKeys) {
    let xs = []
    let ys = []

    for (let i = 0; i < table.length; i++) {
      // TODO: This can be done once when the config for the `PlotEnv` is set,
      // rather than every time the `LineLayer` renders
      if (groupCol[i] === groupKey) {
        xs.push(xCol[i])
        ys.push(yCol[i])
      }
    }

    const lineGenerator: any = line()
      .context(context)
      .x((i: any) => xScale(xs[i]))
      .y((i: any) => yScale(ys[i]))
      .defined((i: any) => isDefined(xs[i]) && isDefined(ys[i]))
      .curve(CURVES[interpolation] || curveLinear)

    context.beginPath()
    context.strokeStyle = fillScale(groupKey)

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
  const canvas = useRef<HTMLCanvasElement>(null)

  const table = env.getTable(layerIndex)
  const fillScale = env.getScale(layerIndex, 'fill')
  const layer = env.config.layers[layerIndex] as LineLayerConfig
  const {interpolation, x: xColKey, y: yColKey} = layer
  const {xScale, yScale, innerWidth: width, innerHeight: height} = env

  useLayoutEffect(() => {
    drawLines({
      canvas: canvas.current,
      table,
      xColKey,
      yColKey,
      xScale,
      yScale,
      fillScale,
      interpolation,
      width,
      height,
    })
  })

  return <canvas className="minard-layer histogram" ref={canvas} />
}
