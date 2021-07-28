// Libraries
import React, {forwardRef} from 'react'

// Types
import {StandardFunctionProps} from '../../../types'
import styles from './Table.scss'

export interface TableRowProps extends StandardFunctionProps {}

export type TableRowRef = HTMLTableRowElement

export const TableRow = forwardRef<TableRowRef, TableRowProps>(
  ({testID = 'table-row', children}, ref) => {
    return (
      <tr
        ref={ref}
        className={`${styles['cf-table--row']}`}
        data-testid={testID}
      >
        {children}
      </tr>
    )
  }
)

TableRow.displayName = 'TableRow'
