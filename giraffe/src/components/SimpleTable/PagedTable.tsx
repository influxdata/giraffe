import React, {
  FC,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {DapperScrollbars} from '../DapperScrollbars'
import {FluxDataType} from '../../index'
import {SubsetTable} from './SimpleTableGraph'
import {FluxResult, Column} from './flows'
import {PaginationContext} from './pagination'
import InnerTable from './InnerTable'

import styles from './SimpleTableGraph.scss'

interface ExtendedColumn {
  name: string
  type: 'number' | 'time' | 'boolean' | 'string'
  fluxDataType: FluxDataType
  group: boolean
  data: any[]
}

/*
 * @param result - the result of the query
 * @param paginationOffset - the start index of the first row of the current page
 * @param totalAvailableHeight - the total available height for the table
 * @param headerHeight - the height of the table header
 * @param rowHeight - the height of each row
 * @returns the number of rows that are on the given page (defined by the paginationOffset)
 * */
const getNumberOfRowsOnCurrentPage = (
  result: FluxResult['parsed'],
  paginationOffset: number,
  totalAvailableHeight: number,
  headerHeight: number,
  rowHeight: number
): number => {
  if (totalAvailableHeight <= 0) {
    return 0
  }

  // this means that no rows have been mounted or measured, so we need to
  // mount one row to measure the row height
  if (rowHeight <= 0) {
    return 1
  }

  let runningHeight = 14
  let rowIdx = paginationOffset
  let currentTable
  let lastSignature
  let signature

  // rowHeight is now guaranteed to be greater than zero
  const lastVisibleRowMinimumHeight = 0.2 * rowHeight

  while (rowIdx < result.table.length) {
    if (result.table.columns?.table?.data?.[rowIdx] !== currentTable) {
      signature = Object.values(result.table.columns)
        .map(
          c =>
            `${c.name}::${c.fluxDataType}::${result.fluxGroupKeyUnion.includes(
              c.name
            )}`
        )
        .join('|')

      if (signature !== lastSignature) {
        runningHeight += headerHeight

        if (currentTable !== undefined) {
          runningHeight += 10
        }

        if (
          runningHeight + lastVisibleRowMinimumHeight >=
          totalAvailableHeight
        ) {
          break
        }

        lastSignature = signature
      }

      currentTable = result.table.columns?.table?.data?.[rowIdx]

      continue
    }

    runningHeight += rowHeight

    if (runningHeight + lastVisibleRowMinimumHeight >= totalAvailableHeight) {
      break
    }

    rowIdx++
  }

  return Math.max(0, rowIdx - paginationOffset)
}

const subsetResult = (
  result: FluxResult['parsed'],
  paginationOffset: number,
  currentPageSize: number,
  disableFilter: boolean
): SubsetTable[] => {
  // only look at data within the page
  const subset = Object.values(result.table.columns)
    .map(
      (column: Column): ExtendedColumn => ({
        ...column,
        group: result.fluxGroupKeyUnion.includes(column.name),
        data: column.data.slice(
          paginationOffset,
          paginationOffset + currentPageSize
        ),
      })
    )
    .filter(column => !!column.data.filter(_c => _c !== undefined).length)
    .reduce((acc, curr) => {
      if (acc[curr.name]) {
        acc[curr.name].push(curr)
        return acc
      }
      acc[curr.name] = [curr]
      return acc
    }, {})

  const tables: SubsetTable[] = []
  let lastTable = ''

  // group by table id (series)
  for (let ni = 0; ni < currentPageSize; ni++) {
    if (
      `y${subset['result']?.[0]?.data?.[ni]}:t${subset['table']?.[0]?.data?.[ni]}` ===
      lastTable
    ) {
      continue
    }

    if (subset['result']?.[0]?.data?.[ni] && subset['table']?.[0]?.data?.[ni]) {
      lastTable = `y${subset['result'][0].data[ni]}:t${subset['table'][0].data[ni]}`
    }

    if (tables.length) {
      tables[tables.length - 1].end = ni
    }

    tables.push({
      idx: subset['table']?.[0]?.data?.[ni] ?? -1,
      yield: subset['result']?.[0]?.data?.[ni] ?? '',
      cols: [],
      signature: '',
      start: ni,
      end: -1,
    })
  }

  if (tables.length) {
    tables[tables.length - 1].end = currentPageSize
  }

  // reorder the column names, filter empty columns, join repeating tables under one header
  const cleanedTables = tables
    .reduce((acc, curr) => {
      curr.cols = [
        subset['table'],
        subset['_measurement'],
        subset['_field'],
        subset['_value'],
      ]
        .filter(c => !!c)
        .concat(
          Object.entries(subset)
            .filter(
              ([_name, _]) =>
                ![
                  'result',
                  'table',
                  '_measurement',
                  '_field',
                  '_value',
                ].includes(_name) &&
                (disableFilter || !['_start', '_stop'].includes(_name))
            )
            .sort((a: any, b: any) =>
              a[0].toLowerCase().localeCompare(b[0].toLowerCase())
            )
            .map(c => c[1])
        )
        .map(c =>
          c
            .map(_c => ({..._c, data: _c.data.slice(curr.start, curr.end)}))
            .filter(_c => !!_c.data.filter(_d => _d !== undefined).length)
        )
        .reduce((acc, curr) => {
          if (!curr.length) {
            return acc
          }
          acc[curr[0].name] = curr[0]
          return acc
        }, {})

      curr.signature = Object.values(curr.cols)
        .map(c => `${c.name}::${c.fluxDataType}::${c.group}`)
        .join('|')
      acc.push(curr)
      return acc
    }, [])
    .reduce((acc, curr) => {
      const last: SubsetTable = acc[acc.length - 1]

      if (
        !last ||
        curr.yield !== last.yield ||
        curr.signature !== last.signature
      ) {
        acc.push(curr)
        return acc
      }

      Object.values(last.cols).forEach(col => {
        last.cols[col.name] = {
          ...col,
          data: [...col.data, ...curr.cols[col.name].data],
        }
      })

      last.end = curr.end

      return acc
    }, [])

  return cleanedTables
}

interface Props {
  showAll: boolean
  result: FluxResult['parsed']
}

const INITIAL_HEADER_HEIGHT = 0
const INITIAL_HEIGHT = 0
const INITIAL_ROW_HEIGHT = 0
const PagedTable: FC<Props> = ({result, showAll}) => {
  const {
    paginationOffset,
    setNumberOfRowsOnCurrentPage,
    maxNumberOfRowsOnAnyPage,
    numberOfRowsOnCurrentPage,
    setMaxNumberOfRowsOnAnyPage,
    setCurrentPage,
    setTotalPages,
  } = useContext(PaginationContext)

  const [availableHeightForTable, setAvailableHeightForTable] = useState<
    number
  >(INITIAL_HEIGHT)

  const [tableHeaderHeight, setTableHeaderHeight] = useState<number>(
    INITIAL_HEADER_HEIGHT
  )
  const [tableRowHeight, setTableRowHeight] = useState<number>(
    INITIAL_ROW_HEIGHT
  )
  const ref = useRef<HTMLDivElement>()
  const pagedTableHeaderRef = useRef<HTMLTableSectionElement>()
  const pagedTableBodyRef = useRef<HTMLTableSectionElement>()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (
      pagedTableHeaderRef?.current?.clientHeight > 0 &&
      tableHeaderHeight === INITIAL_HEADER_HEIGHT
    ) {
      const calculatedHeaderHeight = pagedTableHeaderRef.current.clientHeight

      if (calculatedHeaderHeight !== tableHeaderHeight) {
        setTableHeaderHeight(calculatedHeaderHeight)
      }
    }
  })

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (
      pagedTableBodyRef?.current?.children?.[0]?.clientHeight > 0 &&
      tableRowHeight === INITIAL_ROW_HEIGHT
    ) {
      const calculatedRowHeight =
        pagedTableBodyRef.current.children[0].clientHeight

      if (calculatedRowHeight !== tableRowHeight) {
        setTableRowHeight(calculatedRowHeight)
      }
    }
  })

  // this makes sure that the table is always filling its parent container
  useEffect(() => {
    if (!ref || !ref.current) {
      return
    }

    let timeout
    let animationFrameID
    const resizer = new ResizeObserver(entries => {
      if (timeout) {
        clearTimeout(timeout)
      }

      timeout = setTimeout(() => {
        animationFrameID = requestAnimationFrame(() => {
          setAvailableHeightForTable(
            Math.min(entries[0].contentRect.height, window.screen.height)
          )
        })
      }, 200)
    })

    resizer.observe(ref.current)

    const curr = (ref?.current || {}) as any

    const rect = curr?.getBoundingClientRect()

    // only update the value if its unique
    if (rect && rect.height !== availableHeightForTable) {
      setAvailableHeightForTable(Math.min(rect.height, window.screen.height))
    }

    // cleanup
    return () => {
      resizer.disconnect()
      cancelAnimationFrame(animationFrameID)
      if (timeout) {
        clearTimeout(timeout)
      }
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const updatedNumberOfRowsOnCurrentPage = useMemo(() => {
    return getNumberOfRowsOnCurrentPage(
      result,
      paginationOffset,
      availableHeightForTable,
      tableHeaderHeight,
      tableRowHeight
    )
  }, [
    availableHeightForTable,
    paginationOffset,
    result,
    tableHeaderHeight,
    tableRowHeight,
  ])

  // Pagination stuff
  useEffect(() => {
    if (updatedNumberOfRowsOnCurrentPage !== numberOfRowsOnCurrentPage) {
      setNumberOfRowsOnCurrentPage(updatedNumberOfRowsOnCurrentPage)
    }
  }, [updatedNumberOfRowsOnCurrentPage]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    // The max number of rows that will ever be on a page will be the number of rows on the first page
    // hence the paginationOffset is 0
    const paginationOffsetForFirstPage = 0
    const maxNumberOfRowsOnPage = getNumberOfRowsOnCurrentPage(
      result,
      paginationOffsetForFirstPage,
      availableHeightForTable,
      tableHeaderHeight,
      tableRowHeight
    )
    setMaxNumberOfRowsOnAnyPage(maxNumberOfRowsOnPage)
  }, [availableHeightForTable, result, tableHeaderHeight, tableRowHeight]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setCurrentPage(1)
  }, [result]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (maxNumberOfRowsOnAnyPage) {
      setTotalPages(
        Math.ceil((result?.table?.length ?? 0) / maxNumberOfRowsOnAnyPage)
      )
    }
  }, [maxNumberOfRowsOnAnyPage, result]) // eslint-disable-line react-hooks/exhaustive-deps

  const tables = useMemo(
    () =>
      subsetResult(
        result,
        paginationOffset,
        numberOfRowsOnCurrentPage,
        showAll
      ),
    [numberOfRowsOnCurrentPage, paginationOffset, result, showAll]
  )

  const inner = useMemo(() => {
    if (numberOfRowsOnCurrentPage > 0) {
      return tables.map((table, index) => (
        <InnerTable
          table={table}
          key={`table${index}`}
          pagedTableRefs={{pagedTableHeaderRef, pagedTableBodyRef}}
        />
      ))
    }
    return null
  }, [numberOfRowsOnCurrentPage, tables])

  return (
    <div
      className={`${styles['visualization--simple-table--results']}`}
      ref={ref}
    >
      <DapperScrollbars
        className={`${styles['cf-dapper-scrollbars']}`}
        noScrollY
      >
        {inner}
      </DapperScrollbars>
    </div>
  )
}

export default PagedTable
