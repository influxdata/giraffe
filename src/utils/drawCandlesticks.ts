import {CandlestickDataItem} from './candlestickData'

interface DrawCandlestickOptions {
  canvas: HTMLCanvasElement
  CandlestickDataItem: CandlestickDataItem
  lineWidth?: number
  barWidth?: number
}

export const drawCandlesticks = ({
  canvas,
  CandlestickDataItem,
  lineWidth = 1,
  barWidth = 10,
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
      barWidth
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
  barWidth
) => {
  ctx.beginPath()
  ctx.moveTo(x, min)
  ctx.lineTo(x, max)
  ctx.strokeStyle = up ? colors[0] : colors[2]
  ctx.stroke()

  ctx.rect(x - barWidth / 2, start, barWidth, end - start)
  ctx.fillStyle = up ? colors[0] : colors[2]
  ctx.fill()
}
