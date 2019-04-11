import * as React from 'react'
import {useRef, useLayoutEffect, SFC} from 'react'

import {TICK_PADDING_RIGHT, TICK_PADDING_TOP, PLOT_PADDING} from '../constants'
import {clearCanvas} from '../utils/clearCanvas'

import {PlotEnv} from '../utils/PlotEnv'

interface Props {
  env: PlotEnv
}

export const drawAxes = (canvas: HTMLCanvasElement, env: PlotEnv) => {
  const {
    innerWidth,
    innerHeight,
    margins,
    xTicks,
    yTicks,
    xTickFormatter,
    yTickFormatter,
    xScale,
    yScale,
    config: {
      width,
      height,
      axisColor,
      axisOpacity,
      gridColor,
      gridOpacity,
      tickFont,
      tickFontColor,
      xAxisLabel,
      yAxisLabel,
    },
  } = env

  clearCanvas(canvas, width, height)

  const context = canvas.getContext('2d')
  const xAxisY = height - margins.bottom

  // Draw and label each tick on the x axis

  context.font = tickFont
  context.textAlign = 'center'
  context.textBaseline = 'top'

  for (const xTick of xTicks) {
    const x = xScale(xTick) + margins.left

    context.strokeStyle = gridColor
    context.globalAlpha = gridOpacity
    context.beginPath()
    context.moveTo(x, xAxisY)
    context.lineTo(x, margins.top)
    context.stroke()

    context.globalAlpha = 1
    context.fillStyle = tickFontColor
    context.fillText(xTickFormatter(xTick), x, xAxisY + TICK_PADDING_TOP)
  }

  // Draw and label each tick on the y axis

  context.textAlign = 'end'
  context.textBaseline = 'middle'

  for (const yTick of yTicks) {
    const y = yScale(yTick) + margins.top

    context.strokeStyle = gridColor
    context.globalAlpha = gridOpacity
    context.beginPath()
    context.moveTo(margins.left, y)
    context.lineTo(width - margins.right, y)
    context.stroke()

    context.globalAlpha = 1
    context.fillStyle = tickFontColor
    context.fillText(
      yTickFormatter(yTick),
      margins.left - TICK_PADDING_RIGHT,
      y
    )
  }

  // Draw x and y axis lines

  context.globalAlpha = axisOpacity
  context.strokeStyle = axisColor

  context.beginPath()
  context.moveTo(margins.left, xAxisY)
  context.lineTo(width - margins.right, xAxisY)
  context.stroke()

  context.beginPath()
  context.moveTo(margins.left, margins.top)
  context.lineTo(width - margins.right, margins.top)
  context.stroke()

  context.beginPath()
  context.moveTo(margins.left, xAxisY)
  context.lineTo(margins.left, margins.top)
  context.stroke()

  context.beginPath()
  context.moveTo(width - margins.right, xAxisY)
  context.lineTo(width - margins.right, margins.top)
  context.stroke()

  context.globalAlpha = 1

  // Draw the x axis label
  if (xAxisLabel) {
    context.textAlign = 'center'
    context.textBaseline = 'bottom'
    context.fillText(
      xAxisLabel,
      margins.left + innerWidth / 2,
      height - PLOT_PADDING
    )
  }

  // Draw the y axis label
  if (yAxisLabel) {
    const x = PLOT_PADDING
    const y = margins.top + innerHeight / 2

    context.save()
    context.translate(x, y)
    context.rotate(-Math.PI / 2)
    context.textAlign = 'center'
    context.textBaseline = 'top'
    context.fillText(yAxisLabel, 0, 0)
    context.restore()
  }
}

export const Axes: SFC<Props> = props => {
  const {children, env} = props
  const canvas = useRef<HTMLCanvasElement>(null)

  useLayoutEffect(() => {
    drawAxes(canvas.current, env)
  }, [canvas.current, env.config])

  return (
    <>
      {children}
      <canvas className="minard-axes" ref={canvas} />
    </>
  )
}
