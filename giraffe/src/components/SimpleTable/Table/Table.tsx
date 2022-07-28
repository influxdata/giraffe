// Libraries
import React, {forwardRef} from 'react'
import classnames from 'classnames'

// Styles
import styles from './Table.scss'
import {styleReducer} from '../../../utils/styleReducer'

// Types
import {BorderType, ComponentSize, StandardFunctionProps} from '../../../types'

export interface TableProps extends StandardFunctionProps {
  /** Padding inside every cell in the table */
  cellPadding?: ComponentSize
  /** Font size of table elements */
  fontSize?: ComponentSize
  /** Controls the appearance of borders in the table */
  borders?: BorderType
  /** Controls coloration pattern of rows, useful for improving legibility on dense tables */
  striped?: boolean
  /** Highlights a row on hover, useful for improving legibility on dense tables */
  highlight?: boolean
}

export type TableRef = HTMLTableElement

export const TableRoot = forwardRef<TableRef, TableProps>(
  (
    {
      id,
      style = {width: '100%'},
      testID = 'table',
      striped = false,
      borders = BorderType.Horizontal,
      children,
      fontSize = ComponentSize.Medium,
      highlight = false,
      className,
      cellPadding = ComponentSize.Small,
    },
    ref
  ) => {
    const tableClass = classnames('cf-table', {
      [`cf-table__padding-${cellPadding}`]: cellPadding,
      [`cf-table__borders-${borders}`]: borders,
      [`cf-table__font-${fontSize}`]: fontSize,
      'cf-table__striped': striped,
      'cf-table__highlight': highlight,
      [`${className}`]: className,
    })
      .split(' ')
      .reduce((accum, current) => styleReducer(styles, accum, current), '')

    return (
      <table
        id={id}
        ref={ref}
        style={style}
        className={tableClass}
        data-testid={testID}
      >
        {children}
      </table>
    )
  }
)

TableRoot.displayName = 'Table'
