export const drawCircle = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  diameter: number = 5
) => {
  // Draw a real arc rather than a zero-length line with round caps. Chromium
  // 153+ prunes zero-length segments (per the canvas spec), so the old
  // approach rendered nothing there.
  ctx.beginPath()
  ctx.arc(x, y, diameter / 2, 0, 2 * Math.PI)
  ctx.fill()
}

export const drawSquare = (
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  size: number = 4
) => {
  const x = centerX - size / 2
  const y = centerY - size / 2
  ctx.beginPath()
  ctx.rect(x, y, size, size)
  ctx.fill()
}

export const drawTriangle = (
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  sideLength: number = 3
) => {
  // Stroking and filling an area will result in a shape whose sides extend a
  // little bit further than the same shape that is only filled
  const STROKE_DELTA = 0.5
  const halfSideLength = sideLength / 2 + STROKE_DELTA

  ctx.beginPath()
  ctx.moveTo(centerX - halfSideLength, centerY + halfSideLength)
  ctx.lineTo(centerX + halfSideLength, centerY + halfSideLength)
  ctx.lineTo(centerX, centerY - halfSideLength)
  ctx.fill()
}

export const drawPlus = (
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  size: number = 6
) => {
  const mid = size / 2

  ctx.lineWidth = 2

  ctx.beginPath()
  ctx.moveTo(centerX - mid, centerY)
  ctx.lineTo(centerX + mid, centerY)
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(centerX, centerY - mid)
  ctx.lineTo(centerX, centerY + mid)
  ctx.stroke()
}

export const drawEx = (
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  size: number = 6
) => {
  const mid = size / 2

  ctx.lineWidth = 2

  ctx.beginPath()
  ctx.moveTo(centerX - mid, centerY - mid)
  ctx.lineTo(centerX + mid, centerY + mid)
  ctx.closePath()
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(centerX - mid, centerY + mid)
  ctx.lineTo(centerX + mid, centerY - mid)
  ctx.closePath()
  ctx.stroke()
}

export const drawTritip = (
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  size: number = 3
) => {
  const cos30 = 0.86602540378
  const sin30 = 0.5

  ctx.lineWidth = 1

  ctx.beginPath()
  ctx.moveTo(centerX, centerY)
  ctx.lineTo(centerX + cos30 * size, centerY + sin30 * size)
  ctx.closePath()
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(centerX, centerY)
  ctx.lineTo(centerX - cos30 * size, centerY + sin30 * size)
  ctx.closePath()
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(centerX, centerY)
  ctx.lineTo(centerX, centerY - size)
  ctx.closePath()
  ctx.stroke()
}
