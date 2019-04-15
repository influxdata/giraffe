import * as React from 'react'
import {useRef, useLayoutEffect, useMemo, FunctionComponent} from 'react'
import {symbol as d3Symbol, SymbolType} from 'd3-shape'

import {Table, Scale, ScatterLayerConfig} from '../types'
import {PlotEnv} from '../utils/PlotEnv'
import {clearCanvas} from '../utils/clearCanvas'
import {GROUP_COL_KEY} from '../constants'

type ScatterData = Array<{
  xs: number[] | Float64Array
  ys: number[] | Float64Array
  fill: string
  symbol: SymbolType
}>

const collectScatterData = (
  table: Table,
  xColKey: string,
  yColKey: string,
  fillScale: Scale<string, string>,
  symbolScale: Scale<string, SymbolType>
): ScatterData => {
  const xCol = table.columns[xColKey].data
  const yCol = table.columns[yColKey].data
  const groupCol = table.columns[GROUP_COL_KEY].data as string[]

  const resultByGroupKey = {}

  for (let i = 0; i < table.length; i++) {
    const groupKey = groupCol[i]
    if (!resultByGroupKey[groupKey]) {
      resultByGroupKey[groupKey] = {
        xs: [],
        ys: [],
        fill: fillScale(groupKey),
        symbol: symbolScale(groupKey),
      }
    }

    resultByGroupKey[groupKey].xs.push(xCol[i])
    resultByGroupKey[groupKey].ys.push(yCol[i])
  }

  return Object.values(resultByGroupKey)
}

interface DrawPointsOptions {
  canvas: HTMLCanvasElement
  scatterData: ScatterData
  width: number
  height: number
  xScale: Scale<number, number>
  yScale: Scale<number, number>
}

const drawPoints = ({
  canvas,
  scatterData,
  width,
  height,
  xScale,
  yScale,
}: DrawPointsOptions): void => {
  clearCanvas(canvas, width, height)

  const context = canvas.getContext('2d')

  for (const {xs, ys, fill, symbol} of scatterData) {
    for (var i = 0; i < xs.length; i++) {
      const symbolGenerator = d3Symbol()
        .type(symbol)
        .size(64)
        .context(context)

      context.fillStyle = fill
      context.translate(xScale(xs[i]), yScale(ys[i]))
      context.beginPath()
      symbolGenerator()
      context.closePath()
      context.fill()
      context.stroke()
      context.translate(-xScale(xs[i]), -yScale(ys[i]))
    }
  }
}

interface Props {
  env: PlotEnv
  layerIndex: number
}

export const ScatterLayer: FunctionComponent<Props> = ({env, layerIndex}) => {
  const canvas = useRef<HTMLCanvasElement>(null)

  const table = env.getTable(layerIndex)

  const fillScale = env.getScale(layerIndex, 'fill')
  const symbolScale = env.getScale(layerIndex, 'symbol')

  const layerConfig = env.config.layers[layerIndex] as ScatterLayerConfig

  const {x: xColKey, y: yColKey} = layerConfig
  const {xScale, yScale, innerWidth: width, innerHeight: height} = env

  const scatterData = useMemo(
    () => collectScatterData(table, xColKey, yColKey, fillScale, symbolScale),
    [table, xColKey, yColKey, fillScale, symbolScale]
  )

  useLayoutEffect(() => {
    drawPoints({
      canvas: canvas.current,
      scatterData,
      width,
      height,
      xScale,
      yScale,
    })
  }, [canvas.current, scatterData, width, height, xScale, yScale])

  return <canvas className="minard-layer scatter" ref={canvas} />
}
