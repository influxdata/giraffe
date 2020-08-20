import * as React from 'react'
import {useMemo, useRef, FunctionComponent} from 'react'

import {LayerProps, BandLayerSpec, BandLayerConfig} from '../types'
import {BandHoverLayer} from './BandHoverLayer'
import {simplifyLineData} from '../utils/lineData'
import {useCanvas} from '../utils/useCanvas'
import {drawBands} from '../utils/drawBands'
import {useHoverPointIndices} from '../utils/useHoverPointIndices'
import {FILL} from '../constants/columnKeys'
import {
  getBandHoverIndices,
  getLineLengths,
  getMinMaxOfBands,
} from '../utils/getBandHoverIndices'
import {
  groupLineIndicesIntoBands,
  alignMinMaxWithBand,
} from '../transforms/band'

export interface Props extends LayerProps {
  spec: BandLayerSpec
  config: BandLayerConfig
}

const HIGHLIGHT_HOVERED_LINE = 0.4
const NO_HIGHLIGHT = 1

export const BandLayer: FunctionComponent<Props> = props => {
  const {config, spec, width, height, xScale, yScale, hoverX, hoverY} = props

  const simplifiedLineData = useMemo(
    () =>
      alignMinMaxWithBand(
        simplifyLineData(spec.lineData, xScale, yScale),
        spec.bandIndexMap
      ),
    [spec.lineData, xScale, yScale]
  )

  const drawBandsOptions = {
    bandFillColors: spec.bandFillColors,
    fill: spec.columnGroupMaps.fill,
    interpolation: config.interpolation,
    lineData: simplifiedLineData,
    lineWidth: config.lineWidth,
    lineOpacity: config.lineOpacity,
    shadeOpacity: config.shadeOpacity,
  }

  const canvasRef = useRef<HTMLCanvasElement>(null)

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

  const groupColData = spec.table.getColumn(FILL, 'number')
  const hoverXYColumnData = {
    xs: [],
    ys: [],
    groupColData: [],
  }
  const {rowIndices} = spec.bandIndexMap

  rowIndices.forEach(rowIndex => {
    hoverXYColumnData.xs = hoverXYColumnData.xs.concat(
      spec.lineData[rowIndex].xs
    )
    hoverXYColumnData.ys = hoverXYColumnData.ys.concat(
      spec.lineData[rowIndex].ys
    )
    hoverXYColumnData.groupColData = hoverXYColumnData.groupColData.concat(
      ...groupColData.filter(index => index === rowIndex)
    )
  })

  // Get the min and max indices of the corresponding hovered line(s)
  //   by using an 'x' dimension hover
  const hoverAsXIndices = useHoverPointIndices(
    'x',
    hoverX,
    hoverY,
    spec.table.getColumn(config.x, 'number'),
    spec.table.getColumn(config.y, 'number'),
    spec.table.getColumn(FILL, 'number'),
    xScale,
    yScale,
    width,
    height
  )

  const minMaxOfBands = getMinMaxOfBands(
    hoverAsXIndices,
    groupColData,
    groupLineIndicesIntoBands(spec.columnGroupMaps.fill)
  )

  const hoverRowIndices = useHoverPointIndices(
    hoverDimension,
    hoverX,
    hoverY,
    hoverXYColumnData.xs,
    hoverXYColumnData.ys,
    hoverXYColumnData.groupColData,
    xScale,
    yScale,
    width,
    height
  )

  const lineLengths = getLineLengths(spec.lineData)

  const bandHoverIndices = getBandHoverIndices(
    lineLengths,
    hoverRowIndices,
    hoverXYColumnData.groupColData,
    minMaxOfBands
  )

  const hasHoverData = hoverRowIndices && hoverRowIndices.length > 0

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
