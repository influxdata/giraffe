import React, {FunctionComponent, RefObject, useMemo} from 'react'

import {LayerProps, BandLayerSpec, BandLayerConfig} from '../types'
import {BandHoverLayer} from './BandHoverLayer'
import {simplifyLineData} from '../utils/lineData'
import {useCanvas} from '../utils/useCanvas'
import {drawBands} from '../utils/drawBands'
import {useHoverPointIndices} from '../utils/useHoverPointIndices'
import {useBandHoverColumns} from '../utils/useBandHover'
import {FILL} from '../constants/columnKeys'
import {getBandHoverIndices, getLineLengths} from '../utils/bandHover'
import {
  groupLineIndicesIntoBands,
  alignMinMaxWithBand,
} from '../transforms/band'

export interface Props extends LayerProps {
  spec: BandLayerSpec
  config: BandLayerConfig
  canvasRef: RefObject<HTMLCanvasElement>
}

const HIGHLIGHT_HOVERED_LINE = 0.4
const NO_HIGHLIGHT = 1

export const BandLayer: FunctionComponent<Props> = props => {
  const {
    canvasRef,
    config,
    height,
    hoverX,
    hoverY,
    legendHide,
    spec,
    width,
    xScale,
    yScale,
  } = props

  const {
    lowerColumnName = '',
    mainColumnName: rowColumnName,
    upperColumnName = '',
  } = config

  const simplifiedLineData = useMemo(
    () =>
      simplifyLineData(
        alignMinMaxWithBand(spec.lineData, spec.bandLineMap),
        xScale,
        yScale
      ),
    [spec.lineData, xScale, yScale]
  )

  const drawBandsOptions = {
    bandLineMap: spec.bandLineMap,
    interpolation: config.interpolation,
    lineData: simplifiedLineData,
    lineWidth: config.lineWidth,
    lineOpacity: config.lineOpacity,
    shadeOpacity: config.shadeOpacity,
  }

  useCanvas(
    canvasRef,
    width,
    height,
    context => drawBands({context, ...drawBandsOptions}),
    Object.values(drawBandsOptions)
  )

  let hoverDimension: 'x' | 'y' | 'xy'

  if (config.hoverDimension === 'auto') {
    hoverDimension = 'x'
    if (Object.keys(spec.lineData).length > config.maxTooltipRows) {
      hoverDimension = 'xy'
    }
  } else {
    hoverDimension = config.hoverDimension
  }

  // Band Plot allows hovering on the nearest band or bands,
  // and any hoverable point should be associated with a band
  const hoverableColumnData = useBandHoverColumns(
    hoverX,
    hoverY,
    spec.lineData,
    spec.table.getColumn(FILL, 'number'),
    spec.bandLineMap,
    width,
    height
  )

  const hoverRowIndices = useHoverPointIndices(
    hoverDimension,
    hoverX,
    hoverY,
    hoverableColumnData.xs,
    hoverableColumnData.ys,
    hoverableColumnData.groupColData,
    xScale,
    yScale,
    width,
    height
  )

  const lineLengths = getLineLengths(spec.lineData)

  const bandHoverIndices = getBandHoverIndices(
    lineLengths,
    hoverRowIndices,
    hoverableColumnData.groupColData,
    groupLineIndicesIntoBands(
      spec.columnGroupMaps.fill,
      lowerColumnName,
      rowColumnName,
      upperColumnName
    )
  )

  const hasHoverData =
    hoverRowIndices && hoverRowIndices.length > 0 && !legendHide

  return (
    <>
      <canvas
        className="giraffe-layer giraffe-layer-band-chart"
        ref={canvasRef}
        style={{
          position: 'absolute',
          opacity:
            hoverDimension === 'xy' && hasHoverData
              ? HIGHLIGHT_HOVERED_LINE
              : NO_HIGHLIGHT,
        }}
        data-testid="giraffe-layer-band-chart"
      />
      {hasHoverData && (
        <BandHoverLayer
          {...props}
          bandHoverIndices={bandHoverIndices}
          dimension={hoverDimension}
          simplifiedLineData={simplifiedLineData}
        />
      )}
    </>
  )
}

BandLayer.displayName = 'BandLayer'
