import {get} from './get'
import {replace} from './replace'
import {orderBy} from './orderBy'
import {unzip} from './unzip'
import {fastMap, fastReduce, fastFilter} from './fast'

import {
  CELL_HORIZONTAL_PADDING,
  DEFAULT_TIME_FIELD,
  FORMAT_OPTIONS,
  DEFAULT_TIME_FORMAT,
} from '../constants/tableGraph'

import {
  FluxTable,
  SortOptions,
  RenamableField,
  TableViewProperties,
  DecimalPlaces,
  ColumnWidths,
} from '../types'

type TableOptions = TableViewProperties['tableOptions']

const calculateSize = (message: string): number => {
  return message.length * 7
}

export interface TransformTableDataReturnType {
  transformedData: string[][]
  sortedTimeVals: string[]
  columnWidths: ColumnWidths
  resolvedRenamableFields: RenamableField[]
  sortOptions: SortOptions
}

export enum ErrorTypes {
  MetaQueryCombo = 'MetaQueryCombo',
  GeneralError = 'Error',
}

export const getInvalidDataMessage = (errorType: ErrorTypes): string => {
  switch (errorType) {
    case ErrorTypes.MetaQueryCombo:
      return 'Cannot display data for meta queries mixed with data queries'
    default:
      return null
  }
}

const calculateTimeColumnWidth = (timeFormat: string): number => {
  // Force usage of longest format names for ideal measurement
  timeFormat = replace(timeFormat, 'MMMM', 'September')
  timeFormat = replace(timeFormat, 'dddd', 'Wednesday')
  timeFormat = replace(timeFormat, 'A', 'AM')
  timeFormat = replace(timeFormat, 'h', '00')
  timeFormat = replace(timeFormat, 'X', '1522286058')
  timeFormat = replace(timeFormat, 'x', '1536106867461')

  const width = calculateSize(timeFormat)

  return width + CELL_HORIZONTAL_PADDING
}

const updateMaxWidths = (
  row: string[],
  maxColumnWidths: ColumnWidths,
  topRow: string[],
  isTopRow: boolean,
  RenamableFields: RenamableField[],
  timeFormatWidth: number,
  verticalTimeAxis: boolean,
  decimalPlaces: DecimalPlaces
): ColumnWidths => {
  const maxWidths = fastReduce<string>(
    row,
    (acc: ColumnWidths, col: string, c: number) => {
      const foundField = RenamableFields.find(
        field => field.internalName === col
      )

      let colValue: string | number = `${col}`
      if (foundField && foundField.displayName) {
        colValue = foundField.displayName
      } else if (!isNaN(+col) && decimalPlaces.isEnforced) {
        colValue = (+col).toFixed(decimalPlaces.digits)
      }

      const columnLabel = topRow[c]
      const isTimeColumn = columnLabel === DEFAULT_TIME_FIELD.internalName

      const isTimeRow = topRow[0] === DEFAULT_TIME_FIELD.internalName

      const useTimeWidth =
        (isTimeColumn && verticalTimeAxis && !isTopRow) ||
        (!verticalTimeAxis && isTopRow && isTimeRow && c !== 0)

      const currentWidth = useTimeWidth
        ? timeFormatWidth
        : calculateSize(colValue.toString().trim()) + CELL_HORIZONTAL_PADDING

      const {widths: Widths} = maxColumnWidths
      const maxWidth = get(Widths, `${columnLabel}`, 0)

      if (isTopRow || currentWidth > maxWidth) {
        acc.widths[columnLabel] = currentWidth
        acc.totalWidths += currentWidth - maxWidth
      }

      return acc
    },
    {...maxColumnWidths}
  )

  return maxWidths
}

export const resolveRenamableFields = (
  existingRenamableFields: RenamableField[],
  labels: string[]
): RenamableField[] => {
  let astNames = []

  labels.forEach(label => {
    const field: RenamableField = {
      internalName: label,
      displayName: '',
      visible: true,
    }
    astNames = [...astNames, field]
  })

  const intersection = existingRenamableFields.filter(f => {
    return astNames.find(a => a.internalName === f.internalName)
  })

  const newFields = astNames.filter(a => {
    return !existingRenamableFields.find(f => f.internalName === a.internalName)
  })

  return [...intersection, ...newFields]
}

export const calculateColumnWidths = (
  data: string[][],
  RenamableFields: RenamableField[],
  timeFormat: string,
  verticalTimeAxis: boolean,
  decimalPlaces: DecimalPlaces
): ColumnWidths => {
  const timeFormatWidth = calculateTimeColumnWidth(
    timeFormat === '' ? DEFAULT_TIME_FORMAT : timeFormat
  )

  return fastReduce<string[], ColumnWidths>(
    data,
    (acc: ColumnWidths, row: string[], r: number) => {
      return updateMaxWidths(
        row,
        acc,
        data[0],
        r === 0,
        RenamableFields,
        timeFormatWidth,
        verticalTimeAxis,
        decimalPlaces
      )
    },
    {widths: {}, totalWidths: 0}
  )
}

export const filterTableColumns = (
  data: string[][],
  RenamableFields: RenamableField[]
): string[][] => {
  const visibility = {}
  const filteredData = fastMap<string[], string[]>(data, (row, i) => {
    return fastFilter<string>(row, (col, j) => {
      if (i === 0) {
        const foundField = RenamableFields.find(
          field => field.internalName === col
        )
        visibility[j] = foundField ? foundField.visible : true
      }
      return visibility[j]
    })
  })
  return filteredData[0].length ? filteredData : [[]]
}

export const orderTableColumns = (
  data: string[][],
  RenamableFields: RenamableField[]
): string[][] => {
  const fieldsSortOrder = RenamableFields.map(RenamableField => {
    const dataHeader =
      Array.isArray(data) && Array.isArray(data[0]) ? data[0] : []
    return dataHeader.findIndex(dataLabel => {
      return dataLabel === RenamableField.internalName
    })
  })

  const filteredFieldSortOrder = fieldsSortOrder.filter(f => f !== -1)

  const orderedData = fastMap<string[], string[]>(
    data,
    (row: string[]): string[] => {
      return row.map((__, j, arr) => arr[filteredFieldSortOrder[j]])
    }
  )
  return orderedData[0].length ? orderedData : [[]]
}

export const sortTableData = (
  data: string[][],
  sort: SortOptions
): {sortedData: string[][]; sortedTimeVals: string[]} => {
  const dataHeader =
    Array.isArray(data) && Array.isArray(data[0]) ? data[0] : []
  const headerSet = new Set(dataHeader)

  let sortIndex = 0

  if (headerSet.has(sort.field)) {
    sortIndex = dataHeader.indexOf(sort.field)
  }

  const dataValues = Array.isArray(data) ? data.slice(1) : [[]]
  const sortedData = [
    dataHeader,
    orderBy<string[][]>(
      dataValues,
      row => {
        const sortedValue = row[sortIndex]
        if (isNaN(Number(sortedValue))) {
          return sortedValue
        }
        return Number(sortedValue)
      },
      [sort.direction]
    ),
  ] as string[][]

  const sortedTimeVals = fastMap<string[], string>(
    sortedData,
    (r: string[]): string => r[sortIndex]
  )
  return {sortedData, sortedTimeVals}
}

export const excludeNoisyColumns = (data: string[][]): string[][] => {
  const IGNORED_COLUMNS = ['', 'result', 'table']

  const header = data[0]
  const ignoredIndices = IGNORED_COLUMNS.map(name => header.indexOf(name))

  const excludedData = data.map(row => {
    return row.filter((__, i) => !ignoredIndices.includes(i))
  })

  return excludedData
}

export const transformTableData = (
  data: string[][],
  sortOptions: SortOptions,
  RenamableFields: RenamableField[],
  tableOptions: TableOptions,
  timeFormat: string,
  decimalPlaces: DecimalPlaces
): TransformTableDataReturnType => {
  const {verticalTimeAxis} = tableOptions

  const excludedData = excludeNoisyColumns(data)

  const resolvedRenamableFields = resolveRenamableFields(
    RenamableFields,
    excludedData[0]
  )

  const {sortedData, sortedTimeVals} = sortTableData(excludedData, sortOptions)

  const filteredData = filterTableColumns(sortedData, resolvedRenamableFields)

  const orderedData = orderTableColumns(filteredData, resolvedRenamableFields)

  const transformedData = verticalTimeAxis ? orderedData : unzip(orderedData)

  const columnWidths = calculateColumnWidths(
    transformedData,
    resolvedRenamableFields,
    timeFormat,
    verticalTimeAxis,
    decimalPlaces
  )

  return {
    transformedData,
    sortedTimeVals,
    columnWidths,
    resolvedRenamableFields,
    sortOptions,
  }
}

/*
  Checks whether an input value of arbitrary type can be parsed into a
  number. Note that there are two different `isNaN` checks, since

  - `Number('')` is 0
  - `Number('02abc')` is NaN
  - `parseFloat('')` is NaN
  - `parseFloat('02abc')` is 2

*/
export const isNumerical = (x: any): boolean =>
  !isNaN(Number(x)) && !isNaN(parseFloat(x))

export const findHoverTimeIndex = (
  sortedTimeVals: string[],
  hoverTime: number
) => {
  if (sortedTimeVals.length < 2) {
    // first value is "_time" header
    return -1
  }

  const firstDiff = getUnixISODiff(hoverTime, sortedTimeVals[1]) // sortedTimeVals[0] is "_time"
  const hoverTimeFound = fastReduce<string, {index: number; diff: number}>(
    sortedTimeVals,
    (acc, currentTime, index) => {
      const thisDiff = getUnixISODiff(hoverTime, currentTime)
      if (thisDiff < acc.diff) {
        return {index, diff: thisDiff}
      }
      return acc
    },
    {index: 1, diff: firstDiff}
  )

  return hoverTimeFound.index
}

/**
 * Get absolute mili seconds between a unix ms time number and iso utc string
 *
 * @param unixMs
 * @param isoTime
 */
export const getUnixISODiff = (unixMs: number, isoTime: string | number) => {
  return Math.abs(unixMs - new Date(isoTime).valueOf())
}

export const findTableNameHeaders = (tables: FluxTable[], name: string) => {
  const foundTable = tables.find(t => t.name === name)

  return get(foundTable, 'data.0', [])
}

export const resolveTimeFormat = (timeFormat: string) => {
  if (FORMAT_OPTIONS.find(d => d.text === timeFormat)) {
    return timeFormat
  }

  return DEFAULT_TIME_FORMAT
}
