// Libraries
import React, {
  FunctionComponent,
  useState,
  CSSProperties,
  useEffect,
} from 'react'
import {Grid} from 'react-virtualized'

import {range} from '../utils/range'

import styles from './RawFluxDataGrid.scss'

export const ROW_HEIGHT = 27
const MIN_COLUMN_WIDTH = 150
const TIME_COLUMN_WIDTH = 300

interface Props {
  data: string[][]
  maxColumnCount: number
  width: number
  height: number
  scrollLeft: number
  scrollTop: number
}

interface State {
  headerRows: number[]
}

const getCellData = (data: string[][], row, column): string => {
  if (Array.isArray(data) && Array.isArray(data[row])) {
    return data[row][column]
  }
  return ''
}

const renderCell = (data: string[][], options) => {
  const {columnIndex, key, rowIndex, style} = options
  const datum = getCellData(data, rowIndex, columnIndex)

  return (
    <div
      key={key}
      style={style}
      className={styles['raw-flux-data-table--cell']}
      title={datum}
    >
      <div
        className={styles['raw-flux-data-table--cell-bg']}
        data-testid={`raw-flux-data-table--cell ${datum}`}
      >
        {datum}
      </div>
    </div>
  )
}

const getRowCount = (data: string[][]): number => {
  if (data && data.length) {
    return data.length
  }
  return 0
}

const getColumnWidth = (state, props, options): number => {
  const {index} = options
  const {maxColumnCount, width} = props

  const isDateTimeColumn = state.headerRows.find(i => {
    return (getCellData(props.data, i, index) || '').includes('dateTime')
  })

  if (!isDateTimeColumn) {
    return Math.max(MIN_COLUMN_WIDTH, width / maxColumnCount)
  }

  return TIME_COLUMN_WIDTH
}

const calculateWidth = (state: State, props: Props): number => {
  const {maxColumnCount} = props
  return range(0, maxColumnCount).reduce(
    (acc, index) => acc + getColumnWidth(state, props, {index}),
    0
  )
}

const getGridStyle = (state: State, props: Props): CSSProperties => {
  const width = calculateWidth(state, props)
  const height = ROW_HEIGHT * getRowCount(props.data)

  return {width, height}
}

export const RawFluxDataGrid: FunctionComponent<Props> = (props: Props) => {
  const {data, maxColumnCount, width, height, scrollTop, scrollLeft} = props

  const [state, setState] = useState<State>({headerRows: []})

  useEffect(() => {
    let headerRows = state.headerRows
    if (Array.isArray(data)) {
      headerRows = data.reduce((acc: Array<number>, row, index) => {
        if (row[0] === '#datatype') {
          acc.push(index)
        }

        return acc
      }, [])
    }
    setState(() => ({headerRows}))
  }, [])

  const renderCellCallback = options => renderCell(data, options)
  const getColumnWidthCallback = options =>
    getColumnWidth(state, props, options)

  return (
    <Grid
      width={width}
      height={height}
      cellRenderer={renderCellCallback}
      columnCount={maxColumnCount}
      rowCount={getRowCount(data)}
      rowHeight={ROW_HEIGHT}
      columnWidth={getColumnWidthCallback}
      scrollLeft={scrollLeft}
      scrollTop={scrollTop}
      style={getGridStyle(state, props)}
    />
  )
}
