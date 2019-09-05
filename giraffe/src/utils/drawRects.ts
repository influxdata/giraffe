import {color} from 'd3-color'

import {Table, Scale} from '../types'
import {FILL, X_MIN, X_MAX, Y_MIN, Y_MAX, COUNT} from '../constants/columnKeys'

interface DrawRectsOptions {
  context: CanvasRenderingContext2D
  table: Table
  xScale: Scale<number, number>
  yScale: Scale<number, number>
  fillScale: Scale<number, string>
  hoveredRowIndices: number[] | null
  strokeWidth: number
  strokePadding: number
  strokeOpacity: number
  fillOpacity: number
}

export const drawRects = ({
  context,
  table,
  xScale,
  yScale,
  fillScale,
  hoveredRowIndices,
  strokeWidth,
  strokePadding,
  strokeOpacity,
  fillOpacity,
}: DrawRectsOptions): void => {
  const xMinCol = table.getColumn(X_MIN, 'number')
  const xMaxCol = table.getColumn(X_MAX, 'number')
  const yMinCol = table.getColumn(Y_MIN, 'number')
  const yMaxCol = table.getColumn(Y_MAX, 'number')
  const fillCol =
    table.getColumn(FILL, 'number') || table.getColumn(COUNT, 'number')

  for (let i = 0; i < yMaxCol.length; i++) {
    if (yMinCol[i] === yMaxCol[i] || xMinCol[i] === xMaxCol[i]) {
      // Skip 0-length rects
      continue
    }

    const x = xScale(xMinCol[i]) + strokePadding
    const y = yScale(yMaxCol[i]) + strokePadding
    const width = xScale(xMaxCol[i]) - x - strokePadding
    const height = yScale(yMinCol[i]) - y - strokePadding

    let fill = fillScale(fillCol[i])

    if (hoveredRowIndices && hoveredRowIndices.includes(i)) {
      fill = color(fill)
        .brighter(1)
        .hex()
    }

    if (strokeWidth || strokeOpacity) {
      // See https://stackoverflow.com/a/45125187
      context.beginPath()
      context.rect(x, y, width, height)
      context.save()
      context.clip()
      context.lineWidth = strokeWidth * 2
      context.globalAlpha = fillOpacity
      context.fillStyle = fill
      context.fill()
      context.globalAlpha = strokeOpacity
      context.strokeStyle = fill
      context.stroke()
      context.restore()
    } else {
      context.globalAlpha = fillOpacity
      context.fillStyle = fill
      context.beginPath()
      context.rect(x, y, width, height)
      context.fill()
    }
  }
}
