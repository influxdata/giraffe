import * as React from 'react'
import {FunctionComponent, useMemo} from 'react'
import {createPortal} from 'react-dom'

import {TooltipData, Config} from '../types'
import {useTooltipElement} from '../utils/useTooltipElement'
import {TOOLTIP_MAXIMUM_OPACITY, TOOLTIP_MINIMUM_OPACITY} from '../constants'

import {generateTooltipStyles, TooltipPillsStyles} from './TooltipStyles'

interface Props {
  data: TooltipData
  config: Config
}

export const Tooltip: FunctionComponent<Props> = ({data, config}) => {
  const tooltipElement = useTooltipElement('giraffe-tooltip-container')

  console.log('in tooltip component.....', data)
  console.log('tooltip component....config,', config)

  const {
    width,
    height,
    legendFont: font,
    legendFontBrightColor: fontBrightColor,
    legendBackgroundColor: backgroundColor,
    legendBorder: border,
    legendOpacity,
  } = config

  console.log('got width (3)', width)
  console.log('got height??(3)', height)

  const tooltipOpacity = useMemo(() => {
    if (
      legendOpacity >= TOOLTIP_MINIMUM_OPACITY &&
      legendOpacity <= TOOLTIP_MAXIMUM_OPACITY
    ) {
      return legendOpacity
    }
    return TOOLTIP_MAXIMUM_OPACITY
  }, [legendOpacity])



const tooltipContents =  <ActualTooltip data={data} config={config}/>

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

 export const ActualTooltip: FunctionComponent<Props> = ({data, config}) => {

  console.log('in (actual) tooltip component.....', data)


  const {
    width,
    height,
    legendFontColor: fontColor,
    legendFontBrightColor: fontBrightColor,
    legendColumns: columnsWhitelist,
    legendOrientationThreshold: orientationThreshold,
    legendColorizeRows: colorizeRows,
    legendDisable: disableTooltip,
  } = config

  console.log('got width (3)', width)
  console.log('got height??(3)', height)

  let columns = []
  if (disableTooltip !== true) {
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

 return <div
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

} //end actualTooltip component



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
