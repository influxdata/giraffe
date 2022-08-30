import React, {useRef, FunctionComponent} from 'react'

import {ScatterLayerConfig, ScatterLayerSpec, LayerProps} from '../../types'
import {useHoverPointIndices} from '../../utils/useHoverPointIndices'
import {drawPoints} from '../../utils/drawPoints'
import {Tooltip} from '../Tooltip'
import {getPointsTooltipData} from '../../utils/legend/tooltip'
import {SCATTER_HOVER_POINT_SIZE} from '../../constants'
import {FILL, SYMBOL} from '../../constants/columnKeys'
import {useCanvas} from '../../utils/useCanvas'

interface Props extends LayerProps {
  spec: ScatterLayerSpec
  config: ScatterLayerConfig
}

export const ScatterHoverLayer: FunctionComponent<Props> = ({
  config,
  plotConfig,
  spec,
  width,
  height,
  xScale,
  yScale,
  hoverX,
  hoverY,
  columnFormatter,
}) => {
  const xColData = spec.table.getColumn(config.x, 'number')
  const yColData = spec.table.getColumn(config.y, 'number')
  const fillColData = spec.table.getColumn(FILL, 'number')
  const symbolColData = spec.table.getColumn(SYMBOL, 'number')
  const fillScale = spec.scales.fill
  const symbolScale = spec.scales.symbol

  const rowIndices = useHoverPointIndices(
    'xy',
    hoverX,
    hoverY,
    xColData,
    yColData,
    [],
    xScale,
    yScale,
    width,
    height
  )

  const canvasRef = useRef<HTMLCanvasElement>(null)

  const drawPointsOptions = {
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
    rowIndices,
    pointSize: SCATTER_HOVER_POINT_SIZE,
  }

  useCanvas(canvasRef, width, height, context =>
    drawPoints({context, ...drawPointsOptions})
  )

  if (!rowIndices) {
    return null
  }

  const tooltipData = getPointsTooltipData(
    rowIndices,
    spec.table,
    config.x,
    config.y,
    FILL,
    columnFormatter,
    [...new Set([...config.fill, ...config.symbol])],
    fillScale
  )

  return (
    <>
      <canvas
        className="giraffe-layer scatter-interactions"
        ref={canvasRef}
        style={{position: 'absolute'}}
        data-testid="giraffe-layer--scatter-interact"
      />
      {tooltipData && <Tooltip data={tooltipData} config={plotConfig} />}
    </>
  )
}

ScatterHoverLayer.displayName = 'ScatterHoverLayer'
