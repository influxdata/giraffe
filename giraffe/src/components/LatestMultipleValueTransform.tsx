// Libraries
import React, {useMemo, FunctionComponent} from 'react'
import {Table} from '../types'
import {createColsMString} from './GaugeMini'

interface SelectedColumns {
  [key: string]: true
}

export const getLatestValuesGrouped = (
  table: Table,
  columnsObj: SelectedColumns
) => {
  const columns = Object.keys(columnsObj).sort()

  columns.forEach(x => {
    if (table.getColumnType(x) !== 'string') {
      throw new Error(
        `Data can be grouped only by string columns. But column ${x} is typeof ${table.getColumnType(
          x
        )}`
      )
    }
  })

  const valueColumn = table.getColumn('_value', 'number') as number[]

  if (!valueColumn.length) {
    return []
  }

  // Fallback to `_stop` column if `_time` column missing otherwise return empty array.
  let timeColData: number[] = []

  if (table.columnKeys.includes('_time')) {
    timeColData = table.getColumn('_time', 'number') as number[]
  } else if (table.columnKeys.includes('_stop')) {
    timeColData = table.getColumn('_stop', 'number') as number[]
  }
  if (!timeColData && table.length !== 1) {
    return []
  }

  const groupColsData = columns.map(k =>
    table.getColumn(k, 'string')
  ) as string[][]

  const result: {[key: string]: number} = {}

  timeColData
    // merge time with it's index
    .map((time, index) => ({time, index}))
    // remove entries without time
    .filter(({time}) => time)
    // todo: sort time complexity too high ... replace with another solution
    // from low time to high time (last is last)
    .sort(({time: t1}, {time: t2}) => t1 - t2)
    // get relevant data from index (we don't need time anymore)
    .map(({index}) => ({
      value: valueColumn[index],
      groupRow: groupColsData.map(x => x[index]),
    }))
    // remove invalid data
    .filter(({value}) => Number.isFinite(value) && typeof value === 'number')
    // create result
    .forEach(({value, groupRow}) => {
      const grupObj = {}
      groupRow.forEach((x, i) => (grupObj[columns[i]] = x))
      const strKey = createColsMString(columnsObj, grupObj)
      // data is inserted from last to first so latest data is first
      result[strKey] = value
    })

  return result
}

interface Props {
  table: Table
  columns: SelectedColumns
  children: (latestValue: {colsMString: string; value: number}[]) => JSX.Element
  quiet?: boolean
}

// todo: can return string ?
export const LatestMultipleValueTransform: FunctionComponent<Props> = ({
  table,
  columns,
  quiet = false,
  children,
}) => {
  const latestValues = useMemo(() => getLatestValuesGrouped(table, columns), [
    table,
  ])

  if (latestValues.length === 0 && quiet) {
    return null
  }

  if (latestValues.length === 0) {
    return (
      <div>
        <h4>No latest value found</h4>
      </div>
    )
  }

  const entries = Object.keys(latestValues).map(x => ({
    colsMString: x,
    value: latestValues[x],
  }))

  return children(entries)
}
