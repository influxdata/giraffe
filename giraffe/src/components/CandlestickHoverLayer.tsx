import React, {FunctionComponent} from 'react'

import {Tooltip} from './Tooltip'
import {CandlestickLayerProps} from './CandlestickLayer'
import {TooltipData} from '../types'

const createCheckMouseBounding = ({
  height,
  width,
}: {
  width: number
  height: number
}) => ({mouseX, mouseY}: {mouseX: number; mouseY: number}) => {
  return (
    mouseX !== undefined &&
    mouseX !== null &&
    mouseX >= 0 &&
    mouseX < width &&
    mouseY !== undefined &&
    mouseY !== null &&
    mouseY >= 0 &&
    mouseY < height
  )
}

export const CandlestickHoverLayer: FunctionComponent<CandlestickLayerProps> = props => {
  const {
    plotConfig,
    spec: {values, calculatedWindow, table},
    config: {
      xColumnKey,
      openColumnKey,
      highColumnKey,
      lowColumnKey,
      closeColumnKey,
    },
    xScale,
    hoverX,
    hoverY,
    columnFormatter,
  } = props

  const checkMouseBounding = createCheckMouseBounding(props)

  if (!checkMouseBounding({mouseX: hoverX, mouseY: hoverY})) {
    return null
  }

  const xIndex =
    Math.round(xScale.invert(hoverX) / calculatedWindow) * calculatedWindow

  const value = values.find(x => x.windowStart === xIndex)

  if (!value) {
    return null
  }

  const tableIndexes = value.entriesTableIndexes

  const tooltipData: TooltipData = [
    xColumnKey,
    openColumnKey,
    highColumnKey,
    lowColumnKey,
    closeColumnKey,
  ].map(key => {
    const col = table.getColumn(key)
    const type = table.getColumnType(key)
    const formater = columnFormatter(key)
    return {
      colors: [],
      key,
      name: key,
      type,
      values: tableIndexes.map(i => formater(col[i])),
    }
  })

  return <Tooltip data={tooltipData} config={plotConfig} />
}

CandlestickHoverLayer.displayName = 'ScatterHoverLayer'
