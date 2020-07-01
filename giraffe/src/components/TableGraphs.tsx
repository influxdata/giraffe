// Libraries
import React, {FunctionComponent, useState} from 'react'

// Components
import {TableGraph} from './TableGraph'
import {TableSidebar} from './TableSidebar'

// Utils
import {get} from '../utils/get'

// Types
import {TableViewProperties, FluxTable, TimeZone, Theme} from '../types'

interface Props {
  tables: FluxTable[]
  properties: TableViewProperties
  timeZone: TimeZone
  theme: Theme
  setFieldOptions: Function
}

const getNameOfSelectedTable = (
  tables: FluxTable[],
  selectedTableName: string
) => {
  const isNameInTables = tables.find(t => t.name === selectedTableName)

  if (!isNameInTables) {
    return getDefaultTableName(tables)
  }

  return selectedTableName
}

const getDefaultTableName = (tables: FluxTable[]): string => {
  return get(tables, '0.name', null)
}

const showSidebar = (tables: FluxTable[]): boolean => {
  return tables.length > 1
}

const hasData = (selectedTable: FluxTable): boolean => {
  const {data} = selectedTable
  return !!data && !!data.length
}

const isTableVisible = (
  tables: FluxTable[],
  selectedTableName: string
): boolean => {
  return !!getSelectedTable(tables, selectedTableName)
}

const getSelectedTable = (
  tables: FluxTable[],
  selectedTableName: string
): FluxTable => {
  return tables.find(
    t => t.name === getNameOfSelectedTable(tables, selectedTableName)
  )
}

export const TableGraphs: FunctionComponent<Props> = (props: Props) => {
  const {tables, properties, timeZone, theme} = props

  const [selectedTableName, setSelectedTableName] = useState<string>(
    get(tables, '0.name', null)
  )

  return (
    <div className="time-machine-tables">
      {showSidebar(tables) && (
        <TableSidebar
          data={tables}
          selectedTableName={getNameOfSelectedTable(tables, selectedTableName)}
          onSelectTable={setSelectedTableName}
          theme={theme}
        />
      )}
      {isTableVisible(tables, selectedTableName) && (
        <TableGraph
          key={getNameOfSelectedTable(tables, selectedTableName)}
          table={getSelectedTable(tables, selectedTableName)}
          properties={properties}
          timeZone={timeZone}
          theme={theme}
        />
      )}
      {!hasData(getSelectedTable(tables, selectedTableName)) && (
        <div>
          <h4>This table has no data </h4>
        </div>
      )}
    </div>
  )
}
