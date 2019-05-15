import * as React from 'react'
import {useRef, useLayoutEffect, FunctionComponent} from 'react'

import {HistogramLayerConfig, HistogramTable, Scale} from '../types'
import {PlotEnv} from '../utils/PlotEnv'
import {clearCanvas} from '../utils/clearCanvas'
import {findHoveredRowIndices, getTooltipData} from '../utils/histogramTooltip'
import {getGroupingColumn} from '../utils/getGroupingColumn'
import {Tooltip} from './Tooltip'
import {FILL_COL_KEY} from '../constants'

const BAR_TRANSPARENCY = 0.5
const BAR_TRANSPARENCY_HOVER = 0.7
const BAR_PADDING = 1.5

interface DrawBarsOptions {
  canvas: HTMLCanvasElement
  table: HistogramTable
  width: number
  height: number
  xScale: Scale<number, number>
  yScale: Scale<number, number>
  fillScale: Scale<string, string>
  hoveredRowIndices: number[] | null
}

const drawBars = ({
  canvas,
  table,
  width,
  height,
  xScale,
  yScale,
  fillScale,
  hoveredRowIndices,
}: DrawBarsOptions): void => {
  clearCanvas(canvas, width, height)

  const xMinCol = table.columns.xMin.data
  const xMaxCol = table.columns.xMax.data
  const yMinCol = table.columns.yMin.data
  const yMaxCol = table.columns.yMax.data
  const {data: groupKeyCol} = getGroupingColumn(table, FILL_COL_KEY)

  const context = canvas.getContext('2d')

  for (let i = 0; i < yMaxCol.length; i++) {
    if (yMinCol[i] === yMaxCol[i]) {
      // Skip 0-height bars
      continue
    }

    const x = xScale(xMinCol[i])
    const y = yScale(yMaxCol[i])
    const width = xScale(xMaxCol[i]) - x - BAR_PADDING
    const height = yScale(yMinCol[i]) - y - BAR_PADDING

    const fill = fillScale(groupKeyCol[i])
    const alpha =
      hoveredRowIndices && hoveredRowIndices.includes(i)
        ? BAR_TRANSPARENCY_HOVER
        : BAR_TRANSPARENCY

    // See https://stackoverflow.com/a/45125187
    context.beginPath()
    context.rect(x, y, width, height)
    context.save()
    context.clip()
    context.lineWidth = 2
    context.globalAlpha = alpha
    context.fillStyle = fill
    context.fill()
    context.globalAlpha = 1
    context.strokeStyle = fill
    context.stroke()
    context.restore()
  }
}

interface Props {
  layerIndex: number
  env: PlotEnv
  hoverX: number | null
  hoverY: number | null
}

export const HistogramLayer: FunctionComponent<Props> = ({
  layerIndex,
  env,
  hoverX,
  hoverY,
}) => {
  const canvas = useRef<HTMLCanvasElement>(null)
  const table = env.getTable(layerIndex) as HistogramTable
  const fillScale = env.getScale(layerIndex, 'fill')

  const {x: xColKey, fill: fillColKeys} = env.config.layers[
    layerIndex
  ] as HistogramLayerConfig

  const {xScale, yScale, innerWidth, innerHeight} = env

  useLayoutEffect(() => {
    drawBars({
      table,
      fillScale,
      canvas: canvas.current,
      width: innerWidth,
      height: innerHeight,
      xScale,
      yScale,
      hoveredRowIndices,
    })
  })

  const hoveredRowIndices = findHoveredRowIndices(
    table,
    hoverX,
    hoverY,
    xScale,
    yScale
  )

  const tooltipData = getTooltipData(
    hoveredRowIndices,
    table,
    xColKey,
    fillColKeys,
    env.getFormatterForColumn,
    fillScale
  )

  return (
    <>
      <canvas className="vis-layer histogram" ref={canvas} />
      {tooltipData && <Tooltip data={tooltipData} env={env} />}
    </>
  )
}
