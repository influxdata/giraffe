import {range} from 'd3-array'
import {Table} from '../types'

type Row = {[colKey: string]: any}

/*
  Given a table, return a new table with rows filtered by the predicate
  function `f`.
*/
export const filterTable = (
  f: (row: Row, index: number) => boolean,
  table: Table
): Table => {
  const indicesToKeep = range(table.length).filter(i =>
    f(materializeRow(table, i), i)
  )

  const columns = Object.entries(table.columns).reduce(
    (acc, [colKey, col]) => ({
      ...acc,
      [colKey]: {
        ...col,
        data: take(col.data as any[], indicesToKeep),
      },
    }),
    {}
  )

  return {columns, length: indicesToKeep.length}
}

const materializeRow = (table: Table, index: number): {} => {
  const row = {}

  for (const colKey of Object.keys(table.columns)) {
    row[colKey] = table.columns[colKey].data[index]
  }

  return row
}

const take = <T>(xs: T[], is: number[]): T[] => {
  const result: T[] = []

  for (const i of is) {
    result.push(xs[i])
  }

  return result
}
