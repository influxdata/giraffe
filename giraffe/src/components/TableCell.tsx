// Libraries
import React, {FunctionComponent} from 'react'
import classnames from 'classnames'

// Constants
import {ASCENDING, DEFAULT_TIME_FIELD} from '../constants/tableGraph'

// Utils
import {generateThresholdsListHexs} from '../utils/colorOperations'
import {isString} from '../utils/isString'
import {defaultTo} from '../utils/defaultTo'
import {styleReducer} from '../utils/styleReducer'

// Types
import {TableViewProperties, SortOptions, RenamableField} from '../types'
import {CellRendererProps} from './TableGraphTable'

// Styles
import styles from './TableGraphs.scss'

interface Props extends CellRendererProps {
  sortOptions: SortOptions
  data: string
  dataType: string
  properties: TableViewProperties
  hoveredRowIndex: number
  hoveredColumnIndex: number
  isTimeVisible: boolean
  isVerticalTimeAxis: boolean
  isFirstColumnFixed: boolean
  onClickFieldName: (data: string) => void
  onHover: (e: React.MouseEvent<HTMLElement>) => void
  resolvedRenamableFields: RenamableField[]
  timeFormatter: (time: string) => string
}

const URL_REGEXP = /((http|https)?:\/\/[^\s]+)/g

// From https://github.com/influxdata/influxdb/commit/426f076d2c27da4e67b8d60ac023d30de88f0516:
// NOTE: rip this out if you spend time any here as per:
// https://stackoverflow.com/questions/1500260/detect-urls-in-text-with-javascript/1500501#1500501
const asLink = (str: string) => {
  const isURL = `${str}`.includes('http://') || `${str}`.includes('https://')
  if (isURL === false) {
    return str
  }

  const regex = RegExp(URL_REGEXP.source, URL_REGEXP.flags)
  const out = []
  let index = 0
  let link
  let match

  do {
    match = regex.exec(str)

    if (match) {
      if (match.index - index > 0) {
        out.push(str.slice(index, match.index))
      }

      link = str.slice(match.index, match.index + match[1].length)
      out.push(
        <a href={link} target="_blank">
          {link}
        </a>
      )

      index = match.index + match[1].length
    }
  } while (match)

  return out
}

const getStyle = (props: Props) => {
  const {
    style,
    properties,
    data,
    dataType,
    isFirstColumnFixed,
    rowIndex,
    columnIndex,
  } = props
  const {colors} = properties

  if (
    isFixed(isFirstColumnFixed, rowIndex, columnIndex) ||
    isTimeData(props) ||
    isTimestamp(dataType) ||
    isNaN(Number(data))
  ) {
    return style
  }

  const thresholdData = {colors, lastValue: data, cellType: 'table'}
  const {bgColor, textColor} = generateThresholdsListHexs(thresholdData)
  return {
    ...style,
    backgroundColor: bgColor,
    color: textColor,
  }
}

const getClassName = (props: Props): string => {
  const {
    parent,
    sortOptions,
    data,
    isVerticalTimeAxis,
    isFirstColumnFixed,
    rowIndex,
    columnIndex,
    hoveredRowIndex,
    hoveredColumnIndex,
  } = props
  const classes = classnames('table-graph-cell', {
    'table-graph-cell__fixed-row': isFixedRow(rowIndex, columnIndex),
    'table-graph-cell__fixed-column': isFixedColumn(
      isFirstColumnFixed,
      rowIndex,
      columnIndex
    ),
    'table-graph-cell__fixed-corner': isFixedCorner(rowIndex, columnIndex),
    'table-graph-cell__highlight-row': isHighlightedRow(
      parent,
      rowIndex,
      hoveredRowIndex
    ),
    'table-graph-cell__highlight-column': isHighlightedColumn(
      columnIndex,
      hoveredColumnIndex
    ),
    'table-graph-cell__numerical': !isNaN(Number(data)),
    'table-graph-cell__field-name': isFieldName(
      isVerticalTimeAxis,
      rowIndex,
      columnIndex
    ),
    'table-graph-cell__sort-asc':
      isFieldName(isVerticalTimeAxis, rowIndex, columnIndex) &&
      isSorted(sortOptions, data) &&
      isAscending(sortOptions),
    'table-graph-cell__sort-desc':
      isFieldName(isVerticalTimeAxis, rowIndex, columnIndex) &&
      isSorted(sortOptions, data) &&
      !isAscending(sortOptions),
  })
    .split(' ')
    .reduce((accum, current) => styleReducer(styles, accum, current), '')
  return classes
}

const getContents = (props: Props): string => {
  const {
    properties,
    data,
    dataType,
    timeFormatter,
    isVerticalTimeAxis,
    rowIndex,
    columnIndex,
  } = props
  const {decimalPlaces} = properties

  if (data && dataType.includes('dateTime')) {
    return timeFormatter(data)
  }

  if (
    isString(data) &&
    isFieldName(isVerticalTimeAxis, rowIndex, columnIndex)
  ) {
    return defaultTo(getFieldName(props), '').toString()
  }

  if (!isNaN(+data) && decimalPlaces.isEnforced && decimalPlaces.digits < 100) {
    return (+data).toFixed(decimalPlaces.digits)
  }

  return defaultTo(data, '').toString()
}

const getFieldName = (props: Props): string => {
  const {
    data,
    resolvedRenamableFields = [DEFAULT_TIME_FIELD],
    isVerticalTimeAxis,
    rowIndex,
    columnIndex,
  } = props
  const foundField =
    isFieldName(isVerticalTimeAxis, rowIndex, columnIndex) &&
    resolvedRenamableFields.find(({internalName}) => internalName === data)

  return foundField && (foundField.displayName || foundField.internalName)
}

const isFieldName = (isVerticalTimeAxis, rowIndex, columnIndex): boolean =>
  isVerticalTimeAxis ? isFirstRow(rowIndex) : isFirstCol(columnIndex)

const isHighlightedRow = (parent, rowIndex, hoveredRowIndex): boolean => {
  return (
    (parent.current && rowIndex === parent.current.props.scrollToRow) ||
    (rowIndex === hoveredRowIndex && hoveredRowIndex > 0)
  )
}

const isHighlightedColumn = (columnIndex, hoveredColumnIndex): boolean =>
  columnIndex === hoveredColumnIndex && hoveredColumnIndex > 0

const isTimeData = (props: Props): boolean => {
  const {
    isTimeVisible,
    isVerticalTimeAxis,
    resolvedRenamableFields,
    rowIndex,
    columnIndex,
  } = props
  return (
    isTimeVisible &&
    (isVerticalTimeAxis
      ? !isFirstRow(rowIndex) &&
        columnIndex === getTimeFieldIndex(resolvedRenamableFields)
      : rowIndex === getTimeFieldIndex(resolvedRenamableFields) &&
        isFirstCol(columnIndex))
  )
}

const isSorted = (sortOptions, data): boolean => sortOptions.field === data

const isAscending = (sortOptions): boolean =>
  sortOptions.direction === ASCENDING

const isFirstRow = (rowIndex): boolean => rowIndex === 0

const isFirstCol = (columnIndex): boolean => columnIndex === 0

const isFixedRow = (rowIndex, columnIndex): boolean => {
  return isFirstRow(rowIndex) && !isFirstCol(columnIndex)
}

const isFixedColumn = (isFirstColumnFixed, rowIndex, columnIndex): boolean => {
  return isFirstColumnFixed && !isFirstRow(rowIndex) && isFirstCol(columnIndex)
}

const isFixedCorner = (rowIndex, columnIndex): boolean => {
  return isFirstRow(rowIndex) && isFirstCol(columnIndex)
}

const isTimestamp = (dataType): boolean => dataType === 'dateTime:RFC3339'

const isFixed = (isFirstColumnFixed, rowIndex, columnIndex): boolean => {
  return (
    isFixedRow(rowIndex, columnIndex) ||
    isFixedColumn(isFirstColumnFixed, rowIndex, columnIndex) ||
    isFixedCorner(rowIndex, columnIndex)
  )
}

const getTimeFieldIndex = (resolvedRenamableFields): number => {
  let hiddenBeforeTime = 0
  const timeIndex = resolvedRenamableFields.findIndex(
    ({internalName, visible}) => {
      if (!visible) {
        hiddenBeforeTime += 1
      }
      return internalName === DEFAULT_TIME_FIELD.internalName
    }
  )

  return timeIndex - hiddenBeforeTime
}

export const TableCell: FunctionComponent<Props> = (props: Props) => {
  const {
    data,
    rowIndex,
    columnIndex,
    onHover,
    isVerticalTimeAxis,
    onClickFieldName,
  } = props

  const handleClick = () => {
    return isFieldName(isVerticalTimeAxis, rowIndex, columnIndex) &&
      isString(data)
      ? onClickFieldName(data)
      : null
  }

  if (rowIndex === 0) {
    return (
      <div
        style={getStyle(props)}
        className={getClassName(props)}
        onClick={handleClick}
        data-column-index={columnIndex}
        data-row-index={rowIndex}
        data-testid={`${data}-table-header`}
        onMouseOver={onHover}
        title={getContents(props)}
      >
        {getContents(props)}
      </div>
    )
  }
  return (
    <div
      style={getStyle(props)}
      className={getClassName(props)}
      onClick={handleClick}
      data-column-index={columnIndex}
      data-row-index={rowIndex}
      onMouseOver={onHover}
      title={getContents(props)}
    >
      {asLink(getContents(props))}
    </div>
  )
}
