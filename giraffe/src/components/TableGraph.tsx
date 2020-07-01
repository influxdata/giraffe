import React, {FunctionComponent, useState} from 'react'

import {
  ASCENDING,
  DESCENDING,
  DEFAULT_SORT_DIRECTION,
} from '../constants/tableGraph'
import {
  TableViewProperties,
  SortOptions,
  FluxTable,
  TimeZone,
  Theme,
} from '../types'

import {get} from '../utils/get'

import {TableGraphTransform} from './TableGraphTransform'
import {TableGraphTable} from './TableGraphTable'

interface Props {
  table: FluxTable
  properties: TableViewProperties
  timeZone: TimeZone
  theme: Theme
}

const handleSetSort = (
  fieldName: string,
  sortOptions: SortOptions,
  setSortOptions: Function
) => {
  const newSortOptions = {...sortOptions}
  if (fieldName === sortOptions.field) {
    newSortOptions.direction =
      sortOptions.direction === ASCENDING ? DESCENDING : ASCENDING
  } else {
    newSortOptions.field = fieldName
    newSortOptions.direction = DEFAULT_SORT_DIRECTION
  }
  setSortOptions(newSortOptions)
}

export const TableGraph: FunctionComponent<Props> = (props: Props) => {
  const {table, properties, timeZone, theme} = props

  const [sortOptions, setSortOptions] = useState<SortOptions>({
    field: get(properties, 'tableOptions.sortBy.internalName', null),
    direction: ASCENDING,
  })

  return (
    <TableGraphTransform
      data={table.data}
      properties={properties}
      dataTypes={table.dataTypes}
      sortOptions={sortOptions}
    >
      {transformedDataBundle => (
        <TableGraphTable
          properties={properties}
          dataTypes={table.dataTypes}
          onSort={(fieldName: string) =>
            handleSetSort(fieldName, sortOptions, setSortOptions)
          }
          transformedDataBundle={transformedDataBundle}
          timeZone={timeZone}
          theme={theme}
        />
      )}
    </TableGraphTransform>
  )
}
