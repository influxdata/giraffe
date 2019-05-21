import * as React from 'react'
import {useRef, useLayoutEffect, useMemo, FunctionComponent} from 'react'

import {CandlestickLayerConfig} from '../types'
import {PlotEnv} from '../utils/PlotEnv'
import {drawCandlesticks} from '../utils/drawCandlesticks'
import {
  collectCandlestickData,
  simplifyCandlestickData,
} from '../utils/candlestickData'
import {clearCanvas} from '../utils/clearCanvas'
import {FILL} from '../constants/columnKeys'
import {useHoverLineIndices} from '../utils/useHoverLineIndices'

interface Props {
  env: PlotEnv
  layerIndex: number
  hoverX: number
  hoverY: number
}

export const CandlestickLayer: FunctionComponent<Props> = ({
  env,
  layerIndex,
  hoverX,
  hoverY,
}) => {
  const table = env.getTable(layerIndex)
  const {xScale, yScale, innerWidth: width, innerHeight: height} = env
  const layer = env.config.layers[layerIndex] as CandlestickLayerConfig
  const colors = layer.colors

  const {
    x: xColKey,
    y: yColKey,
    lineWidth,
    hoverDimension,
    maxTooltipRows,
  } = layer

  const xColData = table.getColumn(xColKey, 'number') as number[]
  const yColData = table.getColumn(yColKey, 'number') as number[]
  const groupColData = table.getColumn(FILL, 'string')

  const candlestickData = useMemo(
    () => collectCandlestickData(table, xColKey, yColKey, colors),
    [table, xColKey, yColKey, colors]
  )

  // TODO: Simplify in data domain, resimplify when dimensions change on a
  // debounced timer (for fast resizes)
  const simplifiedCandlestickDataItem = useMemo(
    () =>
      simplifyCandlestickData(candlestickData[layer.sample], xScale, yScale),
    [candlestickData[layer.sample], xScale, yScale]
  )

  const resolvedHoverDimension =
    hoverDimension === 'auto'
      ? Object.keys(candlestickData[layer.sample]).length > maxTooltipRows
        ? 'xy'
        : 'x'
      : hoverDimension

  const canvasRef = useRef<HTMLCanvasElement>(null)

  useLayoutEffect(() => {
    clearCanvas(canvasRef.current, width, height)
    drawCandlesticks({
      canvas: canvasRef.current,
      CandlestickDataItem: simplifiedCandlestickDataItem,
      lineWidth,
    })
  }, [simplifiedCandlestickDataItem, canvasRef.current, width, height])

  const hoverRowIndices = useHoverLineIndices(
    resolvedHoverDimension,
    hoverX,
    hoverY,
    xColData,
    yColData,
    groupColData,
    xScale,
    yScale,
    width,
    height
  )

  const hasHoverData = hoverRowIndices && hoverRowIndices.length > 0

  return (
    <>
      <canvas
        className="vis-layer line"
        ref={canvasRef}
        style={{
          position: 'absolute',
          opacity: resolvedHoverDimension === 'xy' && hasHoverData ? 0.4 : 1,
        }}
      />
    </>
  )
}
