import {range} from 'd3-array'
import {color} from 'd3-color'

import {Scale, HeatmapTable} from '../types'
import {clearCanvas} from '../utils/clearCanvas'

interface DrawHeatmapOptions {
  canvas: HTMLCanvasElement
  width: number
  height: number
  table: HeatmapTable
  xScale: Scale<number, number>
  yScale: Scale<number, number>
  fillScale: Scale<number, string>
  rows?: number[]
  brighten?: number
}

export const drawHeatmap = ({
  canvas,
  width,
  height,
  table,
  xScale,
  yScale,
  fillScale,
  rows,
  brighten,
}: DrawHeatmapOptions) => {
  clearCanvas(canvas, width, height)

  const context = canvas.getContext('2d')
  const indices = rows ? rows : range(table.length)

  for (const i of indices) {
    const xMin = table.columns.xMin.data[i]
    const xMax = table.columns.xMax.data[i]
    const yMin = table.columns.yMin.data[i]
    const yMax = table.columns.yMax.data[i]
    const count = table.columns.count.data[i]

    const squareX = xScale(xMin)
    const squareY = yScale(yMax)
    const squareWidth = xScale(xMax) - squareX
    const squareHeight = yScale(yMin) - squareY

    let fill = fillScale(count)

    if (brighten) {
      fill = color(fill)
        .brighter(3)
        .hex()
    }

    context.beginPath()
    context.rect(squareX, squareY, squareWidth, squareHeight)
    context.fillStyle = fill
    context.fill()
  }
}
