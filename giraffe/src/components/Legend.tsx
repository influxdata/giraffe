import React, {CSSProperties} from 'react'
import {FunctionComponent} from 'react'

import {Config, LegendData, LegendType} from '../types'
import {
  LEGEND_COLUMN_CLASSNAME,
  STATIC_LEGEND_COLUMN_CLASSNAME,
} from '../constants'
import {generateLegendStyles, LegendPillsStyles} from '../style/legend'

interface Props {
  type: LegendType
  data: LegendData
  config: Config
  isScrollable?: boolean
}

export const Legend: FunctionComponent<Props> = ({
  type: legendType,
  data,
  config,
  isScrollable = false,
}) => {
  const {
    width,
    height,
    legendFontColor: fontColor,
    legendFontBrightColor: fontBrightColor,
    legendColumns: columnsWhitelist,
    legendOrientationThreshold: orientationThreshold,
    legendColorizeRows: colorizeRows,
  } = config

  let columns = []
  if (Array.isArray(columnsWhitelist)) {
    if (columnsWhitelist.length === 0) {
      return null
    }
    columns = data.filter(column => columnsWhitelist.includes(column.key))
  } else {
    columns = data
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

  const styles = generateLegendStyles(
    legendType,
    isScrollable,
    columns,
    switchToVertical,
    colorizeRows,
    fontColor,
    fontBrightColor
  )

  return (
    <div
      className="giraffe-legend-table"
      style={styles.table}
      data-testid="giraffe-legend-table"
    >
      {!colorizeRows && (
        <LegendPillColumn type={legendType} styles={styles.pills} />
      )}
      {columns.map(({name, values}, i) => (
        <LegendColumn
          type={legendType}
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
}

interface LegendColumnProps {
  type: LegendType
  name: string
  maxLength: number
  values: string[]
  columnStyle: CSSProperties
  columnHeaderStyle: CSSProperties
  columnValueStyles: CSSProperties[]
}

const LegendColumn: FunctionComponent<LegendColumnProps> = ({
  type: legendType,
  name,
  maxLength,
  values,
  columnStyle,
  columnHeaderStyle,
  columnValueStyles,
}) => {
  const valuesLimitedByPlotDimensions = values.slice(0, maxLength)
  const classNameBase =
    legendType === 'static'
      ? STATIC_LEGEND_COLUMN_CLASSNAME
      : LEGEND_COLUMN_CLASSNAME

  return (
    <div className={classNameBase} style={columnStyle}>
      <div className={`${classNameBase}-header`} style={columnHeaderStyle}>
        {name}
      </div>
      {valuesLimitedByPlotDimensions.map((value, i) => (
        <div
          className={`${classNameBase}-value`}
          key={i}
          style={columnValueStyles[i]}
        >
          {String(value)}
        </div>
      ))}
    </div>
  )
}

LegendColumn.displayName = 'LegendColumn'

interface LegendPillColumnProps {
  type: LegendType
  styles: LegendPillsStyles
}

const LegendPillColumn: FunctionComponent<LegendPillColumnProps> = ({
  type: legendType,
  styles,
}) => {
  const {column, header, value, pills} = styles
  const classNameBase =
    legendType === 'static'
      ? STATIC_LEGEND_COLUMN_CLASSNAME
      : LEGEND_COLUMN_CLASSNAME

  return (
    <div className={classNameBase} style={column}>
      <div className={`${classNameBase}-header`} style={header}>
        &nbsp;
      </div>
      {pills.map((pill, i) => (
        <div className={`${classNameBase}-value`} key={i} style={value}>
          <div className={`${classNameBase}-pill`} style={pill} />
        </div>
      ))}
    </div>
  )
}

LegendPillColumn.displayName = 'LegendPillColumn'
