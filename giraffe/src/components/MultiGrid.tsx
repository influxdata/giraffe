import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react'
import {CellMeasurerCacheDecorator} from '../utils/CellMeasurerCacheDecorator'
import {Grid} from 'react-virtualized'
import {DapperScrollbars} from '@influxdata/clockface'

const SCROLLBAR_SIZE_BUFFER = 20
type HeightWidthFunction = (arg: {index: number}) => number

export interface PropsMultiGrid {
  width: number
  height: number
  columnCount?: number
  classNameBottomLeftGrid?: string
  classNameBottomRightGrid?: string
  classNameTopLeftGrid?: string
  classNameTopRightGrid?: string
  enableFixedColumnScroll?: boolean
  enableFixedRowScroll?: boolean
  fixedColumnCount?: number
  fixedRowCount?: number
  style?: object
  styleBottomLeftGrid?: object
  styleBottomRightGrid?: object
  styleTopLeftGrid?: object
  styleTopRightGrid?: object
  scrollTop?: number
  scrollLeft?: number
  rowCount?: number
  rowHeight?: number | HeightWidthFunction
  columnWidth?: number | HeightWidthFunction
  onScroll?: (arg: object) => {}
  onSectionRendered?: () => {}
  cellRenderer?: (arg: object) => JSX.Element
  [key: string]: any // MultiGrid can accept any prop, and will rerender if they change
}

interface State {
  scrollLeft: number
  scrollTop: number
  scrollbarSize: number
  showHorizontalScrollbar: boolean
  showVerticalScrollbar: boolean
  // privates
  deferredInvalidateColumnIndex: number
  deferredInvalidateRowIndex: number
  bottomLeftGrid: Grid
  bottomRightGrid: Grid
  topLeftGrid: Grid
  topRightGrid: Grid
  deferredMeasurementCacheBottomLeftGrid: CellMeasurerCacheDecorator
  deferredMeasurementCacheBottomRightGrid: CellMeasurerCacheDecorator
  deferredMeasurementCacheTopRightGrid: CellMeasurerCacheDecorator
  leftGridWidth: number | null
  topGridHeight: number | null
  lastRenderedColumnWidth: number | HeightWidthFunction
  lastRenderedFixedColumnCount: number
  lastRenderedFixedRowCount: number
  lastRenderedRowHeight: number | HeightWidthFunction
  bottomRightGridStyle: object | null
  topRightGridStyle: object | null
  lastRenderedStyle: object | null
  lastRenderedHeight: number
  lastRenderedWidth: number
  containerTopStyle: object | null
  containerBottomStyle: object | null
  containerOuterStyle: object | null
  lastRenderedStyleBottomLeftGrid: object | null
  lastRenderedStyleBottomRightGrid: object | null
  lastRenderedStyleTopLeftGrid: object | null
  lastRenderedStyleTopRightGrid: object | null
  bottomLeftGridStyle: object | null
  topLeftGridStyle: object | null
}

const recomputeGridSize = (
  state: State,
  setState: Function,
  props: PropsMultiGrid,
  {columnIndex = 0, rowIndex = 0} = {}
) => {
  const {fixedColumnCount, fixedRowCount} = props
  const {bottomLeftGrid, bottomRightGrid, topLeftGrid, topRightGrid} = state

  const adjustedColumnIndex = Math.max(0, columnIndex - fixedColumnCount)
  const adjustedRowIndex = Math.max(0, rowIndex - fixedRowCount)

  if (bottomLeftGrid) {
    bottomLeftGrid.recomputeGridSize({
      columnIndex,
      rowIndex: adjustedRowIndex,
    })
  }
  if (bottomRightGrid) {
    bottomRightGrid.recomputeGridSize({
      columnIndex: adjustedColumnIndex,
      rowIndex: adjustedRowIndex,
    })
  }

  if (topLeftGrid) {
    topLeftGrid.recomputeGridSize({
      columnIndex,
      rowIndex,
    })
  }

  if (topRightGrid) {
    topRightGrid.recomputeGridSize({
      columnIndex: adjustedColumnIndex,
      rowIndex,
    })
  }

  const newState: Partial<State> = {
    leftGridWidth: null,
    topGridHeight: null,
  }
  setState((prevState: State) => ({...prevState, ...newState}))
  maybeCalculateCachedStyles(state, setState, props, true)
}

const handleInvalidatedGridSize = (
  state: State,
  setState: Function,
  props: PropsMultiGrid
) => {
  const {deferredInvalidateColumnIndex, deferredInvalidateRowIndex} = state
  if (typeof deferredInvalidateColumnIndex === 'number') {
    const columnIndex = deferredInvalidateColumnIndex
    const rowIndex = deferredInvalidateRowIndex

    const newState: Partial<State> = {
      deferredInvalidateColumnIndex: null,
      deferredInvalidateRowIndex: null,
    }
    setState((prevState: State) => ({...prevState, ...newState}))

    recomputeGridSize(state, setState, props, {
      columnIndex,
      rowIndex,
    })

    useForceUpdate()
  }
}

const prepareForRender = (
  state: State,
  setState: Function,
  props: PropsMultiGrid
) => {
  const {
    lastRenderedColumnWidth,
    lastRenderedFixedColumnCount,
    lastRenderedFixedRowCount,
    lastRenderedRowHeight,
  } = state
  const newState: Partial<State> = {}
  if (
    lastRenderedColumnWidth !== props.columnWidth ||
    lastRenderedFixedColumnCount !== props.fixedColumnCount
  ) {
    newState.leftGridWidth = null
  }

  if (
    lastRenderedFixedRowCount !== props.fixedRowCount ||
    lastRenderedRowHeight !== props.rowHeight
  ) {
    newState.topGridHeight = null
  }

  maybeCalculateCachedStyles(state, setState, props, false)

  newState.lastRenderedColumnWidth = props.columnWidth
  newState.lastRenderedFixedColumnCount = props.fixedColumnCount
  newState.lastRenderedFixedRowCount = props.fixedRowCount
  newState.lastRenderedRowHeight = props.rowHeight

  setState((prevState: State) => ({...prevState, ...newState}))
}

const getTopGridHeight = (
  state: State,
  setState: Function,
  props: PropsMultiGrid
) => {
  const {fixedRowCount, rowHeight} = props
  const newState: Partial<State> = {}

  if (state.topGridHeight == null) {
    if (typeof rowHeight === 'function') {
      let topGridHeight = 0

      for (let index = 0; index < fixedRowCount; index++) {
        topGridHeight += rowHeight({index})
      }

      newState.topGridHeight = topGridHeight
    } else {
      newState.topGridHeight = rowHeight * fixedRowCount
    }
  }

  setState((prevState: State) => ({...prevState, ...newState}))

  return newState.topGridHeight
}

const getBottomGridHeight = (
  state: State,
  setState: Function,
  props: PropsMultiGrid
) => {
  const {height} = props

  const topGridHeight = getTopGridHeight(state, setState, props)

  return height - topGridHeight
}

const getLeftGridWidth = (
  state: State,
  setState: Function,
  props: PropsMultiGrid
) => {
  const {fixedColumnCount, columnWidth} = props
  const newState: Partial<State> = {}

  if (state.leftGridWidth == null) {
    if (typeof columnWidth === 'function') {
      let leftGridWidth = 0

      for (let index = 0; index < fixedColumnCount; index++) {
        leftGridWidth += columnWidth({index})
      }

      newState.leftGridWidth = leftGridWidth
    } else {
      newState.leftGridWidth = columnWidth * fixedColumnCount
    }
  }
  setState((prevState: State) => ({...prevState, ...newState}))
  return newState.leftGridWidth
}

const getRightGridWidth = (
  state: State,
  setState: Function,
  props: PropsMultiGrid
) => {
  const {width} = props

  const leftGridWidth = getLeftGridWidth(state, setState, props)
  const result = width - leftGridWidth

  return result
}

/**
 * Avoid recreating inline styles each render; this bypasses Grid's shallowCompare.
 * This method recalculates styles only when specific props change.
 */
const maybeCalculateCachedStyles = (
  state: State,
  setState: Function,
  props: PropsMultiGrid,
  resetAll: boolean
) => {
  const {
    columnWidth,
    height,
    fixedColumnCount,
    fixedRowCount,
    rowHeight,
    style,
    styleBottomLeftGrid,
    styleBottomRightGrid,
    styleTopLeftGrid,
    styleTopRightGrid,
    width,
  } = props

  const newState: Partial<State> = {}

  const sizeChange =
    resetAll ||
    height !== state.lastRenderedHeight ||
    width !== state.lastRenderedWidth
  const leftSizeChange =
    resetAll ||
    columnWidth !== state.lastRenderedColumnWidth ||
    fixedColumnCount !== state.lastRenderedFixedColumnCount
  const topSizeChange =
    resetAll ||
    fixedRowCount !== state.lastRenderedFixedRowCount ||
    rowHeight !== state.lastRenderedRowHeight

  if (resetAll || sizeChange || style !== state.lastRenderedStyle) {
    newState.containerOuterStyle = {
      height,
      overflow: 'visible', // Let :focus outline show through
      width,
      ...style,
    }
  }

  if (resetAll || sizeChange || topSizeChange) {
    newState.containerTopStyle = {
      height: getTopGridHeight(state, setState, props),
      position: 'relative',
      width,
    }

    newState.containerBottomStyle = {
      height: height - getTopGridHeight(state, setState, props),
      overflow: 'visible', // Let :focus outline show through
      position: 'relative',
      width,
    }
  }

  if (
    resetAll ||
    styleBottomLeftGrid !== state.lastRenderedStyleBottomLeftGrid
  ) {
    newState.bottomLeftGridStyle = {
      left: 0,
      overflowY: 'hidden',
      overflowX: 'hidden',
      position: 'absolute',
      ...styleBottomLeftGrid,
    }
  }

  if (
    resetAll ||
    leftSizeChange ||
    styleBottomRightGrid !== state.lastRenderedStyleBottomRightGrid
  ) {
    newState.bottomRightGridStyle = {
      left: getLeftGridWidth(state, setState, props),
      position: 'absolute',
      ...styleBottomRightGrid,
    }
  }

  if (resetAll || styleTopLeftGrid !== state.lastRenderedStyleTopLeftGrid) {
    newState.topLeftGridStyle = {
      left: 0,
      overflowX: 'hidden',
      overflowY: 'hidden',
      position: 'absolute',
      top: 0,
      ...styleTopLeftGrid,
    }
  }

  if (
    resetAll ||
    leftSizeChange ||
    styleTopRightGrid !== state.lastRenderedStyleTopRightGrid
  ) {
    newState.topRightGridStyle = {
      left: getLeftGridWidth(state, setState, props),
      overflowX: 'hidden',
      overflowY: 'hidden',
      position: 'absolute',
      top: 0,
      ...styleTopRightGrid,
    }
  }

  newState.lastRenderedColumnWidth = columnWidth
  newState.lastRenderedFixedColumnCount = fixedColumnCount
  newState.lastRenderedFixedRowCount = fixedRowCount
  newState.lastRenderedHeight = height
  newState.lastRenderedRowHeight = rowHeight
  newState.lastRenderedStyle = style
  newState.lastRenderedStyleBottomLeftGrid = styleBottomLeftGrid
  newState.lastRenderedStyleBottomRightGrid = styleBottomRightGrid
  newState.lastRenderedStyleTopLeftGrid = styleTopLeftGrid
  newState.lastRenderedStyleTopRightGrid = styleTopRightGrid
  newState.lastRenderedWidth = width

  setState((prevState: State) => ({...prevState, ...newState}))
}

const cellRendererTopRightGrid = (
  props: PropsMultiGrid,
  parent,
  {columnIndex, ...rest}
) => {
  const {cellRenderer, columnCount, fixedColumnCount} = props

  if (columnIndex === columnCount - fixedColumnCount) {
    return (
      <div
        key={rest.key}
        style={{
          ...rest.style,
          width: SCROLLBAR_SIZE_BUFFER,
        }}
      />
    )
  } else {
    return cellRenderer({
      ...rest,
      columnIndex: columnIndex + fixedColumnCount,
      parent,
    })
  }
}

const cellRendererBottomLeftGrid = (
  props: PropsMultiGrid,
  parent,
  {rowIndex, ...rest}
) => {
  const {cellRenderer, fixedRowCount, rowCount} = props

  if (rowIndex === rowCount - fixedRowCount) {
    return (
      <div
        key={rest.key}
        style={{
          ...rest.style,
          height: SCROLLBAR_SIZE_BUFFER,
        }}
      />
    )
  } else {
    return cellRenderer({
      ...rest,
      parent,
      rowIndex: rowIndex + fixedRowCount,
    })
  }
}

const cellRendererBottomRightGrid = (
  props: PropsMultiGrid,
  parent,
  {columnIndex, rowIndex, ...rest}
) => {
  const {cellRenderer, fixedColumnCount, fixedRowCount} = props

  return cellRenderer({
    ...rest,
    columnIndex: columnIndex + fixedColumnCount,
    parent,
    rowIndex: rowIndex + fixedRowCount,
  })
}

const columnWidthRightGrid = (state: State, props: PropsMultiGrid, {index}) => {
  const {columnCount, fixedColumnCount, columnWidth} = props
  const {scrollbarSize, showHorizontalScrollbar} = state

  // An extra cell is added to the count
  // This gives the smaller Grid extra room for offset,
  // In case the main (bottom right) Grid has a scrollbar
  // If no scrollbar, the extra space is overflow:hidden anyway
  if (showHorizontalScrollbar && index === columnCount - fixedColumnCount) {
    return scrollbarSize
  }

  return typeof columnWidth === 'function'
    ? columnWidth({index: index + fixedColumnCount})
    : columnWidth
}

const rowHeightBottomGrid = (state: State, props: PropsMultiGrid, {index}) => {
  const {fixedRowCount, rowCount, rowHeight} = props
  const {scrollbarSize, showVerticalScrollbar} = state

  // An extra cell is added to the count
  // This gives the smaller Grid extra room for offset,
  // In case the main (bottom right) Grid has a scrollbar
  // If no scrollbar, the extra space is overflow:hidden anyway
  if (showVerticalScrollbar && index === rowCount - fixedRowCount) {
    return scrollbarSize
  }

  return typeof rowHeight === 'function'
    ? rowHeight({index: index + fixedRowCount})
    : rowHeight
}

const onScroll = (setState: Function, props: PropsMultiGrid, scrollInfo) => {
  const {scrollLeft, scrollTop} = scrollInfo
  setState((prevState: State) => ({
    ...prevState,
    ...{
      scrollLeft,
      scrollTop,
    },
  }))

  const {onScroll} = props
  if (onScroll) {
    onScroll(scrollInfo)
  }
}

const renderTopLeftGrid = (
  state: State,
  setState: Function,
  props: PropsMultiGrid,
  topLeftGridRef
) => {
  const {fixedColumnCount, fixedRowCount} = props

  if (!fixedColumnCount || !fixedRowCount) {
    return null
  }

  return (
    <Grid
      {...props}
      className={props.classNameTopLeftGrid}
      columnCount={fixedColumnCount}
      height={getTopGridHeight(state, setState, props)}
      ref={topLeftGridRef}
      rowCount={fixedRowCount}
      style={state.topLeftGridStyle}
      tabIndex={null}
      width={getLeftGridWidth(state, setState, props)}
    />
  )
}

const renderTopRightGrid = (
  state: State,
  setState: Function,
  props: PropsMultiGrid,
  topRightGridRef
) => {
  const {
    columnCount,
    enableFixedRowScroll,
    fixedColumnCount,
    fixedRowCount,
    scrollLeft,
  } = props

  if (!fixedRowCount) {
    return null
  }

  const width = getRightGridWidth(state, setState, props)
  const height = getTopGridHeight(state, setState, props)

  const cellRendererTopRightGridCallback = args =>
    cellRendererTopRightGrid.call(null, props, topRightGridRef, args)
  const columnWidthRightGridCallback = args =>
    columnWidthRightGrid.call(null, state, props, args)
  const onScrollLeft = scrollInfo =>
    onScroll.call(null, setState, props, scrollInfo)

  return (
    <Grid
      {...props}
      cellRenderer={cellRendererTopRightGridCallback}
      className={props.classNameTopRightGrid}
      columnCount={Math.max(0, columnCount - fixedColumnCount)}
      columnWidth={columnWidthRightGridCallback}
      deferredMeasurementCache={state.deferredMeasurementCacheTopRightGrid}
      height={height}
      onScroll={enableFixedRowScroll ? onScrollLeft : undefined}
      ref={topRightGridRef}
      rowCount={fixedRowCount}
      scrollLeft={scrollLeft}
      style={state.topRightGridStyle}
      tabIndex={null}
      width={width}
    />
  )
}

const renderBottomLeftGrid = (
  state: State,
  setState: Function,
  props: PropsMultiGrid,
  bottomLeftGridRef
) => {
  const {fixedColumnCount, fixedRowCount, rowCount} = props

  if (!fixedColumnCount) {
    return null
  }

  const width = getLeftGridWidth(state, setState, props)
  const height = getBottomGridHeight(state, setState, props)

  const cellRendererBottomLeftGridCallback = args =>
    cellRendererBottomLeftGrid.call(null, props, bottomLeftGridRef, args)
  const onScrollCallback = scrollInfo =>
    onScroll.call(null, setState, props, scrollInfo)
  const rowHeightBottomGridCallback = args =>
    rowHeightBottomGrid.call(null, state, props, args)

  return (
    <Grid
      {...props}
      cellRenderer={cellRendererBottomLeftGridCallback}
      className={props.classNameBottomLeftGrid}
      columnCount={fixedColumnCount}
      deferredMeasurementCache={state.deferredMeasurementCacheBottomLeftGrid}
      onScroll={onScrollCallback}
      height={height}
      ref={bottomLeftGridRef}
      rowCount={Math.max(0, rowCount - fixedRowCount)}
      rowHeight={rowHeightBottomGridCallback}
      style={{
        ...state.bottomLeftGridStyle,
      }}
      tabIndex={null}
      width={width}
    />
  )
}

const renderBottomRightGrid = (
  state: State,
  setState: Function,
  props,
  bottomRightGridRef
) => {
  const {
    columnCount,
    fixedColumnCount,
    fixedRowCount,
    rowCount,
    scrollToColumn,
    scrollToRow,
  } = props

  const width = getRightGridWidth(state, setState, props)
  const height = getBottomGridHeight(state, setState, props)

  const cellRendererBottomRightGridCallback = args =>
    cellRendererBottomRightGrid.call(null, props, bottomRightGridRef, args)
  const columnWidthRightGridCallback = args =>
    columnWidthRightGrid.call(null, state, props, args)
  const onScrollCallback = scrollInfo =>
    onScroll.call(null, setState, props, scrollInfo)
  const rowHeightBottomGridCallback = args =>
    rowHeightBottomGrid.call(null, state, props, args)

  return (
    <DapperScrollbars
      style={{...state.bottomRightGridStyle, width, height}}
      autoHide={true}
      scrollTop={state.scrollTop}
      scrollLeft={state.scrollLeft}
      onScroll={onScrollCallback}
    >
      <Grid
        {...props}
        cellRenderer={cellRendererBottomRightGridCallback}
        className={props.classNameBottomRightGrid}
        columnCount={Math.max(0, columnCount - fixedColumnCount)}
        columnWidth={columnWidthRightGridCallback}
        deferredMeasurementCache={state.deferredMeasurementCacheBottomRightGrid}
        height={height}
        ref={bottomRightGridRef}
        rowCount={Math.max(0, rowCount - fixedRowCount)}
        rowHeight={rowHeightBottomGridCallback}
        onScroll={onScrollCallback}
        scrollToColumn={scrollToColumn - fixedColumnCount}
        scrollToRow={scrollToRow - fixedRowCount}
        style={{
          ...state.bottomRightGridStyle,
          overflowX: false,
          overflowY: true,
          left: 0,
        }}
        width={width}
      />
    </DapperScrollbars>
  )
}

export interface MultiGridInputHandles {
  recomputeGridSize(): void
  forceUpdate(): void
}

const useForceUpdate = () => useState()[1]
/**
 * Renders 1, 2, or 4 Grids depending on configuration.
 * A main (body) Grid will always be rendered.
 * Optionally, 1-2 Grids for sticky header rows will also be rendered.
 * If no sticky columns, only 1 sticky header Grid will be rendered.
 * If sticky columns, 2 sticky header Grids will be rendered.
 */

export const MultiGrid = forwardRef<MultiGridInputHandles, PropsMultiGrid>(
  (props: PropsMultiGrid, ref) => {
    const {
      width,
      height,
      onScroll,
      onSectionRendered,
      scrollToRow = -1,
      scrollToColumn = -1,
      ...rest
    } = props

    //   public static defaultProps = {
    //     fixedColumnCount: 0,
    //     fixedRowCount: 0,
    //     style: {},
    //     styleBottomLeftGrid: {},
    //     styleBottomRightGrid: {},
    //     styleTopLeftGrid: {},
    //     styleTopRightGrid: {},
    //   }

    const {deferredMeasurementCache, fixedColumnCount, fixedRowCount} = props

    const [state, setState] = useState<State>({
      scrollLeft: 0,
      scrollTop: 0,
      scrollbarSize: 0,
      showHorizontalScrollbar: false,
      showVerticalScrollbar: false,
      deferredInvalidateColumnIndex: 0,
      deferredInvalidateRowIndex: 0,
      bottomLeftGrid: null,
      bottomRightGrid: null,
      topLeftGrid: null,
      topRightGrid: null,
      deferredMeasurementCacheBottomLeftGrid: deferredMeasurementCache
        ? fixedRowCount > 0
          ? new CellMeasurerCacheDecorator({
              cellMeasurerCache: deferredMeasurementCache,
              columnIndexOffset: 0,
              rowIndexOffset: fixedRowCount,
            })
          : deferredMeasurementCache
        : null,
      deferredMeasurementCacheBottomRightGrid: deferredMeasurementCache
        ? fixedColumnCount > 0 || fixedRowCount > 0
          ? new CellMeasurerCacheDecorator({
              cellMeasurerCache: deferredMeasurementCache,
              columnIndexOffset: fixedColumnCount,
              rowIndexOffset: fixedRowCount,
            })
          : deferredMeasurementCache
        : null,
      deferredMeasurementCacheTopRightGrid: deferredMeasurementCache
        ? fixedColumnCount > 0
          ? new CellMeasurerCacheDecorator({
              cellMeasurerCache: deferredMeasurementCache,
              columnIndexOffset: fixedColumnCount,
              rowIndexOffset: 0,
            })
          : deferredMeasurementCache
        : null,
      leftGridWidth: 0,
      topGridHeight: 0,
      lastRenderedColumnWidth: 0,
      lastRenderedFixedColumnCount: 0,
      lastRenderedFixedRowCount: 0,
      lastRenderedRowHeight: 0,
      bottomRightGridStyle: null,
      topRightGridStyle: null,
      lastRenderedStyle: null,
      lastRenderedHeight: 0,
      lastRenderedWidth: 0,
      containerTopStyle: null,
      containerBottomStyle: null,
      containerOuterStyle: null,
      lastRenderedStyleBottomLeftGrid: null,
      lastRenderedStyleBottomRightGrid: null,
      lastRenderedStyleTopLeftGrid: null,
      lastRenderedStyleTopRightGrid: null,
      bottomLeftGridStyle: null,
      topLeftGridStyle: null,
    })

    useImperativeHandle(ref, () => ({
      recomputeGridSize: () => recomputeGridSize(state, setState, props),
      forceUpdate: () => useForceUpdate(),
    }))

    maybeCalculateCachedStyles(state, setState, props, true)

    useEffect(() => {
      const {scrollLeft, scrollTop} = props

      if (scrollLeft > 0 || scrollTop > 0) {
        const newState: Partial<State> = {}

        if (scrollLeft > 0) {
          newState.scrollLeft = scrollLeft
        }

        if (scrollTop > 0) {
          newState.scrollTop = scrollTop
        }

        setState(state => ({...state, ...newState}))
      }
      handleInvalidatedGridSize(state, setState, props)
    }, [props.scrollLeft, props.scrollTop])

    const topLeftGridRef = useRef(null)
    const topRightGridRef = useRef(null)
    const bottomLeftGridRef = useRef(null)
    const bottomRightGridRef = useRef(null)

    prepareForRender(state, setState, props)

    // Don't render any of our Grids if there are no cells.
    // This mirrors what Grid does,
    // And prevents us from recording inaccurage measurements when used with CellMeasurer.
    if (width === 0 || height === 0) {
      return null
    }

    const {scrollLeft, scrollTop} = state

    if (
      props.scrollLeft !== state.scrollLeft ||
      props.scrollTop !== state.scrollTop
    ) {
      const newState: Partial<State> = {
        scrollLeft:
          props.scrollLeft != null && props.scrollLeft >= 0
            ? props.scrollLeft
            : state.scrollLeft,
        scrollTop:
          props.scrollTop != null && props.scrollTop >= 0
            ? props.scrollTop
            : state.scrollTop,
      }
      setState((prevState: State) => ({...prevState, ...newState}))
    }

    return (
      <div style={state.containerOuterStyle}>
        <div style={state.containerTopStyle}>
          {renderTopLeftGrid(
            state,
            setState,
            rest as PropsMultiGrid,
            topLeftGridRef
          )}
          {renderTopRightGrid(
            state,
            setState,
            {
              ...rest,
              ...onScroll,
              scrollLeft,
            } as PropsMultiGrid,
            topRightGridRef
          )}
        </div>
        <div style={state.containerBottomStyle}>
          {renderBottomLeftGrid(
            state,
            setState,
            {
              ...rest,
              onScroll,
              scrollTop,
            } as PropsMultiGrid,
            bottomLeftGridRef
          )}
          {renderBottomRightGrid(
            state,
            setState,
            {
              ...rest,
              onScroll,
              onSectionRendered,
              scrollLeft,
              scrollTop,
              scrollToColumn,
              scrollToRow,
            },
            bottomRightGridRef
          )}
        </div>
      </div>
    )
  }
)

// class MultiGrid extends React.PureComponent<PropsMultiGrid, State> {

//   /** See Grid#invalidateCellSizeAfterRender */
//   public invalidateCellSizeAfterRender({columnIndex = 0, rowIndex = 0} = {}) {
//     this.deferredInvalidateColumnIndex =
//       typeof this.deferredInvalidateColumnIndex === 'number'
//         ? Math.min(this.deferredInvalidateColumnIndex, columnIndex)
//         : columnIndex
//     this.deferredInvalidateRowIndex =
//       typeof this.deferredInvalidateRowIndex === 'number'
//         ? Math.min(this.deferredInvalidateRowIndex, rowIndex)
//         : rowIndex
//   }

//   /** See Grid#measureAllCells */
//   public measureAllCells() {
//     if (this.bottomLeftGrid) {
//       this.bottomLeftGrid.measureAllCells()
//     }
//     if (this.bottomRightGrid) {
//       this.bottomRightGrid.measureAllCells()
//     }
//     if (this.topLeftGrid) {
//       this.topLeftGrid.measureAllCells()
//     }
//     if (this.topRightGrid) {
//       this.topRightGrid.measureAllCells()
//     }
//   }

// }
