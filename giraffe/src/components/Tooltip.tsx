import * as React from 'react'
import {FunctionComponent, useMemo} from 'react'
import {createPortal} from 'react-dom'

import {LegendData, Config} from '../types'
import {Legend} from './Legend'
import {useTooltipElement} from '../utils/legend/useTooltipElement'
import {TOOLTIP_MAXIMUM_OPACITY, TOOLTIP_MINIMUM_OPACITY} from '../constants'

interface Props {
  data: LegendData
  config: Config
}

export const Tooltip: FunctionComponent<Props> = ({data, config}) => {
  const tooltipElement = useTooltipElement('giraffe-tooltip-container')

  const {
    legendFont: font,
    legendFontBrightColor: fontBrightColor,
    legendBackgroundColor: backgroundColor,
    legendBorder: border,
    legendOpacity,
  } = config

  const tooltipOpacity = useMemo(() => {
    if (
      legendOpacity >= TOOLTIP_MINIMUM_OPACITY &&
      legendOpacity <= TOOLTIP_MAXIMUM_OPACITY
    ) {
      return legendOpacity
    }
    return TOOLTIP_MAXIMUM_OPACITY
  }, [legendOpacity])

  const tooltipContents = <Legend data={data} config={config} />

  return createPortal(
    <div
      className="giraffe-tooltip"
      style={{
        opacity: tooltipOpacity,
        border,
        font,
        backgroundColor,
        color: fontBrightColor,
        borderRadius: '3px',
        padding: '10px',
        cursor: 'crosshair',
      }}
      data-testid="giraffe-tooltip"
    >
      {tooltipContents}
    </div>,
    tooltipElement
  )
}

Tooltip.displayName = 'Tooltip'
