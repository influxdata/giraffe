import React, {Fragment, FunctionComponent} from 'react'
import styles from './TableGraphs.scss'

interface GroupKey {
  [x: string]: string
}

interface Props {
  name: string
  id: string
  isSelected: boolean
  groupKey: GroupKey
  onSelect: (name: string) => void
}

const getName = (groupKey: GroupKey): JSX.Element[] => {
  const keysIHate = ['_start', '_stop']
  return Object.entries(groupKey)
    .filter(([k]) => !keysIHate.includes(k))
    .map(([k, v], i) => {
      return (
        <Fragment key={i}>
          <span className="key">{k}</span>
          <span className="equals">=</span>
          <span className="value">{v}</span>
        </Fragment>
      )
    })
}

export const TableSidebarItem: FunctionComponent<Props> = (props: Props) => {
  const {name, isSelected, groupKey, onSelect} = props
  const handleClick = () => onSelect(name)

  return (
    <div
      className={`${styles['time-machine-sidebar-item']} ${
        isSelected ? styles['active'] : ''
      }`}
      onClick={handleClick}
    >
      {getName(groupKey)}
    </div>
  )
}
