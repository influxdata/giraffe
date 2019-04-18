import {clearCanvas} from '../utils/clearCanvas'

interface DrawLinePointOptions {
  canvas: HTMLCanvasElement
  width: number
  height: number
  hoverLinePosition: number | null
  hoverLineColor: string
  hoverPoints: Array<{x: number; y: number; fill: string}> | null
}

export const drawLinePoints = ({
  canvas,
  width,
  height,
  hoverPoints,
  hoverLineColor,
  hoverLinePosition,
}: DrawLinePointOptions): void => {
  clearCanvas(canvas, width, height)

  const context = canvas.getContext('2d')

  if (hoverLinePosition !== null) {
    context.strokeStyle = hoverLineColor
    context.beginPath()
    context.moveTo(hoverLinePosition, 0)
    context.lineTo(hoverLinePosition, height)
    context.stroke()
  }

  if (hoverPoints !== null) {
    for (const {x, y, fill} of hoverPoints) {
      context.beginPath()
      context.arc(x, y, 3, 0, 2 * Math.PI)
      context.fillStyle = fill
      context.fill()
    }
  }
}
