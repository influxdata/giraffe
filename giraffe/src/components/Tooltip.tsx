import * as React from 'react'
import {FunctionComponent, useMemo} from 'react'
import {createPortal} from 'react-dom'

import {LegendData, Config} from '../types'
import {Legend} from './Legend'
import {useLegendElement} from '../utils/legend/useTooltipElement'
import {TOOLTIP_MAXIMUM_OPACITY, TOOLTIP_MINIMUM_OPACITY} from '../constants'

interface Props {
  data: LegendData
  config: Config
}

export const Tooltip: FunctionComponent<Props> = ({data, config}) => {
  const {
    legendBackgroundColor: backgroundColor,
    legendBorder: border,
    legendColumns,
    legendFont: font,
    legendFontBrightColor: fontBrightColor,
    legendHide: isHidden,
    legendOpacity,
  } = config
  const tooltipElement = useLegendElement('giraffe-tooltip-container')

  const tooltipOpacity = useMemo(() => {
    if (
      legendOpacity >= TOOLTIP_MINIMUM_OPACITY &&
      legendOpacity <= TOOLTIP_MAXIMUM_OPACITY
    ) {
      return legendOpacity
    }
    return TOOLTIP_MAXIMUM_OPACITY
  }, [legendOpacity])

  let isTooltipHidden = Boolean(isHidden)
  if (Array.isArray(legendColumns) && legendColumns.length === 0) {
    isTooltipHidden = true
  }

  if (isTooltipHidden) {
    return null
  }

  const tooltipContents = <Legend type="tooltip" data={data} config={config} />

  return createPortal(
    <div
      className="giraffe-tooltip"
      style={{
        backgroundColor,
        border,
        borderRadius: '3px',
        color: fontBrightColor,
        cursor: 'crosshair',
        font,
        opacity: tooltipOpacity,
        padding: '10px',
      }}
      data-testid="giraffe-tooltip"
    >
      {tooltipContents}
    </div>,
    tooltipElement
  )
}

Tooltip.displayName = 'Tooltip'
