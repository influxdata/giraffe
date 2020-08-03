// Libraries
import React, {FunctionComponent, useState, useEffect, useRef} from 'react'
import {timeFormatter} from '../utils/formatters'

// Components
import {ColumnSizer, SizedColumnProps} from 'react-virtualized'
import AutoSizer from 'react-virtualized-auto-sizer'
import {TableCell} from './TableCell'
import {MultiGrid, MultiGridInputHandles, PropsMultiGrid} from './MultiGrid'

// Utils
import {withHoverTime, InjectedHoverProps} from './hoverTime'
import {findHoverTimeIndex, resolveTimeFormat} from '../utils/tableGraph'
import {get} from '../utils/get'

// Constants
import {
  NULL_ARRAY_INDEX,
  DEFAULT_FIX_FIRST_COLUMN,
  DEFAULT_VERTICAL_TIME_AXIS,
  DEFAULT_TIME_FIELD,
} from '../constants/tableGraph'
const COLUMN_MIN_WIDTH = 100
const ROW_HEIGHT = 30

// Types
import {
  TableViewProperties,
  TimeZone,
  Theme,
  TransformTableDataReturnType,
} from '../types'

// Styles
import styles from './TableGraphs.scss'

export interface ColumnWidths {
  totalWidths: number
  widths: {[x: string]: number}
}

export interface CellRendererProps {
  columnIndex: number
  rowIndex: number
  key: string
  parent: React.Component<PropsMultiGrid>
  style: React.CSSProperties
}

interface OwnProps {
  dataTypes: {[x: string]: string}
  transformedDataBundle: TransformTableDataReturnType
  properties: TableViewProperties
  onSort: (fieldName: string) => void
  timeZone: TimeZone
  theme: Theme
}

type Props = OwnProps & InjectedHoverProps

interface State {
  timeColumnWidth: number
  totalColumnWidths: number
  shouldResize: boolean
  hoveredColumnIndex: number
  hoveredRowIndex: number
  multiGrid?: typeof MultiGrid
}

const getColumnCount = (props: Props): number => {
  const {
    transformedDataBundle: {transformedData},
  } = props
  return get(transformedData, ['0', 'length'], 0)
}

const getFixFirstColumn = (props: Props): boolean => {
  const {
    transformedDataBundle: {resolvedRenamableFields},
    properties: {tableOptions},
  } = props

  const {fixFirstColumn = DEFAULT_FIX_FIRST_COLUMN} = tableOptions

  if (
    !Array.isArray(resolvedRenamableFields) ||
    resolvedRenamableFields.length === 1
  ) {
    return false
  }

  const visibleFields = resolvedRenamableFields.reduce((acc, f) => {
    if (f.visible) {
      acc += 1
    }
    return acc
  }, 0)

  if (visibleFields === 1) {
    return false
  }

  return fixFirstColumn
}

const getComputedColumnCount = (props: Props): number => {
  if (getFixFirstColumn(props)) {
    return getColumnCount(props) - 1
  }

  return getColumnCount(props)
}

const getTimeField = (props: Props) => {
  const {transformedDataBundle} = props
  let {resolvedRenamableFields} = transformedDataBundle

  if (!Array.isArray(resolvedRenamableFields)) {
    resolvedRenamableFields = []
  }

  return resolvedRenamableFields.find(
    f => f.internalName === DEFAULT_TIME_FIELD.internalName
  )
}

const isTimeVisible = (props: Props): boolean => {
  return get(getTimeField(props), 'visible', false)
}

const isVerticalTimeAxis = (props: Props): boolean => {
  const {
    properties: {tableOptions},
  } = props

  const {verticalTimeAxis = DEFAULT_VERTICAL_TIME_AXIS} = tableOptions
  return verticalTimeAxis
}

const handleMouseLeave = (props: Props, setState: Function): void => {
  const {onSetHoverTime} = props

  if (onSetHoverTime) {
    onSetHoverTime(0)
  }

  const newState: Partial<State> = {
    hoveredColumnIndex: NULL_ARRAY_INDEX,
    hoveredRowIndex: NULL_ARRAY_INDEX,
  }

  setState((prevState: State) => ({...prevState, ...newState}))
}

const getScrollToColRow = (
  props: Props,
  state: State
): {
  scrollToRow: number | null
  scrollToColumn: number | null
} => {
  const {
    transformedDataBundle: {sortedTimeVals},
    hoverTime,
  } = props
  const hoveringThisTable = state.hoveredColumnIndex !== NULL_ARRAY_INDEX

  if (!hoverTime || hoveringThisTable || !isTimeVisible(props)) {
    return {scrollToColumn: 0, scrollToRow: -1}
  }

  const hoverIndex = findHoverTimeIndex(sortedTimeVals, hoverTime)
  const scrollToColumn = isVerticalTimeAxis(props) ? -1 : hoverIndex
  const scrollToRow = isVerticalTimeAxis(props) ? hoverIndex : null
  return {
    scrollToRow,
    scrollToColumn,
  }
}

const handleHover = (
  e: React.MouseEvent<HTMLElement>,
  props: Props,
  setState: Function
) => {
  const {dataset} = e.target as HTMLElement
  const {onSetHoverTime} = props
  const {
    transformedDataBundle: {sortedTimeVals},
  } = props

  if (isVerticalTimeAxis(props) && +dataset.rowIndex === 0) {
    return
  }
  if (onSetHoverTime && isTimeVisible(props)) {
    const hoverTime = isVerticalTimeAxis(props)
      ? sortedTimeVals[dataset.rowIndex]
      : sortedTimeVals[dataset.columnIndex]

    onSetHoverTime(new Date(hoverTime).valueOf())
  }

  const newState: Partial<State> = {
    hoveredColumnIndex: +dataset.columnIndex,
    hoveredRowIndex: +dataset.rowIndex,
  }
  setState((prevState: State) => ({...prevState, ...newState}))
}

const getCellData = (
  props: Props,
  rowIndex: number,
  columnIndex: number
): string => {
  const {
    transformedDataBundle: {transformedData},
  } = props
  return transformedData[rowIndex][columnIndex]
}

const getDataType = (
  props: Props,
  rowIndex: number,
  columnIndex: number
): string => {
  const {
    transformedDataBundle: {transformedData},
    dataTypes,
  } = props

  if (rowIndex === 0) {
    return 'n/a'
  }

  const columnName = transformedData[0][columnIndex]

  return get(dataTypes, columnName, 'n/a')
}

const getTimeFormatter = (props: Props) => {
  const {
    timeZone,
    properties: {timeFormat},
  } = props

  return timeFormatter({
    timeZone: timeZone === 'Local' ? undefined : timeZone,
    format: resolveTimeFormat(timeFormat),
  })
}

const cellRenderer = (
  state: State,
  setState: Function,
  tgtProps: Props,
  cellProps: CellRendererProps
) => {
  const {rowIndex, columnIndex} = cellProps
  const {
    transformedDataBundle: {sortOptions, resolvedRenamableFields},
    onSort,
    properties,
  } = tgtProps
  const {scrollToRow} = getScrollToColRow(tgtProps, state)
  const hoverIndex = scrollToRow >= 0 ? scrollToRow : state.hoveredRowIndex
  const handleHoverCallback = (e: React.MouseEvent<HTMLElement>) =>
    handleHover(e, tgtProps, setState)

  return (
    <TableCell
      {...cellProps}
      sortOptions={sortOptions}
      onHover={handleHoverCallback}
      isTimeVisible={isTimeVisible(tgtProps)}
      data={getCellData(tgtProps, rowIndex, columnIndex)}
      dataType={getDataType(tgtProps, rowIndex, columnIndex)}
      hoveredRowIndex={hoverIndex}
      properties={properties}
      resolvedRenamableFields={resolvedRenamableFields}
      hoveredColumnIndex={state.hoveredColumnIndex}
      isFirstColumnFixed={getFixFirstColumn(tgtProps)}
      isVerticalTimeAxis={isVerticalTimeAxis(tgtProps)}
      onClickFieldName={onSort}
      timeFormatter={getTimeFormatter(tgtProps)}
    />
  )
}

const getTableWidth = (gridContainer: HTMLDivElement): number => {
  return gridContainer && gridContainer.clientWidth
    ? gridContainer.clientWidth
    : 0
}

const calculateColumnWidth = (
  state: State,
  props: Props,
  gridContainer: HTMLDivElement,
  columnSizerWidth: number
) => (column: {index: number}): number => {
  const {index} = column

  const {
    transformedDataBundle: {transformedData, columnWidths},
  } = props

  const {totalColumnWidths} = state
  const columnLabel = transformedData[0][index]

  const original = columnWidths[columnLabel] || 0

  if (getFixFirstColumn(props) && index === 0) {
    return original
  }

  if (getTableWidth(gridContainer) <= totalColumnWidths) {
    return original
  }

  if (getColumnCount(props) <= 1) {
    return columnSizerWidth
  }

  const difference = getTableWidth(gridContainer) - totalColumnWidths
  const increment = difference / getComputedColumnCount(props)

  return original + increment
}

const TableGraphTableComponent: FunctionComponent<Props> = (props: Props) => {
  const {
    transformedDataBundle: {transformedData},
    theme,
  } = props

  const multiGridRef = useRef<MultiGridInputHandles>(null)

  const [state, setState] = useState<State>({
    timeColumnWidth: 0,
    shouldResize: false,
    totalColumnWidths: 0,
    hoveredRowIndex: NULL_ARRAY_INDEX,
    hoveredColumnIndex: NULL_ARRAY_INDEX,
  })

  const [gridContainer, setGridContainer] = useState<HTMLDivElement>(null)

  useEffect(() => {
    if (state.shouldResize) {
      if (multiGridRef) {
        multiGridRef.current.recomputeGridSize()
      }
      setState((prevState: State) => ({...prevState, ...{shouldResize: false}}))
    }
  }, [state.shouldResize])

  const columnCount = getColumnCount(props)
  const fixFirstColumn = getFixFirstColumn(props)

  const rowCount = columnCount === 0 ? 0 : transformedData.length
  const fixedColumnCount = fixFirstColumn && columnCount > 1 ? 1 : 0
  const {scrollToColumn, scrollToRow} = getScrollToColRow(props, state)

  const handleMultiGridMount = ref => {
    multiGridRef.current = ref
    multiGridRef.current.forceUpdate()
  }

  const handleMouseLeaveCallback = () => handleMouseLeave(props, setState)
  const cellRendererCallback = cellProps =>
    cellRenderer(state, setState, props, cellProps)

  return (
    <div
      className={`${styles['time-machine-table']} ${
        theme === 'light' ? styles['time-machine-table__light-mode'] : ''
      }`}
      ref={el => setGridContainer(el)}
      onMouseLeave={handleMouseLeaveCallback}
    >
      {rowCount > 0 && (
        <AutoSizer>
          {({width, height}) => {
            return (
              <ColumnSizer
                columnCount={getComputedColumnCount(props)}
                columnMinWidth={COLUMN_MIN_WIDTH}
                width={width}
              >
                {({
                  adjustedWidth,
                  columnWidth,
                  registerChild,
                }: SizedColumnProps) => {
                  return (
                    <MultiGrid
                      height={height}
                      ref={registerChild}
                      rowCount={rowCount}
                      width={adjustedWidth}
                      rowHeight={ROW_HEIGHT}
                      scrollToRow={scrollToRow}
                      columnCount={columnCount}
                      scrollToColumn={scrollToColumn}
                      fixedColumnCount={fixedColumnCount}
                      cellRenderer={cellRendererCallback}
                      onMount={handleMultiGridMount}
                      classNameBottomRightGrid="table-graph--scroll-window"
                      columnWidth={calculateColumnWidth(
                        state,
                        props,
                        gridContainer,
                        columnWidth
                      )}
                    />
                  )
                }}
              </ColumnSizer>
            )
          }}
        </AutoSizer>
      )}
    </div>
  )
}

export const TableGraphTable = withHoverTime(TableGraphTableComponent)
