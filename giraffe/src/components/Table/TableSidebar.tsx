// Libraries
import React, {FunctionComponent, ChangeEvent, useState} from 'react'

// Components
import {DapperScrollbars} from '../DapperScrollbars'
import {Input} from '../Input'
import {TableSidebarItem} from './TableSidebarItem'

// Types
import {IconFont, FluxTable, Theme} from '../../types'

// Styles
import styles from './TableGraphs.scss'

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

export const TableSidebar: FunctionComponent<Props> = (props: Props) => {
  const {data, selectedTableName, onSelectTable, theme} = props

  const [searchTerm, setSearchTerm] = useState<string>('')

  return (
    <div
      className={`${styles['time-machine-sidebar']} ${
        theme === 'light' ? styles['time-machine-sidebar__light'] : ''
      }`}
    >
      {data.length > 0 && (
        <div className={styles['time-machine-sidebar--heading']}>
          <Input
            icon={IconFont.Search_New}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              handleSearch(event, setSearchTerm)
            }
            placeholder="Filter tables..."
            value={searchTerm}
            className={styles['time-machine-sidebar--filter']}
          />
        </div>
      )}
      <DapperScrollbars
        autoHide={true}
        className={`${styles['time-machine-sidebar--scroll']}`}
      >
        <div className={styles['time-machine-sidebar--items']}>
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
