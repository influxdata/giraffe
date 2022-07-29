import React, {
  FC,
  useContext,
  useMemo,
  useRef,
  useEffect,
  useState,
} from 'react'
import {DapperScrollbars} from '../DapperScrollbars'
import {FluxDataType} from '../../index'
import {SubsetTable, SimpleTableViewProperties} from '../SimpleTableGraph'
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

const measurePage = (
  result: FluxResult['parsed'],
  offset: number,
  height: number,
  headerHeight: number,
  rowHeight: number
): number => {
  if (height === 0) {
    return 0
  }

  let runningHeight = 14
  let rowIdx = offset
  let currentTable
  let lastSignature
  let signature

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

        if (runningHeight >= height) {
          break
        }

        lastSignature = signature
      }

      currentTable = result.table.columns?.table?.data?.[rowIdx]

      continue
    }

    runningHeight += rowHeight

    if (runningHeight + 0.25 * rowHeight >= height) {
      break
    }

    rowIdx++
  }

  return Math.max(0, rowIdx - offset)
}

const subsetResult = (
  result: FluxResult['parsed'],
  offset: number,
  size: number,
  disableFilter: boolean
): SubsetTable[] => {
  // only look at data within the page
  const subset = Object.values(result.table.columns)
    .map(
      (c: Column): ExtendedColumn => ({
        ...c,
        group: result.fluxGroupKeyUnion.includes(c.name),
        data: c.data.slice(offset, offset + size),
      })
    )
    .filter(c => !!c.data.filter(_c => _c !== undefined).length)
    .reduce((arr, curr) => {
      if (arr[curr.name]) {
        arr[curr.name].push(curr)
        return arr
      }
      arr[curr.name] = [curr]
      return arr
    }, {})

  const tables: SubsetTable[] = []
  let lastTable = ''

  // group by table id (series)
  for (let ni = 0; ni < size; ni++) {
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
    tables[tables.length - 1].end = size
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
  properties: SimpleTableViewProperties
  result: FluxResult['parsed']
}

const pagedTableHeaderId = 'pagedTableRowId'
const pagedTableBodyId = 'pagedTabledBodyId'

const PagedTable: FC<Props> = ({result, properties}) => {
  const {
    offset,
    setSize,
    maxSize,
    setMaxSize,
    setPage,
    setTotalPages,
  } = useContext(PaginationContext)
  const [height, setHeight] = useState(0)
  const [headerHeight, setHeaderHeight] = useState(0)
  const [rowHeight, setRowHeight] = useState(0)
  const ref = useRef()

  if (headerHeight === 0) {
    const calculatedHeaderHeight =
      document.querySelector<HTMLElement>(`#${pagedTableHeaderId}`)
        ?.offsetHeight ?? 0

    if (calculatedHeaderHeight !== headerHeight) {
      setHeaderHeight(calculatedHeaderHeight)
    }
  }

  if (rowHeight === 0) {
    const calculatedRowHeight =
      document.querySelector<HTMLElement>(`#${pagedTableBodyId} > tr`)
        ?.offsetHeight ?? 0

    if (calculatedRowHeight !== rowHeight) {
      setRowHeight(calculatedRowHeight)
    }
  }

  // this makes sure that the table is always filling it's parent container
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
          setHeight(entries[0].contentRect.height)
        })
      }, 200)
    })

    resizer.observe(ref.current)

    const curr = (ref?.current || {}) as any

    const rect = curr?.getBoundingClientRect()

    if (rect && rect.height !== height) {
      setHeight(rect.height)
    }

    return () => {
      resizer.disconnect()
      cancelAnimationFrame(animationFrameID)
      if (timeout) {
        clearTimeout(timeout)
      }
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const size = useMemo(() => {
    return measurePage(result, offset, height, headerHeight, rowHeight)
  }, [result, offset, height, headerHeight, rowHeight])
  const tables = useMemo(() => {
    return subsetResult(result, offset, size, properties.showAll)
  }, [result, offset, size]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setSize(size)
  }, [size]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setMaxSize(measurePage(result, 0, height, headerHeight, rowHeight))
  }, [result, height, headerHeight, rowHeight]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setPage(1)
  }, [result]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (maxSize) {
      setTotalPages(Math.ceil((result?.table?.length ?? 0) / maxSize))
    }
  }, [maxSize, result]) // eslint-disable-line react-hooks/exhaustive-deps

  const inner =
    !!size &&
    tables.map((t, tIdx) => (
      <InnerTable
        table={t}
        pagedTableIds={{
          pagedTableHeaderId,
          pagedTableBodyId,
        }}
        key={`table${tIdx}`}
      />
    ))

  return (
    <div
      className={`${styles['visualization--simple-table--results']}`}
      ref={ref}
    >
      <DapperScrollbars noScrollY>{inner}</DapperScrollbars>
    </div>
  )
}

export default PagedTable
