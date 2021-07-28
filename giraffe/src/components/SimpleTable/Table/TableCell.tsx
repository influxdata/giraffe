// Libraries
import React, {forwardRef} from 'react'
import classnames from 'classnames'

// Types
import {StandardFunctionProps} from '../../../types'
import {styleReducer} from '../../../utils/styleReducer'

import styles from './Table.scss'

export interface TableCellProps extends StandardFunctionProps {}

export type TableCellRef = HTMLTableDataCellElement

export const TableCell = forwardRef<TableCellRef, TableCellProps>(
  ({testID = 'table-cell', className, children}, ref) => {
    const tableCellClass = classnames('cf-table--cell', {
      [`${className}`]: className,
    })
      .split(' ')
      .reduce((accum, current) => styleReducer(styles, accum, current), '')

    return (
      <td
        ref={ref}
        style={{textAlign: 'left', verticalAlign: 'middle'}}
        colSpan={1}
        className={tableCellClass}
        data-testid={testID}
      >
        {children}
      </td>
    )
  }
)

TableCell.displayName = 'TableCell'
