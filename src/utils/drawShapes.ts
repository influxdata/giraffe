export const drawCircle = (
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  r?: number
) => {
  const radius = r ? r : 2
  const x = centerX - radius / 2
  const y = centerY - radius / 2

  const Zero = 0
  const TwoPi = Math.PI * 2

  ctx.arc(x, y, radius, Zero, TwoPi, true)
}

export const drawSquare = (
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  s?: number
) => {
  const size = s ? s : 6
  const x = centerX - size / 2
  const y = centerY - size / 2

  ctx.fillRect(x, y, size, size)
}

export const drawTriangle = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  s?: number
) => {
  const size = s ? s : 4

  ctx.moveTo(x - size, y + size)
  ctx.lineTo(x + size, y + size)
  ctx.lineTo(x, y - size)
}
