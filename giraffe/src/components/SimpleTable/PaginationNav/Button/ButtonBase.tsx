// Libraries
import React, {forwardRef, MouseEvent} from 'react'
import classnames from 'classnames'

// Styles
import styles from './Button.scss'

// Types
import {StandardFunctionProps} from '../../../../types'

// Utils
import {styleReducer} from '../../../../utils/styleReducer'

export interface ButtonBaseProps extends StandardFunctionProps {
  /** Function to be called on button click */
  onClick?: (e?: MouseEvent<HTMLButtonElement>) => void
  /** Text to be displayed on hover tooltip */
  titleText?: string
  /** Keyboard control tab order  */
  tabIndex?: number
  /** Toggles button highlighted active state */
  active?: boolean
}

export type ButtonBaseRef = HTMLButtonElement

export const ButtonBase = forwardRef<ButtonBaseRef, ButtonBaseProps>(
  (
    {
      testID = 'button-base',
      onClick,
      active = false,
      titleText,
      tabIndex,
      children,
    },
    ref
  ) => {
    const buttonBaseClass = classnames(
      `cf-button cf-button-md cf-button-tertiary cf-button-square`,
      {
        active,
      }
    )
      .split(' ')
      .reduce((accum, current) => styleReducer(styles, accum, current), '')

    return (
      <button
        className={buttonBaseClass}
        onClick={onClick}
        title={titleText}
        tabIndex={!!tabIndex ? tabIndex : 0}
        data-testid={testID}
        ref={ref}
      >
        {children}
      </button>
    )
  }
)

ButtonBase.displayName = 'ButtonBase'
