// Libraries
import React, {forwardRef} from 'react'
import classnames from 'classnames'

// Types
import {
  Alignment,
  StandardFunctionProps,
  VerticalAlignment,
} from '../../../types'

// Styles
import styles from './Table.scss'
import {styleReducer} from '../../../utils/styleReducer'

export interface TableHeaderCellProps extends StandardFunctionProps {
  /** How many columns this cell should take up */
  colSpan?: number
  /** Horizontal alignment of contents */
  horizontalAlignment?: Alignment
  /** Vertical alignment of contents */
  verticalAlignment?: VerticalAlignment
}

export type TableHeaderCellRef = HTMLTableHeaderCellElement

export const TableHeaderCell = forwardRef<
  TableHeaderCellRef,
  TableHeaderCellProps
>(
  (
    {
      children,
      className,
      colSpan = 1,
      horizontalAlignment = Alignment.Left,
      id,
      style,
      testID = 'table-header-cell',
      verticalAlignment = VerticalAlignment.Middle,
    },
    ref
  ) => {
    const tableHeaderCellClass = classnames('cf-table--header-cell', {
      [`${className}`]: className,
    })
      .split(' ')
      .reduce((accum, current) => styleReducer(styles, accum, current), '')

    const tableHeaderCellStyle = {
      textAlign: horizontalAlignment,
      verticalAlign: verticalAlignment,
      ...style,
    }

    return (
      <th
        className={tableHeaderCellClass}
        colSpan={colSpan}
        data-testid={testID}
        id={id}
        ref={ref}
        style={tableHeaderCellStyle}
      >
        {children}
      </th>
    )
  }
)

TableHeaderCell.displayName = 'TableHeaderCell'
