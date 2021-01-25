// Libraries
import React, {useMemo, FunctionComponent} from 'react'
import {Table} from '../types'

export type GroupedData = {[key: string]: number}

const getTimeColumn = (table: Table) => {
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

  return timeColData
}

export const getLatestValuesGrouped = (
  table: Table,
  groupColumnKey: string
): GroupedData => {
  const valueCol = table.getColumn('_value', 'number')
  const groupCol = table.getColumn(groupColumnKey)

  if (!valueCol.length) {
    return {}
  }

  return Object.fromEntries(
    getTimeColumn(table)
      // merge time with it's index
      .map((time, index) => ({time, index}))
      // remove entries without time
      .filter(({time}) => time)
      // todo: sort time complexity too high ... replace with linear solution
      // from low time to high time (last is last)
      .sort(({time: t1}, {time: t2}) => t1 - t2)
      // get relevant data from index (we don't need time anymore)
      .map(({index}) => [groupCol?.[index] ?? '', valueCol[index]] as const)
      // remove invalid data
      .filter(
        ([_, value]) => typeof value === 'number' && Number.isFinite(value)
      )
  )
}

interface Props {
  table: Table
  children: (latestValue: GroupedData) => JSX.Element
  quiet?: boolean
}

// todo: can return string ?
export const LatestMultipleValueTransform: FunctionComponent<Props> = ({
  table,
  quiet = false,
  children,
}) => {
  const latestValues = useMemo(() => getLatestValuesGrouped(table, '_field'), [
    table,
  ])

  if (Object.keys(latestValues).length === 0) {
    return quiet ? null : (
      <div>
        <h4>No latest value found</h4>
      </div>
    )
  }

  return children(latestValues)
}
