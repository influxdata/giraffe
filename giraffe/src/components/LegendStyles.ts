import {CSSProperties} from 'react'
import {ColumnType, LegendData, LegendType} from '../types'

// Style Constants
import {
  STATIC_LEGEND_LINE_SPACING_RATIO,
  STATIC_LEGEND_SCROLL_PADDING,
} from '../constants'

const legendColumnGap = '12px'
const legendColumnMaxWidth = '200px'
const legendTablePadding = '4px'

const legendColumnOrder = (name: string): number | undefined => {
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

// Legend Styles
export interface LegendPillsStyles {
  column: CSSProperties
  header: CSSProperties
  value: CSSProperties
  pills: CSSProperties[]
}

export interface LegendStyles {
  table: CSSProperties
  columns: CSSProperties[]
  headers: CSSProperties
  values: CSSProperties[][]
  pills: LegendPillsStyles
}

export const generateLegendStyles = (
  legendType: LegendType,
  isScrollable: boolean,
  legendData: LegendData,
  switchToVertical: boolean,
  colorizeRows: boolean,
  fontColor: string,
  fontBrightColor: string
): LegendStyles => {
  // Regular Legend Styles
  const columnCount = legendData.length - 1
  const table = legendTableStyle(switchToVertical)
  const columns = legendData.map((column, i) =>
    legendColumnStyle(
      isScrollable,
      column.name,
      i,
      column.type,
      switchToVertical,
      columnCount
    )
  )
  const headers = legendColumnHeaderStyle(switchToVertical, fontColor)
  const values = legendData.map(column => {
    return column.values.map((_, i) =>
      legendType === 'tooltip'
        ? tooltipColumnValueStyle(
            i,
            column.colors,
            colorizeRows,
            fontBrightColor,
            switchToVertical
          )
        : staticLegendColumnValueStyle(
            i,
            column.colors,
            colorizeRows,
            fontBrightColor,
            switchToVertical
          )
    )
  })

  // Special "pills" Column Styles
  const pills = LegendPillsColumnStyles(switchToVertical, legendData)

  return {
    table,
    columns,
    headers,
    values,
    pills,
  }
}

const legendTableStyle = (switchToVertical: boolean): CSSProperties => {
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

const legendColumnStyle = (
  isScrollableColumn: boolean,
  name: string,
  index: number,
  type: ColumnType,
  switchToVertical: boolean,
  columnCount: number
): CSSProperties => {
  if (switchToVertical) {
    return {
      width: '100%',
      display: 'table-row',
    }
  }

  const columnStyle: CSSProperties = {
    display: 'flex',
    order: legendColumnOrder(name),
    flexDirection: 'column',
    marginRight: index === columnCount ? 0 : legendColumnGap,
    textAlign: type === 'number' ? 'right' : 'left',
  }

  if (isScrollableColumn) {
    columnStyle.paddingBottom = STATIC_LEGEND_SCROLL_PADDING
    if (index === columnCount) {
      columnStyle.paddingRight = STATIC_LEGEND_SCROLL_PADDING
    }
  }
  return columnStyle
}

const legendColumnHeaderStyle = (
  switchToVertical: boolean,
  fontColor: string
): React.CSSProperties => {
  if (switchToVertical) {
    return {
      color: fontColor,
      display: 'table-cell',
      margin: legendTablePadding,
      whiteSpace: 'nowrap',
    }
  }

  return {
    marginBottom: legendTablePadding,
    color: fontColor,
    whiteSpace: 'nowrap',
  }
}

const tooltipColumnValueStyle = (
  i: number,
  colors: string[],
  colorizeRows: boolean,
  fontBrightColor: string,
  switchToVertical: boolean
): React.CSSProperties => {
  let color = fontBrightColor

  if (colorizeRows && colors) {
    color = colors[i]
  }

  if (switchToVertical) {
    return {
      maxWidth: legendColumnMaxWidth,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      color,
      display: 'table-cell',
      padding: legendTablePadding,
      fontWeight: 600,
      lineHeight: '1em',
    }
  }

  return {
    maxWidth: legendColumnMaxWidth,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    fontWeight: 600,
    lineHeight: '1.125em',
    height: '1.125em',
    color,
  }
}

const staticLegendColumnValueStyle = (
  i: number,
  colors: string[],
  colorizeRows: boolean,
  fontBrightColor: string,
  switchToVertical: boolean
): React.CSSProperties => {
  let color = fontBrightColor

  if (colorizeRows && colors) {
    color = colors[i]
  }

  if (switchToVertical) {
    return {
      maxWidth: legendColumnMaxWidth,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      color,
      display: 'table-cell',
      padding: `${2 * STATIC_LEGEND_LINE_SPACING_RATIO}em`,
      fontWeight: 600,
      lineHeight: '1em',
    }
  }

  return {
    maxWidth: legendColumnMaxWidth,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    fontWeight: 600,
    padding: `${STATIC_LEGEND_LINE_SPACING_RATIO}em`,
    lineHeight: '1.25em',
    height: '1.25em',
    color,
  }
}

const LegendPillsColumnStyles = (
  switchToVertical: boolean,
  legendData: LegendData
): LegendPillsStyles => {
  let column: CSSProperties = {
    display: 'flex',
    order: legendColumnOrder('_color'),
    flexDirection: 'column',
    marginRight: '6px',
    textAlign: 'left',
  }

  let header: CSSProperties = {
    marginBottom: '5px',
  }

  let value: CSSProperties = {
    width: 'auto',
    lineHeight: '1.125em',
    height: '1.125em',
    display: 'flex',
    alignItems: 'center',
    alignContent: 'center',
  }

  if (switchToVertical) {
    column = {
      width: '100%',
      display: 'table-row',
    }

    header = {
      display: 'table-cell',
      margin: legendTablePadding,
    }

    value = {
      width: 'auto',
      display: 'table-cell',
      verticalAlign: 'middle',
      padding: legendTablePadding,
    }
  }

  const colors =
    legendData.length && Array.isArray(legendData[0].colors)
      ? legendData[0].colors
      : []
  const pills = colors.map(color => ({
    width: '.875em',
    height: '.25em',
    borderRadius: '.125em',
    backgroundColor: color,
    display: 'inline-block',
  }))

  return {
    column,
    header,
    value,
    pills,
  }
}
