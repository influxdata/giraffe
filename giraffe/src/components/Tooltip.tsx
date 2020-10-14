import * as React from 'react'
import {FunctionComponent, useMemo} from 'react'
import {createPortal} from 'react-dom'

import {TooltipData, Config} from '../types'
import {useTooltipElement} from '../utils/useTooltipElement'
import {TOOLTIP_MAXIMUM_OPACITY, TOOLTIP_MINIMUM_OPACITY} from '../constants'

interface Props {
  data: TooltipData
  config: Config
}

export const Tooltip: FunctionComponent<Props> = ({data, config}) => {
  const tooltipElement = useTooltipElement()

  const {
    legendFont: font,
    legendFontColor: fontColor,
    legendFontBrightColor: fontBrightColor,
    legendBackgroundColor: backgroundColor,
    legendBorder: border,
    legendColumns: columnsWhitelist,
    legendOpacity,
    legendOrientationThreshold: orientationThreshold,
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

  const columns = columnsWhitelist
    ? data.filter(column => columnsWhitelist.includes(column.key))
    : data

  const switchToVertical = columns.length > orientationThreshold

  const columnOrder = (name: string): number | undefined => {
    switch (name) {
      case '_time':
        return 1
      case '_value':
        return 2
      default:
        return 99
    }
  }

  const tableStyle = (): React.CSSProperties => {
    if (switchToVertical) {
      return {
        display: 'table',
      }
    }

    return {
      flexDirection: 'row',
      display: 'flex',
    }
  }

  const columnStyle = (
    name: string,
    i: number,
    type: string
  ): React.CSSProperties => {
    const columnGap = '14px'

    if (switchToVertical) {
      return {
        width: '100%',
        display: 'table-row',
      }
    }

    return {
      display: 'flex',
      order: columnOrder(name),
      flexDirection: 'column',
      marginRight: i === data.length - 1 ? 0 : columnGap,
      textAlign: type === 'number' ? 'right' : 'left',
    }
  }

  const columnHeaderStyle = (): React.CSSProperties => {
    if (switchToVertical) {
      return {
        color: fontColor,
        display: 'table-cell',
        margin: '4px',
      }
    }

    return {
      marginBottom: '5px',
      color: fontColor,
    }
  }

  const columnValueStyle = (
    i: number,
    colors: string[]
  ): React.CSSProperties => {
    if (switchToVertical) {
      return {
        maxWidth: '200px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        color: colors && colors[i] ? colors[i] : fontBrightColor,
        display: 'table-cell',
        padding: '4px',
        fontWeight: 600,
      }
    }

    return {
      maxWidth: '200px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      fontWeight: 600,
      color: colors && colors[i] ? colors[i] : fontBrightColor,
    }
  }

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
      <div
        className="giraffe-tooltip-table"
        style={tableStyle()}
        data-testid="giraffe-tooltip-table"
      >
        {columns.map(({name, type, values, colors}, i) => (
          <div
            key={name}
            className="giraffe-tooltip-column"
            style={columnStyle(name, i, type)}
          >
            <div
              className="giraffe-tooltip-column-header"
              style={columnHeaderStyle()}
            >
              {name}
            </div>
            {values.map((value, i) => (
              <div
                className="giraffe-tooltip-column-value"
                key={i}
                style={columnValueStyle(i, colors)}
              >
                {String(value)}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>,
    tooltipElement
  )
}

Tooltip.displayName = 'Tooltip'
