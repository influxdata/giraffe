import {Table, Scale, ColumnType} from '../types'
import {X_MIN, X_MAX, VALUE, FILL} from '../constants/columnKeys'

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
  const valueCol = table.getColumn(VALUE, 'string')
  const cpuCol = table.getColumn(FILL, 'string')
  context.globalAlpha = fillOpacity

  for (let i = 0; i < xMaxCol.length; i++) {
    const x = xScale(xMinCol[i])

    let yVal = 0
    if (cpuCol[i] === 'cpu0') {
      yVal = 1
    } else if (cpuCol[i] === 'cpu1') {
      yVal = 2
    } else if (cpuCol[i] === 'cpu2') {
      yVal = 3
    } else if (cpuCol[i] === 'cpu3') {
      yVal = 4
    }
    const y = yScale(yVal)

    const width = xScale(xMaxCol[i]) - x - strokePadding
    const height = yScale(3)

    let colorVal = 0
    if (valueCol[i] === 'eenie') {
      colorVal = 0
    } else if (valueCol[i] === 'meenie') {
      colorVal = 1
    } else if (valueCol[i] === 'miney') {
      colorVal = 2
    } else if (valueCol[i] === 'mo') {
      colorVal = 3
    }

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
