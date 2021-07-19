// Libraries
import React, {forwardRef} from 'react'
import classnames from 'classnames'

// Types
import {
  StandardFunctionProps,
  Alignment,
  VerticalAlignment,
} from '../../../types'
import {styleReducer} from '../../../utils/styleReducer'

import styles from './Table.scss'
export interface TableCellProps extends StandardFunctionProps {
  /** How many columns this cell should take up */
  colSpan?: number
  /** Horizontal alignment of contents */
  horizontalAlignment?: Alignment
  /** Vertical alignment of contents */
  verticalAlignment?: VerticalAlignment
}

export type TableCellRef = HTMLTableDataCellElement

export const TableCell = forwardRef<TableCellRef, TableCellProps>(
  (
    {
      id,
      style,
      testID = 'table-cell',
      colSpan = 1,
      children,
      className,
      verticalAlignment = VerticalAlignment.Middle,
      horizontalAlignment = Alignment.Left,
    },
    ref
  ) => {
    const tableCellClass = classnames('cf-table--cell', {
      [`${className}`]: className,
    })
      .split(' ')
      .reduce((accum, current) => styleReducer(styles, accum, current), '')

    const tableCellStyle = {
      textAlign: horizontalAlignment,
      verticalAlign: verticalAlignment,
      ...style,
    }

    return (
      <td
        id={id}
        ref={ref}
        style={tableCellStyle}
        colSpan={colSpan}
        className={tableCellClass}
        data-testid={testID}
      >
        {children}
      </td>
    )
  }
)

TableCell.displayName = 'TableCell'
