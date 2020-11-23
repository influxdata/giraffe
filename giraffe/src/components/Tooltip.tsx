import * as React from 'react'
import {FunctionComponent, useMemo} from 'react'
import {createPortal} from 'react-dom'

import {TooltipData, Config} from '../types'
import {useTooltipElement} from '../utils/useTooltipElement'
import {TOOLTIP_MAXIMUM_OPACITY, TOOLTIP_MINIMUM_OPACITY} from '../constants'

import {generateTooltipStyles, TooltipDotsStyles} from './TooltipStyles'

interface Props {
  data: TooltipData
  config: Config
}

export const Tooltip: FunctionComponent<Props> = ({data, config}) => {
  const tooltipElement = useTooltipElement()

  const {
    width,
    height,
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
  const maxLength = switchToVertical ? width : height

  const styles = generateTooltipStyles(
    columns,
    switchToVertical,
    colorizeRows,
    fontColor,
    fontBrightColor
  )

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
        style={styles.table}
        data-testid="giraffe-tooltip-table"
      >
        {!colorizeRows && <TooltipDotColumn styles={styles.dots} />}
        {columns.map(({name, values}, i) => (
          <TooltipColumn
            key={name}
            name={name}
            maxLength={maxLength}
            values={values}
            columnStyle={styles.columns[i]}
            columnHeaderStyle={styles.headers}
            columnValueStyles={styles.values[i]}
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
  maxLength: number
  values: string[]
  columnStyle: React.CSSProperties
  columnHeaderStyle: React.CSSProperties
  columnValueStyles: React.CSSProperties[]
}

const TooltipColumn: FunctionComponent<TooltipColumnProps> = ({
  name,
  maxLength,
  values,
  columnStyle,
  columnHeaderStyle,
  columnValueStyles,
}) => {
  const valuesLimitedByPlotDimensions = values.slice(0, maxLength)
  return (
    <div className="giraffe-tooltip-column" style={columnStyle}>
      <div className="giraffe-tooltip-column-header" style={columnHeaderStyle}>
        {name}
      </div>
      {valuesLimitedByPlotDimensions.map((value, i) => (
        <div
          className="giraffe-tooltip-column-value"
          key={i}
          style={columnValueStyles[i]}
        >
          {String(value)}
        </div>
      ))}
    </div>
  )
}

TooltipColumn.displayName = 'TooltipColumn'

interface TooltipDotColumnProps {
  styles: TooltipDotsStyles
}

const TooltipDotColumn: FunctionComponent<TooltipDotColumnProps> = ({
  styles,
}) => {
  const {column, header, value, dots} = styles

  return (
    <div className="giraffe-tooltip-column" style={column}>
      <div className="giraffe-tooltip-column-header" style={header}>
        &nbsp;
      </div>
      {dots.map((dot, i) => (
        <div className="giraffe-tooltip-column-value" key={i} style={value}>
          <div className="giraffe-tooltip-column-dot" style={dot} />
        </div>
      ))}
    </div>
  )
}

TooltipDotColumn.displayName = 'TooltipDotColumn'
