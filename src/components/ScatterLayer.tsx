import * as React from 'react'
import {useRef, useLayoutEffect, useMemo, FunctionComponent} from 'react'
import {SymbolType} from '../utils/getSymbolScale'

import {Table, Scale, ScatterLayerConfig, NumericColumnData} from '../types'
import {PlotEnv} from '../utils/PlotEnv'
import {clearCanvas} from '../utils/clearCanvas'
import {FILL, SYMBOL} from '../constants/columnKeys'
import {drawCircle, drawSquare, drawTriangle} from '../utils/drawShapes'

type ScatterData = {
  xs: NumericColumnData
  ys: NumericColumnData
  fill: string[]
  symbol: SymbolType[]
}

const collectScatterData = (
  table: Table,
  xColKey: string,
  yColKey: string,
  fillScale: Scale<string, string>,
  symbolScale: Scale<string, SymbolType>
): ScatterData => ({
  xs: table.getColumn(xColKey, 'number'),
  ys: table.getColumn(yColKey, 'number'),
  fill: table.getColumn(FILL, 'string').map(fillScale),
  symbol: table.getColumn(SYMBOL, 'string').map(symbolScale),
})

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
  scatterData: {xs, ys, fill, symbol},
  width,
  height,
  xScale,
  yScale,
}: DrawPointsOptions): void => {
  clearCanvas(canvas, width, height)

  const context = canvas.getContext('2d')

  for (var i = 0; i < xs.length; i++) {
    const x = xScale(xs[i])
    const y = yScale(ys[i])
    const fillStyle = fill[i]
    const symbolType = symbol[i]

    context.fillStyle = fillStyle
    context.beginPath()
    if (symbolType === SymbolType.Circle) {
      drawCircle(context, x, y)
    } else if (symbolType === SymbolType.Square) {
      drawSquare(context, x, y)
    } else if (symbolType === SymbolType.Triangle) {
      drawTriangle(context, x, y)
    }
    context.fill()
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

  return <canvas className="vis-layer scatter" ref={canvas} />
}
