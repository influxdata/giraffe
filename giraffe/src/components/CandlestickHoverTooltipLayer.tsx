import React, {FunctionComponent} from 'react'

import {Tooltip} from './Tooltip'
import {CandlestickLayerProps} from './CandlestickLayer'
import {TooltipData} from '../types'
import {OHLCResultEntry} from '../utils/ohlc'

const createCheckMouseBounding = ({
  height,
  width,
}: {
  width: number
  height: number
}) => ({hoverX, hoverY}: {hoverX: number; hoverY: number}) =>
  hoverX !== undefined &&
  hoverX !== null &&
  hoverX >= 0 &&
  hoverX < width &&
  hoverY !== undefined &&
  hoverY !== null &&
  hoverY >= 0 &&
  hoverY < height

const getCandlestickHoveredValue = (
  props: CandlestickLayerProps
): OHLCResultEntry | undefined => {
  const checkMouseBounding = createCheckMouseBounding(props)

  if (!checkMouseBounding(props)) {
    return null
  }

  const {
    xScale,
    hoverX,
    spec: {calculatedWindow, values},
  } = props

  const xIndex =
    Math.round(xScale.invert(hoverX) / calculatedWindow - 0.5) *
    calculatedWindow

  return values.find(x => x.windowStart === xIndex)
}

export const candlestickGetHoveredValueEntry = getCandlestickHoveredValue

export const CandlestickHoverTooltipLayer: FunctionComponent<CandlestickLayerProps & {
  value: OHLCResultEntry
}> = props => {
  const {
    plotConfig,
    spec: {table},
    config: {
      xColumnKey,
      openColumnKey,
      highColumnKey,
      lowColumnKey,
      closeColumnKey,
    },
    columnFormatter,
    value,
  } = props

  const allKeys = [
    xColumnKey,
    openColumnKey,
    highColumnKey,
    lowColumnKey,
    closeColumnKey,
  ]

  const tooltipData: TooltipData = allKeys
    .map(key => ({
      key,
      col: table.getColumn(key),
      type: table.getColumnType(key),
      formater: columnFormatter(key),
    }))
    .map(({key, col, formater, type}) => ({
      colors: [],
      key,
      name: key,
      type,
      values: value.entriesTableIndexes.map(i => formater(col[i])),
    }))

  return <Tooltip data={tooltipData} config={plotConfig} />
}

CandlestickHoverTooltipLayer.displayName = 'ScatterHoverLayer'
