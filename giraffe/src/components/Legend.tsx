import * as React from 'react'
import {FunctionComponent} from 'react'

import {LegendData, Config} from '../types'
import {generateLegendStyles, LegendPillsStyles} from './LegendStyles'

interface Props {
  data: LegendData
  config: Config
}

export const Legend: FunctionComponent<Props> = ({data, config}) => {
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
      {!colorizeRows && <LegendPillColumn styles={styles.pills} />}
      {columns.map(({name, values}, i) => (
        <LegendColumn
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
  name: string
  maxLength: number
  values: string[]
  columnStyle: React.CSSProperties
  columnHeaderStyle: React.CSSProperties
  columnValueStyles: React.CSSProperties[]
}

const LegendColumn: FunctionComponent<LegendColumnProps> = ({
  name,
  maxLength,
  values,
  columnStyle,
  columnHeaderStyle,
  columnValueStyles,
}) => {
  const valuesLimitedByPlotDimensions = values.slice(0, maxLength)
  return (
    <div className="giraffe-legend-column" style={columnStyle}>
      <div className="giraffe-legend-column-header" style={columnHeaderStyle}>
        {name}
      </div>
      {valuesLimitedByPlotDimensions.map((value, i) => (
        <div
          className="giraffe-legend-column-value"
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
  styles: LegendPillsStyles
}

const LegendPillColumn: FunctionComponent<LegendPillColumnProps> = ({
  styles,
}) => {
  const {column, header, value, pills} = styles

  return (
    <div className="giraffe-legend-column" style={column}>
      <div className="giraffe-legend-column-header" style={header}>
        &nbsp;
      </div>
      {pills.map((pill, i) => (
        <div className="giraffe-legend-column-value" key={i} style={value}>
          <div className="giraffe-legend-column-pill" style={pill} />
        </div>
      ))}
    </div>
  )
}

LegendPillColumn.displayName = 'LegendPillColumn'
