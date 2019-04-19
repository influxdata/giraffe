interface DrawLinePointOptions {
  canvas: HTMLCanvasElement
  width: number
  height: number
  crosshairX: number | null
  crosshairY: number | null
  crosshairColor: string
  points: Array<{x: number; y: number; fill: string}> | null
}

export const drawLineHoverData = ({
  canvas,
  width,
  height,
  crosshairX,
  crosshairY,
  crosshairColor,
  points,
}: DrawLinePointOptions): void => {
  const context = canvas.getContext('2d')

  context.strokeStyle = crosshairColor

  if (crosshairX !== null) {
    context.lineWidth = 1
    context.beginPath()
    context.moveTo(crosshairX, 0)
    context.lineTo(crosshairX, height)
    context.stroke()
  }

  if (crosshairY !== null) {
    context.lineWidth = 1
    context.beginPath()
    context.moveTo(0, crosshairY)
    context.lineTo(width, crosshairY)
    context.stroke()
  }

  if (points !== null) {
    for (const {x, y, fill} of points) {
      context.beginPath()
      context.arc(x, y, 3, 0, 2 * Math.PI)
      context.fillStyle = fill
      context.fill()
    }
  }
}
