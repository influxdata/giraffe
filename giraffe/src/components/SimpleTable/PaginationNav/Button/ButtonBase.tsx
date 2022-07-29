// Libraries
import React, {forwardRef, MouseEvent} from 'react'
import classnames from 'classnames'

// Styles
import styles from './Button.scss'

// Types
import {
  ButtonShape,
  ButtonType,
  ComponentColor,
  ComponentSize,
  ComponentStatus,
  StandardFunctionProps,
} from '../../../../types'

// Utils
import {styleReducer} from '../../../../utils/styleReducer'

export interface ButtonBaseProps extends StandardFunctionProps {
  /** Function to be called on button click */
  onClick?: (e?: MouseEvent<HTMLButtonElement>) => void
  /** Function to be called on mouse over */
  onMouseOver?: (e?: MouseEvent<HTMLButtonElement>) => void
  /** Function to be called on mouse out */
  onMouseOut?: (e?: MouseEvent<HTMLButtonElement>) => void
  /** Function to be called on mouse enter */
  onMouseEnter?: (e?: MouseEvent<HTMLButtonElement>) => void
  /** Function to be called on mouse leave */
  onMouseLeave?: (e?: MouseEvent<HTMLButtonElement>) => void
  /** Text to be displayed on hover tooltip */
  titleText?: string
  /** Text to be displayed on hover tooltip when the button is disabled */
  disabledTitleText?: string
  /** Keyboard control tab order  */
  tabIndex?: number
  /** Button color */
  color?: ComponentColor
  /** Button size */
  size?: ComponentSize
  /** Square or rectangle */
  shape?: ButtonShape
  /** Button status state default, loading, or disabled */
  status?: ComponentStatus
  /** Toggles button highlighted active state */
  active?: boolean
  /** Button type of 'button' or 'submit' */
  type?: ButtonType
}

export type ButtonBaseRef = HTMLButtonElement

export const ButtonBase = forwardRef<ButtonBaseRef, ButtonBaseProps>(
  (
    {
      id,
      style,
      onClick,
      children,
      tabIndex,
      titleText,
      disabledTitleText,
      className,
      onMouseOut,
      onMouseOver,
      onMouseEnter,
      onMouseLeave,
      active = false,
      testID = 'button-base',
      type = ButtonType.Button,
      size = ComponentSize.Small,
      shape = ButtonShape.Default,
      color = ComponentColor.Default,
      status = ComponentStatus.Default,
    },
    ref
  ) => {
    const disabled =
      status === ComponentStatus.Disabled || status === ComponentStatus.Loading

    const buttonBaseClass = classnames(
      `cf-button cf-button-${size} cf-button-${color}`,
      {
        'cf-button-square': shape === ButtonShape.Square,
        'cf-button-stretch': shape === ButtonShape.StretchToFit,
        'cf-button--loading': status === ComponentStatus.Loading,
        'cf-button--disabled': status === ComponentStatus.Disabled,
        active,
        [`${className}`]: className,
      }
    )
      .split(' ')
      .reduce((accum, current) => styleReducer(styles, accum, current), '')

    const titleTextToBeUsed =
      status === ComponentStatus.Disabled && disabledTitleText
        ? disabledTitleText
        : titleText

    return (
      <button
        className={buttonBaseClass}
        disabled={disabled}
        onClick={onClick}
        onMouseOut={onMouseOut}
        onMouseOver={onMouseOver}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        title={titleTextToBeUsed}
        tabIndex={!!tabIndex ? tabIndex : 0}
        type={type}
        data-testid={testID}
        id={id}
        style={style}
        ref={ref}
      >
        <span>{children}</span>
      </button>
    )
  }
)

ButtonBase.displayName = 'ButtonBase'
