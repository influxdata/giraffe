// Libraries
import React, {forwardRef} from 'react'
import {Button} from './Button/Button'

// Styles
import styles from './Pagination.scss'

// Types
import {StandardFunctionProps} from '../../../types'

export type PaginationTruncationItemRef = HTMLLIElement
export const PaginationTruncationItem = forwardRef<
  PaginationTruncationItemRef,
  StandardFunctionProps
>(({testID = 'pagination-truncation-item'}, ref) => {
  return (
    <li
      className={`${styles['cf-pagination--item--container']}`}
      data-testid={testID}
      ref={ref}
    >
      <Button text={'...'}></Button>
    </li>
  )
})

PaginationTruncationItem.displayName = 'PaginationTruncationItem'
