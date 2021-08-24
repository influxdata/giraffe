import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react'
import {CellMeasurerCacheDecorator} from '../utils/CellMeasurerCacheDecorator'
import {Grid} from 'react-virtualized'
import {DapperScrollbars} from './DapperScrollbars'

import styles from './TableGraphs.scss'

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

    recomputeGridSize(state, props, {
      columnIndex,
      rowIndex,
    })
  }
}

const getBottomGridHeight = (state: State, props: PropsMultiGrid) => {
  const {height} = props

  const topGridHeight = state.topGridHeight

  return height - topGridHeight
}

const getRightGridWidth = (state: State, props: PropsMultiGrid) => {
  const {width} = props

  const leftGridWidth = state.leftGridWidth
  const result = width - leftGridWidth

  return result
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
  }
  return cellRenderer({
    ...rest,
    columnIndex: columnIndex + fixedColumnCount,
    parent,
  })
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
  }
  return cellRenderer({
    ...rest,
    parent,
    rowIndex: rowIndex + fixedRowCount,
  })
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
  props: PropsMultiGrid,
  topLeftGridRef
) => {
  const {fixedColumnCount, fixedRowCount} = props

  if (!fixedColumnCount || !fixedRowCount) {
    return null
  }

  const style = {
    ...state.topLeftGridStyle,
    ...props.styleTopLeftGrid,
  }

  return (
    <Grid
      {...props}
      className={styles[props.classNameTopLeftGrid]}
      columnCount={fixedColumnCount}
      height={state.topGridHeight}
      ref={topLeftGridRef}
      rowCount={fixedRowCount}
      style={{...style}}
      tabIndex={null}
      width={state.leftGridWidth}
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

  const width = getRightGridWidth(state, props)
  const height = state.topGridHeight

  const cellRendererTopRightGridCallback = args =>
    cellRendererTopRightGrid.call(null, props, topRightGridRef, args)
  const columnWidthRightGridCallback = args =>
    columnWidthRightGrid.call(null, state, props, args)
  const onScrollLeft = scrollInfo =>
    onScroll.call(null, setState, props, scrollInfo)

  const style = {
    ...state.topRightGridStyle,
    left: state.leftGridWidth,
    ...props.styleTopRightGrid,
  }
  return (
    <Grid
      {...props}
      cellRenderer={cellRendererTopRightGridCallback}
      className={styles[props.classNameTopRightGrid]}
      columnCount={Math.max(0, columnCount - fixedColumnCount)}
      columnWidth={columnWidthRightGridCallback}
      deferredMeasurementCache={state.deferredMeasurementCacheTopRightGrid}
      height={height}
      onScroll={enableFixedRowScroll ? onScrollLeft : undefined}
      ref={topRightGridRef}
      rowCount={fixedRowCount}
      scrollLeft={scrollLeft}
      style={{...style}}
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

  const width = state.leftGridWidth
  const height = getBottomGridHeight(state, props)

  const cellRendererBottomLeftGridCallback = args =>
    cellRendererBottomLeftGrid.call(null, props, bottomLeftGridRef, args)
  const onScrollCallback = scrollInfo =>
    onScroll.call(null, setState, props, scrollInfo)
  const rowHeightBottomGridCallback = args =>
    rowHeightBottomGrid.call(null, state, props, args)

  const style = {
    ...state.bottomLeftGridStyle,
    ...props.styleBottomLeftGrid,
  }
  return (
    <Grid
      {...props}
      cellRenderer={cellRendererBottomLeftGridCallback}
      className={styles[props.classNameBottomLeftGrid]}
      columnCount={fixedColumnCount}
      deferredMeasurementCache={state.deferredMeasurementCacheBottomLeftGrid}
      onScroll={onScrollCallback}
      height={height}
      ref={bottomLeftGridRef}
      rowCount={Math.max(0, rowCount - fixedRowCount)}
      rowHeight={rowHeightBottomGridCallback}
      style={{...style}}
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

  const width = getRightGridWidth(state, props)
  const height = getBottomGridHeight(state, props)

  const cellRendererBottomRightGridCallback = args =>
    cellRendererBottomRightGrid.call(null, props, bottomRightGridRef, args)
  const columnWidthRightGridCallback = args =>
    columnWidthRightGrid.call(null, state, props, args)
  const onScrollCallback = scrollInfo =>
    onScroll.call(null, setState, props, scrollInfo)
  const rowHeightBottomGridCallback = args =>
    rowHeightBottomGrid.call(null, state, props, args)

  const style = {
    ...state.bottomRightGridStyle,
    left: state.leftGridWidth,
    ...props.styleBottomRightGrid,
  }
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
        className={styles[props.classNameBottomRightGrid]}
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
          ...style,
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

const useForceUpdate = () => {
  const setValue = useState<number>(0)[1]
  return () => setValue(value => value + 1)
}
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
      onScroll,
      onSectionRendered,
      scrollToRow = -1,
      scrollToColumn = -1,
      ...rest
    } = props

    const restWithDefault = {
      classNameBottomLeftGrid: '',
      classNameBottomRightGrid: '',
      classNameTopLeftGrid: '',
      classNameTopRightGrid: '',
      enableFixedColumnScroll: false,
      enableFixedRowScroll: false,
      fixedColumnCount: 0,
      fixedRowCount: 0,
      scrollToColumn: -1,
      scrollToRow: -1,
      style: {},
      styleBottomLeftGrid: {},
      styleBottomRightGrid: {},
      styleTopLeftGrid: {},
      styleTopRightGrid: {},
      ...rest,
    }

    const {deferredMeasurementCache, fixedColumnCount, fixedRowCount} = props

    let cacheBottomLeftGrid = null
    if (deferredMeasurementCache) {
      cacheBottomLeftGrid = deferredMeasurementCache
      if (fixedRowCount > 0) {
        cacheBottomLeftGrid = new CellMeasurerCacheDecorator({
          cellMeasurerCache: deferredMeasurementCache,
          columnIndexOffset: 0,
          rowIndexOffset: fixedRowCount,
        })
      }
    }

    let cacheBottomRightGrid = null
    if (deferredMeasurementCache) {
      cacheBottomRightGrid = deferredMeasurementCache
      if (fixedColumnCount > 0 || fixedRowCount > 0) {
        cacheBottomRightGrid = new CellMeasurerCacheDecorator({
          cellMeasurerCache: deferredMeasurementCache,
          columnIndexOffset: fixedColumnCount,
          rowIndexOffset: fixedRowCount,
        })
      }
    }

    let cacheTopRightGrid = null
    if (deferredMeasurementCache) {
      cacheTopRightGrid = deferredMeasurementCache
      if (fixedColumnCount > 0) {
        cacheTopRightGrid = new CellMeasurerCacheDecorator({
          cellMeasurerCache: deferredMeasurementCache,
          columnIndexOffset: fixedColumnCount,
          rowIndexOffset: 0,
        })
      }
    }

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
      deferredMeasurementCacheBottomLeftGrid: cacheBottomLeftGrid,
      deferredMeasurementCacheBottomRightGrid: cacheBottomRightGrid,
      deferredMeasurementCacheTopRightGrid: cacheTopRightGrid,
      leftGridWidth: 0,
      topGridHeight: 0,
      lastRenderedColumnWidth: 0,
      lastRenderedFixedColumnCount: 0,
      lastRenderedFixedRowCount: 0,
      lastRenderedRowHeight: 0,
      bottomRightGridStyle: {
        position: 'absolute',
      },
      topRightGridStyle: {
        overflowX: 'hidden',
        overflowY: 'hidden',
        position: 'absolute',
        top: 0,
      },
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
      bottomLeftGridStyle: {
        left: 0,
        overflowY: 'hidden',
        overflowX: 'hidden',
        position: 'absolute',
      },
      topLeftGridStyle: {
        left: 0,
        overflowX: 'hidden',
        overflowY: 'hidden',
        position: 'absolute',
        top: 0,
      },
    })

    useImperativeHandle(ref, () => {
      return {
        recomputeGridSize: () => recomputeGridSize(state, props),
        forceUpdate: useForceUpdate,
      }
    })

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
    }, [])

    const topLeftGridRef = useRef(null)
    const topRightGridRef = useRef(null)
    const bottomLeftGridRef = useRef(null)
    const bottomRightGridRef = useRef(null)

    // Don't render any of our Grids if there are no cells.
    // This mirrors what Grid does,
    // And prevents us from recording inaccurage measurements when used with CellMeasurer.
    if (props.width === 0 || props.height === 0) {
      return null
    }

    const {scrollLeft, scrollTop} = state

    return (
      <div style={state.containerOuterStyle}>
        <div style={state.containerTopStyle}>
          {renderTopLeftGrid(
            state,
            restWithDefault as PropsMultiGrid,
            topLeftGridRef
          )}
          {renderTopRightGrid(
            state,
            setState,
            {
              ...restWithDefault,
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
              ...restWithDefault,
              onScroll,
              scrollTop,
            } as PropsMultiGrid,
            bottomLeftGridRef
          )}
          {renderBottomRightGrid(
            state,
            setState,
            {
              ...restWithDefault,
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
