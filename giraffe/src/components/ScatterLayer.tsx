import * as React from 'react'
import {useRef, FunctionComponent} from 'react'

import {ScatterLayerConfig, ScatterLayerSpec, LayerProps} from '../types'
import {drawPoints} from '../utils/drawPoints'
import {useCanvas} from '../utils/useCanvas'
import {ScatterHoverLayer} from './ScatterHoverLayer'
import {SCATTER_POINT_SIZE} from '../constants'
import {FILL, SYMBOL} from '../constants/columnKeys'

interface Props extends LayerProps {
  spec: ScatterLayerSpec
  config: ScatterLayerConfig
}

export const ScatterLayer: FunctionComponent<Props> = props => {
  const {config, spec, width, height, xScale, yScale} = props

  const canvasRef = useRef<HTMLCanvasElement>(null)

  const drawPointsOptions = {
    xColData: spec.table.getColumn(config.x, 'number') || [],
    yColData: spec.table.getColumn(config.y, 'number') || [],
    fillColData: spec.table.getColumn(FILL, 'number') || [],
    symbolColData: spec.table.getColumn(SYMBOL, 'number') || [],
    xScale,
    yScale,
    fillScale: spec.scales.fill,
    symbolScale: spec.scales.symbol,
    pointSize: SCATTER_POINT_SIZE,
  }

  useCanvas(
    canvasRef,
    width,
    height,
    context => drawPoints({context, ...drawPointsOptions}),
    Object.values(drawPointsOptions)
  )

  return (
    <>
      <canvas
        className="giraffe-layer scatter"
        ref={canvasRef}
        style={{position: 'absolute'}}
        data-testid="giraffe-layer--scatter"
      />
      <ScatterHoverLayer {...props} />
    </>
  )
}

ScatterLayer.displayName = 'ScatterLayer'
