// Libraries
import React, {forwardRef} from 'react'
import classnames from 'classnames'

// Types
import {StandardFunctionProps} from '../../../types'

// Styles
import styles from './Table.scss'
import {styleReducer} from '../../../utils/styleReducer'

export interface TableHeaderCellProps extends StandardFunctionProps {}

export type TableHeaderCellRef = HTMLTableHeaderCellElement

export const TableHeaderCell = forwardRef<
  TableHeaderCellRef,
  TableHeaderCellProps
>(({testID = 'table-header-cell', className, children, style}, ref) => {
  const tableHeaderCellClass = classnames('cf-table--header-cell', {
    [`${className}`]: className,
  })
    .split(' ')
    .reduce((accum, current) => styleReducer(styles, accum, current), '')

  return (
    <th
      data-testid={testID}
      ref={ref}
      style={{...style, textAlign: 'left', verticalAlign: 'top'}}
      colSpan={1}
      className={tableHeaderCellClass}
    >
      {children}
    </th>
  )
})

TableHeaderCell.displayName = 'TableHeaderCell'
