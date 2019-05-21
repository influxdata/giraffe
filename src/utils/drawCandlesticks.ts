import {CandlestickDataItem} from './candlestickData'

interface DrawCandlestickOptions {
  canvas: HTMLCanvasElement
  CandlestickDataItem: CandlestickDataItem
  lineWidth?: number
  boxWidth?: number
}

export const drawCandlesticks = ({
  canvas,
  CandlestickDataItem,
  lineWidth = 1,
  boxWidth = 10,
}: DrawCandlestickOptions): void => {
  const context = canvas.getContext('2d')

  context.lineWidth = lineWidth

  const {xs, starts, ends, maxs, mins, ups, colors} = CandlestickDataItem

  xs.forEach((xVal, i) => {
    drawCandlestickBox(
      context,
      colors,
      xVal,
      starts[i],
      ends[i],
      maxs[i],
      mins[i],
      ups[i],
      boxWidth
    )
  })
}

const drawCandlestickBox = (
  ctx,
  colors,
  x,
  start,
  end,
  max,
  min,
  up,
  boxWidth
) => {
  ctx.beginPath()
  ctx.moveTo(x, min)
  ctx.lineTo(x, max)
  ctx.strokeStyle = up ? colors[0] : colors[2]
  ctx.stroke()

  ctx.rect(x - boxWidth / 2, start, boxWidth, end - start)
  ctx.fillStyle = up ? colors[0] : colors[2]
  ctx.fill()
}
