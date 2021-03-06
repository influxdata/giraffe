import React, {
  CSSProperties,
  FunctionComponent,
  RefObject,
  useLayoutEffect,
} from 'react'

import {TICK_PADDING_RIGHT, TICK_PADDING_TOP} from '../constants'
import {clearCanvas} from '../utils/clearCanvas'
import {Margins, Scale, SizedConfig, Formatter, ColumnType} from '../types'

import {PlotEnv} from '../utils/PlotEnv'

interface Props {
  canvasRef: RefObject<HTMLCanvasElement>
  env: PlotEnv
  style: CSSProperties
}

// A grid line must be at least this many pixels away from both parallel axes
// in order to be drawn
const GRID_LINE_MIN_DIST = 5

interface DrawAxesOptions {
  canvas: HTMLCanvasElement
  innerWidth: number
  innerHeight: number
  margins: Margins
  xDomain: number[]
  yDomain: number[]
  xTicks: number[]
  yTicks: Array<number | string>
  xTickFormatter: Formatter
  yTickFormatter: Formatter
  xScale: Scale<number, number>
  yScale: Scale<number, number>
  config: SizedConfig
  yColumnType?: ColumnType
}

export const drawAxes = ({
  canvas,
  innerWidth,
  innerHeight,
  margins,
  xDomain,
  yDomain,
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
}: DrawAxesOptions) => {
  clearCanvas(canvas, width, height)

  const context = canvas.getContext('2d')
  const xAxisY = height - margins.bottom
  const xDomainWidth = Math.abs(xDomain[1] - xDomain[0])

  // Draw and label each tick on the x axis

  context.font = tickFont
  context.textAlign = 'center'
  context.textBaseline = 'top'

  for (const xTick of xTicks) {
    const x = xScale(xTick) + margins.left

    if (
      Math.abs(x - margins.left) > GRID_LINE_MIN_DIST &&
      Math.abs(x - (width - margins.right)) > GRID_LINE_MIN_DIST
    ) {
      context.strokeStyle = gridColor
      context.globalAlpha = gridOpacity
      context.beginPath()
      context.moveTo(x, xAxisY)
      context.lineTo(x, margins.top)
      context.stroke()
    }

    context.globalAlpha = 1
    context.fillStyle = tickFontColor
    context.fillText(
      xTickFormatter(xTick, {domainWidth: xDomainWidth}),
      x,
      xAxisY + TICK_PADDING_TOP
    )
  }

  // Draw and label each tick on the y axis
  context.textAlign = 'end'
  context.textBaseline = 'middle'
  const yDomainWidth = yDomain[1] - yDomain[0]
  let count = 0
  for (const yTick of yTicks) {
    let y
    if (typeof yTick === 'string') {
      y = yScale(count) + margins.top - height / (yTicks.length * 2)
      context.globalAlpha = 1
      context.fillStyle = tickFontColor

      context.fillText(
        yTickFormatter(yTick, {domainWidth: yDomainWidth}),
        margins.left - TICK_PADDING_RIGHT,
        y
      )
      count += 1
    } else {
      y = yScale(yTick) + margins.top
      if (
        Math.abs(y - margins.top) > GRID_LINE_MIN_DIST &&
        Math.abs(y - (height - margins.bottom)) > GRID_LINE_MIN_DIST
      ) {
        context.strokeStyle = gridColor
        context.globalAlpha = gridOpacity
        context.beginPath()
        context.moveTo(margins.left, y)
        context.lineTo(width - margins.right, y)
        context.stroke()
      }

      context.globalAlpha = 1
      context.fillStyle = tickFontColor
      context.fillText(
        yTickFormatter(yTick, {domainWidth: yDomainWidth}),
        margins.left - TICK_PADDING_RIGHT,
        y
      )
    }
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
    context.fillText(xAxisLabel, margins.left + innerWidth / 2, height)
  }

  // Draw the y axis label
  if (yAxisLabel) {
    const x = 0
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

export const Axes: FunctionComponent<Props> = ({canvasRef, env, style}) => {
  const {
    innerWidth,
    innerHeight,
    margins,
    xDomain,
    yDomain,
    xTicks,
    yTicks,
    xTickFormatter,
    yTickFormatter,
    xScale,
    yScale,
    config,
    yColumnType,
  } = env

  useLayoutEffect(() => {
    drawAxes({
      canvas: canvasRef.current,
      innerWidth,
      innerHeight,
      margins,
      xDomain,
      yDomain,
      xTicks,
      yTicks,
      xTickFormatter,
      yTickFormatter,
      xScale,
      yScale,
      config,
      yColumnType,
    })
  }, [
    canvasRef.current,
    innerWidth,
    innerHeight,
    margins,
    xDomain,
    yDomain,
    xTicks,
    yTicks,
    xTickFormatter,
    yTickFormatter,
    xScale,
    yScale,
    config,
    yColumnType,
  ])
  return (
    <canvas
      className="giraffe-axes"
      ref={canvasRef}
      style={style}
      data-testid="giraffe-axes"
    />
  )
}

Axes.displayName = 'Axes'
