import React, {FunctionComponent, useState} from 'react'

import {
  ASCENDING,
  DESCENDING,
  DEFAULT_SORT_DIRECTION,
} from '../../constants/tableGraph'
import {
  TableViewProperties,
  SortOptions,
  FluxTable,
  TimeZone,
  Theme,
} from '../../types'

import {get} from '../../utils/get'

import {TableGraphTransform} from './TableGraphTransform'
import {TableGraphTable} from './TableGraphTable'

interface Props {
  table: FluxTable
  properties: TableViewProperties
  timeZone: TimeZone
  theme: Theme
}

interface State {
  sortOptions: SortOptions
}

const handleSetSort = (fieldName: string, setState: Function) => {
  setState(({sortOptions}) => {
    const newSortOptions = {...sortOptions}
    newSortOptions.direction = DEFAULT_SORT_DIRECTION
    if (fieldName === sortOptions.field) {
      if (sortOptions.direction !== DESCENDING) {
        newSortOptions.direction = DESCENDING
        return {sortOptions: newSortOptions}
      }
      newSortOptions.field = ''
      return {sortOptions: newSortOptions}
    }
    newSortOptions.field = fieldName
    return {sortOptions: newSortOptions}
  })
}

export const TableGraph: FunctionComponent<Props> = (props: Props) => {
  const {table, properties, timeZone, theme} = props

  const [state, setState] = useState<State>({
    sortOptions: {
      field: get(properties, 'tableOptions.sortBy.internalName', null),
      direction: ASCENDING,
    },
  })

  const onSortCallback = (fieldName: string) => {
    handleSetSort(fieldName, setState)
  }
  return (
    <TableGraphTransform
      data={table.data}
      properties={properties}
      dataTypes={table.dataTypes}
      sortOptions={state.sortOptions}
    >
      {transformedDataBundle => (
        <TableGraphTable
          properties={properties}
          dataTypes={table.dataTypes}
          onSort={onSortCallback}
          transformedDataBundle={transformedDataBundle}
          timeZone={timeZone}
          theme={theme}
        />
      )}
    </TableGraphTransform>
  )
}
