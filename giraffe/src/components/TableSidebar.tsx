// Libraries
import React, {FunctionComponent, ChangeEvent, useState} from 'react'
import classnames from 'classnames'

// Components
import {Input, DapperScrollbars} from '@influxdata/clockface'
import {TableSidebarItem} from './TableSidebarItem'

// Types
import {IconFont} from '@influxdata/clockface'
import {FluxTable, Theme} from '../types'

interface Props {
  data: FluxTable[]
  selectedTableName: string
  onSelectTable: (name: string) => void
  theme?: Theme
}

const handleSearch = (
  event: ChangeEvent<HTMLInputElement>,
  setSearchTerm: Function
): void => setSearchTerm(event.target.value)

const getFilteredData = (
  data: FluxTable[],
  searchTerm: string
): FluxTable[] => {
  return data.filter(table => table.name.includes(searchTerm))
}

const isDataEmpty = (data: FluxTable[]): boolean => data.length > 0

export const TableSidebar: FunctionComponent<Props> = (props: Props) => {
  const {data, selectedTableName, onSelectTable, theme} = props

  const [searchTerm, setSearchTerm] = useState<string>('')

  const sidebarClassName = classnames('time-machine-sidebar', {
    'time-machine-sidebar__light': theme === 'light',
  })

  return (
    <div className={sidebarClassName}>
      {!isDataEmpty(data) && (
        <div className="time-machine-sidebar--heading">
          <Input
            icon={IconFont.Search}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              handleSearch(event, setSearchTerm)
            }
            placeholder="Filter tables..."
            value={searchTerm}
            className="time-machine-sidebar--filter"
          />
        </div>
      )}
      <DapperScrollbars
        autoHide={true}
        className="time-machine-sidebar--scroll"
      >
        <div className="time-machine-sidebar--items">
          {getFilteredData(data, searchTerm).map(({groupKey, id, name}) => {
            return (
              <TableSidebarItem
                id={id}
                key={id}
                name={name}
                groupKey={groupKey}
                onSelect={onSelectTable}
                isSelected={name === selectedTableName}
              />
            )
          })}
        </div>
      </DapperScrollbars>
    </div>
  )
}
