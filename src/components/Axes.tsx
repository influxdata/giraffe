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
    xScale,
    yScale,
    config: {
      width,
      height,
      axesStroke,
      tickFont,
      tickFill,
      xAxisLabel,
      yAxisLabel,
    },
  } = env

  clearCanvas(canvas, width, height)

  const context = canvas.getContext('2d')
  const xAxisY = height - margins.bottom

  // Draw x axis line
  context.strokeStyle = axesStroke
  context.beginPath()
  context.moveTo(margins.left, xAxisY)
  context.lineTo(width - margins.right, xAxisY)
  context.stroke()

  // Draw y axis line
  context.beginPath()
  context.moveTo(margins.left, xAxisY)
  context.lineTo(margins.left, margins.top)
  context.stroke()

  context.font = tickFont
  context.fillStyle = tickFill
  context.textAlign = 'center'
  context.textBaseline = 'top'

  // Draw and label each tick on the x axis
  for (const xTick of xTicks) {
    const x = xScale(xTick) + margins.left

    context.beginPath()
    context.moveTo(x, xAxisY)
    context.lineTo(x, margins.top)
    context.stroke()

    context.fillText(String(xTick), x, xAxisY + TICK_PADDING_TOP)
  }

  context.textAlign = 'end'
  context.textBaseline = 'middle'

  // Draw and label each tick on the y axis
  for (const yTick of yTicks) {
    const y = yScale(yTick) + margins.top

    context.beginPath()
    context.moveTo(margins.left, y)
    context.lineTo(width - margins.right, y)
    context.stroke()

    context.fillText(String(yTick), margins.left - TICK_PADDING_RIGHT, y)
  }

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
