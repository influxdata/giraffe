import React, {useRef, useLayoutEffect, FunctionComponent} from 'react'

import {Scale, HeatmapTable} from '../types'
import {clearCanvas} from '../utils/clearCanvas'
import {PlotEnv} from '../utils/PlotEnv'

interface DrawSquaresOptions {
  canvas: HTMLCanvasElement
  width: number
  height: number
  table: HeatmapTable
  xScale: Scale<number, number>
  yScale: Scale<number, number>
  fillScale: Scale<number, string>
}

const drawSquares = ({
  canvas,
  width,
  height,
  table,
  xScale,
  yScale,
  fillScale,
}: DrawSquaresOptions) => {
  clearCanvas(canvas, width, height)

  const context = canvas.getContext('2d')

  for (let i = 0; i < table.length; i++) {
    const xMin = table.columns.xMin.data[i]
    const xMax = table.columns.xMax.data[i]
    const yMin = table.columns.yMin.data[i]
    const yMax = table.columns.yMax.data[i]
    const count = table.columns.count.data[i]

    const squareX = xScale(xMin)
    const squareY = yScale(yMax)
    const squareWidth = xScale(xMax) - squareX
    const squareHeight = yScale(yMin) - squareY

    context.beginPath()
    context.rect(squareX, squareY, squareWidth, squareHeight)
    context.globalAlpha = count === 0 ? 0 : 1
    context.fillStyle = fillScale(count)
    context.fill()
  }
}

interface Props {
  layerIndex: number
  env: PlotEnv
}

export const HeatmapLayer: FunctionComponent<Props> = ({layerIndex, env}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const {innerWidth: width, innerHeight: height, xScale, yScale} = env
  const fillScale = env.getScale(layerIndex, 'fill')
  const table = env.getTable(layerIndex) as HeatmapTable

  useLayoutEffect(() => {
    return drawSquares({
      canvas: canvasRef.current,
      width,
      height,
      table,
      xScale,
      yScale,
      fillScale,
    })
  }, [canvasRef.current, width, height, table, xScale, yScale, fillScale])

  return <canvas className="minard-layer heatmap" ref={canvasRef} />
}
