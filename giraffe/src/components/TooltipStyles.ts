import {CSSProperties} from 'react'
import {TooltipData, ColumnType} from '../types'

// Style Constants
const tooltipColumnGap = '12px'
const tooltipColumnMaxWidth = '200px'
const tooltipTablePadding = '4px'

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

// Tooltip Styles
export interface TooltipDotsStyles {
  column: CSSProperties
  header: CSSProperties
  value: CSSProperties
  dots: CSSProperties[]
}

export interface TooltipStyles {
  table: CSSProperties
  columns: CSSProperties[]
  headers: CSSProperties
  values: CSSProperties[][]
  dots: TooltipDotsStyles
}

export const generateTooltipStyles = (
  tooltipData: TooltipData,
  switchToVertical: boolean,
  colorizeRows: boolean,
  fontColor: string,
  fontBrightColor: string
): TooltipStyles => {
  // Regular Tooltip Styles
  const columnCount = tooltipData.length - 1
  const table = tooltipTableStyle(switchToVertical)
  const columns = tooltipData.map((column, i) =>
    tooltipColumnStyle(
      column.name,
      i,
      column.type,
      switchToVertical,
      columnCount
    )
  )
  const headers = tooltipColumnHeaderStyle(switchToVertical, fontColor)
  const values = tooltipData.map(column => {
    return column.values.map((_, i) =>
      tooltipColumnValueStyle(
        i,
        column.colors,
        colorizeRows,
        fontBrightColor,
        switchToVertical
      )
    )
  })

  // Special "Dots" Column Styles
  const dots = tooltipDotsColumnStyles(switchToVertical, tooltipData)

  return {
    table,
    columns,
    headers,
    values,
    dots,
  }
}

const tooltipTableStyle = (switchToVertical: boolean): CSSProperties => {
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

const tooltipColumnStyle = (
  name: string,
  i: number,
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

  return {
    display: 'flex',
    order: tooltipColumnOrder(name),
    flexDirection: 'column',
    marginRight: i === columnCount ? 0 : tooltipColumnGap,
    textAlign: type === 'number' ? 'right' : 'left',
  }
}

const tooltipColumnHeaderStyle = (
  switchToVertical: boolean,
  fontColor: string
): React.CSSProperties => {
  if (switchToVertical) {
    return {
      color: fontColor,
      display: 'table-cell',
      margin: tooltipTablePadding,
    }
  }

  return {
    marginBottom: tooltipTablePadding,
    color: fontColor,
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
      maxWidth: tooltipColumnMaxWidth,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      color,
      display: 'table-cell',
      padding: tooltipTablePadding,
      fontWeight: 600,
      lineHeight: '1em',
    }
  }

  return {
    maxWidth: tooltipColumnMaxWidth,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    fontWeight: 600,
    lineHeight: '1.125em',
    height: '1.125em',
    color,
  }
}

const tooltipDotsColumnStyles = (
  switchToVertical: boolean,
  tooltipData: TooltipData
): TooltipDotsStyles => {
  let column: CSSProperties = {
    display: 'flex',
    order: tooltipColumnOrder('_color'),
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
      margin: tooltipTablePadding,
    }

    value = {
      width: 'auto',
      display: 'table-cell',
      verticalAlign: 'middle',
      padding: tooltipTablePadding,
    }
  }

  const dots = tooltipData[0].colors.map(color => ({
    width: '0.75em',
    height: '0.75em',
    borderRadius: '50%',
    backgroundColor: color,
    display: 'inline-block',
  }))

  return {
    column,
    header,
    value,
    dots,
  }
}
