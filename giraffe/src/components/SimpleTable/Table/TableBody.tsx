// Libraries
import React, {forwardRef} from 'react'

// Types
import {StandardFunctionProps} from '../../../types'
import styles from './Table.scss'

export interface TableBodyProps extends StandardFunctionProps {}

export type TableBodyRef = HTMLTableSectionElement

export const TableBody = forwardRef<TableBodyRef, TableBodyProps>(
  ({testID = 'table-body', children}, ref) => {
    return (
      <tbody
        data-testid={testID}
        ref={ref}
        className={`${styles['cf-table--body']}`}
      >
        {children}
      </tbody>
    )
  }
)

TableBody.displayName = 'TableBody'
