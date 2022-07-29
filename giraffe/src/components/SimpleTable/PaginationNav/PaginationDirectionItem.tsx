// Libraries
import React, {forwardRef, MouseEvent} from 'react'
import {Button} from './Button/Button'
import classnames from 'classnames'

// Types
import {
  ButtonShape,
  ComponentColor,
  ComponentSize,
  Direction,
  IconFont,
  StandardFunctionProps,
} from '../../../types'

// Styles
import styles from './Pagination.scss'
import {styleReducer} from '../../../utils/styleReducer'

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

    const iconFont =
      direction === Direction.Left
        ? IconFont.CaretLeft_New
        : IconFont.CaretRight_New

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
          icon={iconFont}
          active={isActive}
        ></Button>
      </li>
    )
  }
)

PaginationDirectionItem.displayName = 'PaginationDirectionItem'
