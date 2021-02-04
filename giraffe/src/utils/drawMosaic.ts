import {color} from 'd3-color'

import {Table, Scale, ColumnType} from '../types'
import {X_MIN, X_MAX, FILL, SERIES} from '../constants/columnKeys'

interface DrawMosaicOptions {
  context: CanvasRenderingContext2D
  table: Table
  xScale: Scale<number, number>
  yScale: Scale<number, number>
  fillScale: Scale<number, string>
  hoveredRowIndices: number[]
  strokeWidth: number
  strokePadding: number
  strokeOpacity: number
  fillOpacity: number
  yColumnType: ColumnType
}

export const drawMosaic = ({
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
}: DrawMosaicOptions): void => {
  const xMinCol = table.getColumn(X_MIN, 'number')
  const xMaxCol = table.getColumn(X_MAX, 'number')
  const valueCol = table.getColumn(FILL, 'string')
  const yCol = table.getColumn(SERIES, 'string')
  context.globalAlpha = fillOpacity

  const yValMap = new Map()
  // if key isn't in map yet, add it & increment number
  let i = 0
  for (const key of yCol) {
    if (!yValMap.has(key)) {
      yValMap.set(key, i)
      i++
    }
  }

  for (let i = 0; i < xMaxCol.length; i++) {
    const x = xScale(xMinCol[i])

    const yVal = yValMap.get(yCol[i])
    const y = yScale(yVal)

    const width = xScale(xMaxCol[i]) - x - strokePadding
    const height = yScale(yValMap.size + 1)
    let fill = fillScale((valueCol[i] as unknown) as number)

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

      context.fillStyle = fill
      context.fill()
      context.strokeStyle = fill
      context.stroke()
      context.restore()
    } else {
      context.fillStyle = fill
      context.beginPath()
      context.rect(x, y, width, height)
      context.fill()
    }
  }
}
