import * as React from 'react'
import {FunctionComponent, useMemo} from 'react'
import {createPortal} from 'react-dom'

import {TooltipData, Config, ColumnType} from '../types'
import {useTooltipElement} from '../utils/useTooltipElement'
import {TOOLTIP_MAXIMUM_OPACITY, TOOLTIP_MINIMUM_OPACITY} from '../constants'

interface Props {
  data: TooltipData
  config: Config
}

const tooltipColumnOrder = (name: string): number | undefined => {
  switch (name) {
    case '_color':
      return 1
    case '_time':
      return 2
    case '_value':
      return 3
    default:
      return 99
  }
}

const tooltipColumnGap = '12px'

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
    legendColorizeRows: colorizeRows,
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
    type: ColumnType
  ): React.CSSProperties => {
    if (switchToVertical) {
      return {
        width: '100%',
        display: 'table-row',
      }
    }

    return {
      display: 'flex',
      order: tooltipColumnOrder(name),
      flexDirection: 'column',
      marginRight: i === data.length - 1 ? 0 : tooltipColumnGap,
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
    let color = fontBrightColor

    if (colorizeRows && colors) {
      color = colors[i]
    }

    if (switchToVertical) {
      return {
        maxWidth: '200px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        color,
        display: 'table-cell',
        padding: '4px',
        fontWeight: 600,
        lineHeight: '1em',
      }
    }

    return {
      maxWidth: '200px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      fontWeight: 600,
      lineHeight: '1.125em',
      height: '1.125em',
      color,
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
        {!colorizeRows && (
          <TooltipDotColumn
            switchToVertical={switchToVertical}
            colors={columns[0].colors}
          />
        )}
        {columns.map(({name, type, values, colors}, i) => (
          <TooltipColumn
            key={name}
            name={name}
            values={values}
            colors={colors}
            columnStyle={columnStyle(name, i, type)}
            columnHeaderStyle={columnHeaderStyle()}
            columnValueStyle={columnValueStyle}
          />
        ))}
      </div>
    </div>,
    tooltipElement
  )
}

Tooltip.displayName = 'Tooltip'

interface TooltipColumnProps {
  name: string
  values: string[]
  colors: string[]
  columnStyle: React.CSSProperties
  columnHeaderStyle: React.CSSProperties
  columnValueStyle: (i: number, colors: string[]) => React.CSSProperties
}

const TooltipColumn: FunctionComponent<TooltipColumnProps> = ({
  name,
  values,
  colors,
  columnStyle,
  columnHeaderStyle,
  columnValueStyle,
}) => {
  return (
    <div className="giraffe-tooltip-column" style={columnStyle}>
      <div className="giraffe-tooltip-column-header" style={columnHeaderStyle}>
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
  )
}

TooltipColumn.displayName = 'TooltipColumn'

interface TooltipDotColumnProps {
  switchToVertical: boolean
  colors: string[]
}

const TooltipDotColumn: FunctionComponent<TooltipDotColumnProps> = ({
  switchToVertical,
  colors,
}) => {
  const columnStyle = (): React.CSSProperties => {
    if (switchToVertical) {
      return {
        width: '100%',
        display: 'table-row',
      }
    }

    return {
      display: 'flex',
      order: tooltipColumnOrder('_color'),
      flexDirection: 'column',
      marginRight: '6px',
      textAlign: 'left',
    }
  }

  const columnHeaderStyle = (): React.CSSProperties => {
    if (switchToVertical) {
      return {
        display: 'table-cell',
        margin: '4px',
      }
    }

    return {
      marginBottom: '5px',
    }
  }

  const columnValueStyle = (): React.CSSProperties => {
    if (switchToVertical) {
      return {
        width: 'auto',
        display: 'table-cell',
        verticalAlign: 'middle',
        padding: '4px',
      }
    }

    return {
      width: 'auto',
      lineHeight: '1.125em',
      height: '1.125em',
      display: 'flex',
      alignItems: 'center',
      alignContent: 'center',
    }
  }

  return (
    <div className="giraffe-tooltip-column" style={columnStyle()}>
      <div
        className="giraffe-tooltip-column-header"
        style={columnHeaderStyle()}
      >
        &nbsp;
      </div>
      {colors.map((color, i) => (
        <div
          className="giraffe-tooltip-column-value"
          key={i}
          style={columnValueStyle()}
        >
          <div
            className="giraffe-tooltip-column-dot"
            style={{
              width: '0.75em',
              height: '0.75em',
              borderRadius: '50%',
              backgroundColor: color,
              display: 'inline-block',
            }}
          />
        </div>
      ))}
    </div>
  )
}
