import * as React from 'react'
import {useRef, useLayoutEffect, FunctionComponent} from 'react'

import {ScatterLayerConfig} from '../types'
import {PlotEnv} from '../utils/PlotEnv'
import {drawPoints} from '../utils/drawPoints'
import {ScatterHoverLayer} from './ScatterHoverLayer'
import {SCATTER_POINT_SIZE} from '../constants'
import {FILL, SYMBOL} from '../constants/columnKeys'

interface Props {
  env: PlotEnv
  layerIndex: number
  hoverX: number
  hoverY: number
}

export const ScatterLayer: FunctionComponent<Props> = ({
  env,
  layerIndex,
  hoverX,
  hoverY,
}) => {
  const layerConfig = env.config.layers[layerIndex] as ScatterLayerConfig
  const {x: xColKey, y: yColKey} = layerConfig

  const {xScale, yScale, innerWidth: width, innerHeight: height} = env
  const fillScale = env.getScale(layerIndex, 'fill')
  const symbolScale = env.getScale(layerIndex, 'symbol')

  const table = env.getTable(layerIndex)
  const xColData = table.getColumn(xColKey, 'number')
  const yColData = table.getColumn(yColKey, 'number')
  const fillColData = table.getColumn(FILL, 'string')
  const symbolColData = table.getColumn(SYMBOL, 'string')

  const canvas = useRef<HTMLCanvasElement>(null)

  useLayoutEffect(() => {
    drawPoints({
      canvas: canvas.current,
      width,
      height,
      xColData,
      yColData,
      fillColData,
      symbolColData,
      xScale,
      yScale,
      fillScale,
      symbolScale,
      pointSize: SCATTER_POINT_SIZE,
    })
  }, [
    canvas.current,
    width,
    height,
    xColData,
    yColData,
    fillColData,
    symbolColData,
    xScale,
    yScale,
    fillScale,
    symbolScale,
  ])

  return (
    <>
      <canvas
        className="giraffe-layer scatter"
        ref={canvas}
        style={{position: 'absolute'}}
        data-testid="giraffe-layer--scatter"
      />
      <ScatterHoverLayer
        env={env}
        layerIndex={layerIndex}
        hoverX={hoverX}
        hoverY={hoverY}
      />
    </>
  )
}
