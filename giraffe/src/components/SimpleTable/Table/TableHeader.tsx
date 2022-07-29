// Libraries
import React, {forwardRef} from 'react'

// Types
import {StandardFunctionProps} from '../../../types'

// Styles
import styles from './Table.scss'

export interface TableHeaderProps extends StandardFunctionProps {}

export type TableHeaderRef = HTMLTableSectionElement

export const TableHeader = forwardRef<TableHeaderRef, TableHeaderProps>(
  ({id, testID = 'table-header', children}, ref) => {
    return (
      <thead
        id={id}
        data-testid={testID}
        ref={ref}
        className={`${styles['cf-table--header']}`}
      >
        {children}
      </thead>
    )
  }
)

TableHeader.displayName = 'TableHeader'
