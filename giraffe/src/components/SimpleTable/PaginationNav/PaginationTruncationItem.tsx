// Libraries
import React, {forwardRef, MouseEvent} from 'react'
import classnames from 'classnames'

// Components
import {Button} from './Button/Button'

// Types
import {
  ButtonShape,
  ComponentColor,
  ComponentSize,
  ComponentStatus,
  StandardFunctionProps,
} from '../../../types'

// Styles
import styles from './Pagination.scss'
import {styleReducer} from '../../../utils/styleReducer'

export interface PaginationTruncationItemProps extends StandardFunctionProps {
  onClick?: (e?: MouseEvent<HTMLElement>) => void
  size?: ComponentSize
}

export type PaginationTruncationItemRef = HTMLLIElement
export const PaginationTruncationItem = forwardRef<
  PaginationTruncationItemRef,
  PaginationTruncationItemProps
>(
  (
    {
      id,
      style,
      testID = 'pagination-truncation-item',
      className,
      onClick,
      size = ComponentSize.Medium,
    },
    ref
  ) => {
    const paginationClassName = classnames('cf-pagination--item--container', {
      [`${className}`]: className,
    })
      .split(' ')
      .reduce((accum, current) => styleReducer(styles, accum, current), '')

    return (
      <li
        className={paginationClassName}
        data-testid={testID}
        id={id}
        style={style}
        ref={ref}
      >
        <Button
          size={size}
          color={ComponentColor.Tertiary}
          onClick={onClick}
          shape={ButtonShape.Square}
          text={'...'}
          status={ComponentStatus.Disabled}
          style={{background: 'transparent'}}
        />
      </li>
    )
  }
)

PaginationTruncationItem.displayName = 'PaginationTruncationItem'
