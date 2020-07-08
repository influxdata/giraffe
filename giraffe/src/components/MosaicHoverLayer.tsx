import React, {useRef, FunctionComponent} from 'react'

import {drawMosaic} from '../utils/drawMosaic'
import {MosaicLayerConfig, MosaicLayerSpec, LayerProps} from '../types'
import {X_MIN, X_MAX, FILL, SERIES} from '../constants/columnKeys'
import {Tooltip} from './Tooltip'
import {useCanvas} from '../utils/useCanvas'

interface Props extends LayerProps {
  spec: MosaicLayerSpec
  config: MosaicLayerConfig
}

export const MosaicHoverLayer: FunctionComponent<Props> = ({
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
  const xMinCol = spec.table.getColumn(X_MIN, 'number')
  const xMaxCol = spec.table.getColumn(X_MAX, 'number')
  const valueCol = spec.table.getColumn(FILL, 'string')
  const cpuCol = spec.table.getColumn(SERIES, 'string')
  const fillScale = spec.scales.fill

  // can we use useHoverPointIndices() or do we need
  // to make our own function?
  const rowIndices

  const canvasRef = useRef<HTMLCanvasElement>(null)

  //can we use drawPointsOptions() or do we need to
  // make our own?
  const drawMosaicOptions

  useCanvas(canvasRef, width, height, context =>
    drawMosaic({context, ...drawMosaicOptions})
  )

  if (!rowIndices) {
    return null
  }

  //eq of const tooltipData = getPointsTooltipData()?
  const tooltipData = getMosaicTooltipData()

  return (
    <>
      <canvas
        className="giraffe-layer mosaic-interactions"
        ref={canvasRef}
        style={{position: 'absolute'}}
        data-testid="giraffe-layer--mosaic-interact"
      />
      {tooltipData && <Tooltip data={tooltipData} config={plotConfig} />}
    </>
  )
}

MosaicHoverLayer.displayName = 'MosaicHoverLayer'
