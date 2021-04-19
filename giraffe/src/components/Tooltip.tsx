import * as React from 'react'
import {FunctionComponent, useMemo} from 'react'
import {createPortal} from 'react-dom'

import {LegendData, Config} from '../types'
import {useTooltipElement} from '../utils/legend/useTooltipElement'
import {TOOLTIP_MAXIMUM_OPACITY, TOOLTIP_MINIMUM_OPACITY} from '../constants'

import {generateTooltipStyles, TooltipPillsStyles} from './TooltipStyles'

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

  const tooltipContents = <ActualLegend data={data} config={config} />

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
} //end tooltip component

export const ActualLegend: FunctionComponent<Props> = ({data, config}) => {
  const {
    width,
    height,
    legendFontColor: fontColor,
    legendFontBrightColor: fontBrightColor,
    legendColumns: columnsWhitelist,
    legendOrientationThreshold: orientationThreshold,
    legendColorizeRows: colorizeRows,
    legendHide: hideTooltip,
  } = config

  let columns = []
  if (hideTooltip !== true) {
    // when legendColumns wasn't defined in the config.
    if (!Array.isArray(columnsWhitelist)) {
      columns = data
    }
    // when legendColumns = [] in the config
    else if (columnsWhitelist.length == 0) {
      return null
    }
    // when legendColumns is an array of requested columns
    else {
      columns = data.filter(column => columnsWhitelist.includes(column.key))
    }
  } else {
    return null
  }

  const switchToVertical = columns.length > orientationThreshold

  // 'switchToVertical': true
  //   each column of data displays vertically, and
  //   additional columns are next to the previous column, therefore,
  //   the limit is the horizontal space (width)
  // 'switchToVertical': false
  //   each column of data displays horizontally, and
  //   additional columns are stacked below the previous column, therefore,
  //   the limit is the vertical space (height)
  const maxLength = switchToVertical ? width : height

  const styles = generateTooltipStyles(
    columns,
    switchToVertical,
    colorizeRows,
    fontColor,
    fontBrightColor
  )

  return (
    <div
      className="giraffe-tooltip-table"
      style={styles.table}
      data-testid="giraffe-tooltip-table"
    >
      {!colorizeRows && <TooltipPillColumn styles={styles.pills} />}
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
  )
} //end ActualLegend component

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

interface TooltipPillColumnProps {
  styles: TooltipPillsStyles
}

const TooltipPillColumn: FunctionComponent<TooltipPillColumnProps> = ({
  styles,
}) => {
  const {column, header, value, pills} = styles

  return (
    <div className="giraffe-tooltip-column" style={column}>
      <div className="giraffe-tooltip-column-header" style={header}>
        &nbsp;
      </div>
      {pills.map((pill, i) => (
        <div className="giraffe-tooltip-column-value" key={i} style={value}>
          <div className="giraffe-tooltip-column-pill" style={pill} />
        </div>
      ))}
    </div>
  )
}

TooltipPillColumn.displayName = 'TooltipPillColumn'
