// Libraries
import React, {forwardRef, MouseEvent} from 'react'
import classnames from 'classnames'
import {Button} from './Button/Button'

// Utils
import {styleReducer} from '../../../utils/styleReducer'

// Styles
import styles from './Pagination.scss'

// Types
import {ComponentSize, Direction, IconFont} from '../../../types/input'
import {StandardFunctionProps} from '../../../types'
import {ComponentColor, ButtonShape} from '../types'

export interface PaginationDirectionItemProps extends StandardFunctionProps {
  /** Caret Left or Caret Right on button */
  direction: Direction
  onClick?: (e?: MouseEvent<HTMLButtonElement>) => void
  size?: ComponentSize
  isActive: boolean
}

export type PaginationDirectionItemRef = HTMLLIElement
export const PaginationDirectionItem = forwardRef<
  PaginationDirectionItemRef,
  PaginationDirectionItemProps
>(
  (
    {
      id,
      style,
      testID = 'pagination-direction-item',
      className,
      direction,
      onClick,
      size = ComponentSize.Medium,
      isActive,
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
          icon={IconFont[direction]}
          active={isActive}
        ></Button>
      </li>
    )
  }
)

PaginationDirectionItem.displayName = 'PaginationDirectionItem'
