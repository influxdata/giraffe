// Libraries
import React, {forwardRef, MouseEvent} from 'react'
import classnames from 'classnames'
import {Button} from './Button/Button'

// Utils
import {styleReducer} from '../../../utils/styleReducer'

// Styles
import styles from './Pagination.scss'

// Types
import {StandardFunctionProps} from '../../../types'

export interface PaginationItemProps extends StandardFunctionProps {
  page?: string
  isActive: boolean
  onClick?: (e?: MouseEvent<HTMLElement>) => void
}

export type PaginationItemRef = HTMLLIElement
export const PaginationItem = forwardRef<
  PaginationItemRef,
  PaginationItemProps
>(({testID = 'pagination-item', page, isActive, onClick}, ref) => {
  const paginationItemContainerClassName = classnames(
    'cf-pagination--item--container',
    {
      'cf-pagination--item--container__active': isActive && page,
    }
  )
    .split(' ')
    .reduce((accum, current) => styleReducer(styles, accum, current), '')

  return (
    <li
      className={paginationItemContainerClassName}
      data-testid={testID}
      ref={ref}
    >
      <Button
        onClick={onClick}
        active={isActive}
        text={page}
        testID={
          isActive
            ? `pagination-item-${page}-active`
            : `pagination-item-${page}`
        }
      />
    </li>
  )
})

PaginationItem.displayName = 'PaginationItem'
