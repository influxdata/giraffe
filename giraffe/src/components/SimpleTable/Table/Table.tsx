// Libraries
import React, {forwardRef} from 'react'
import classnames from 'classnames'

// Styles
import styles from './Table.scss'
import {styleReducer} from '../../../utils/styleReducer'

// Types
import {StandardFunctionProps} from '../../../types'

export interface TableProps extends StandardFunctionProps {}

export type TableRef = HTMLTableElement

export const TableRoot = forwardRef<TableRef, TableProps>(
  ({testID = 'table', className, children}, ref) => {
    const tableClass = classnames(
      'cf-table cf-table__borders-horizontal cf-table__font-sm cf-table__striped cf-table__highlight',
      {
        [`${className}`]: className,
      }
    )
      .split(' ')
      .reduce((accum, current) => styleReducer(styles, accum, current), '')

    return (
      <table
        data-testid={testID}
        ref={ref}
        style={{width: '100%'}}
        className={tableClass}
      >
        {children}
      </table>
    )
  }
)

TableRoot.displayName = 'Table'
