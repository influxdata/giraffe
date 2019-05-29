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

interface Props {
  env: PlotEnv
  layerIndex: number
}

export const CandlestickLayer: FunctionComponent<Props> = ({
  env,
  layerIndex,
}) => {
  const table = env.getTable(layerIndex)
  const {xScale, yScale, innerWidth: width, innerHeight: height} = env
  const layer = env.config.layers[layerIndex] as CandlestickLayerConfig
  const colors = layer.colors

  const {x: xColKey, y: yColKey, lineWidth, barWidth, binSize} = layer

  const candlestickData = useMemo(
    () => collectCandlestickData(table, xColKey, yColKey, colors, binSize),
    [table, xColKey, yColKey, colors, binSize]
  )

  // TODO: Simplify in data domain, resimplify when dimensions change on a
  // debounced timer (for fast resizes)
  const simplifiedCandlestickDataItem = useMemo(
    () =>
      simplifyCandlestickData(candlestickData[layer.sample], xScale, yScale),
    [candlestickData[layer.sample], xScale, yScale]
  )

  const canvasRef = useRef<HTMLCanvasElement>(null)

  useLayoutEffect(() => {
    clearCanvas(canvasRef.current, width, height)
    drawCandlesticks({
      canvas: canvasRef.current,
      CandlestickDataItem: simplifiedCandlestickDataItem,
      lineWidth,
      barWidth,
    })
  }, [
    simplifiedCandlestickDataItem,
    canvasRef.current,
    width,
    height,
    lineWidth,
    barWidth,
  ])

  return (
    <>
      <canvas
        className="vis-layer candlestick"
        ref={canvasRef}
        style={{
          position: 'absolute',
        }}
      />
    </>
  )
}
