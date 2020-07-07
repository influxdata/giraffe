import {Table, Scale, ColumnType} from '../types'
import {X_MIN, X_MAX, FILL, SERIES} from '../constants/columnKeys'

interface DrawMosaicOptions {
  context: CanvasRenderingContext2D
  table: Table
  xScale: Scale<number, number>
  yScale: Scale<number, number>
  fillScale: Scale<number, string>
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
  strokeWidth,
  strokePadding,
  strokeOpacity,
  fillOpacity,
}: DrawMosaicOptions): void => {
  const xMinCol = table.getColumn(X_MIN, 'number')
  const xMaxCol = table.getColumn(X_MAX, 'number')
  const valueCol = table.getColumn(FILL, 'string')
  const cpuCol = table.getColumn(SERIES, 'string')
  context.globalAlpha = fillOpacity

  const colorMap = new Map()
  //if value isn't in map yet, add it & increment number
  let i = 0
  for (const val of valueCol) {
    if (!colorMap.has(val)) {
      colorMap.set(val, i)
      i++
    }
  }

  const yValMap = new Map()
  //if cpu isn't in map yet, add it & increment number
  i = 0
  for (const cpu of cpuCol) {
    if (!yValMap.has(cpu)) {
      yValMap.set(cpu, i)
      i++
    }
  }

  for (let i = 0; i < xMaxCol.length; i++) {
    const x = xScale(xMinCol[i])

    const yVal = yValMap.get(cpuCol[i])
    const y = yScale(yVal)

    const width = xScale(xMaxCol[i]) - x - strokePadding
    const height = yScale(yValMap.size + 1)

    const colorVal = colorMap.get(valueCol[i])

    const fill = fillScale(colorVal)

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
