// Libraries
import React, {forwardRef} from 'react'

// Components
import {ButtonBase, ButtonBaseRef} from './ButtonBase'
import {IconAndText} from './IconAndText'

// Types
import {IconFont} from '../../../../types/input'
import {ButtonBaseProps} from './ButtonBase'

export interface ButtonProps extends ButtonBaseProps {
  /** Text to be displayed on button */
  text?: string
  /** Icon to be displayed to the left of text or in place of text */
  icon?: IconFont
}

export type ButtonRef = ButtonBaseRef

// Originally taken from Clockface and reduced
export const Button = forwardRef<ButtonRef, ButtonProps>(
  ({testID = 'button', onClick, active = false, text, icon = ''}, ref) => {
    if (!icon && !text) {
      throw new Error('Button requires either "text" or "icon" props')
    }
    return (
      <ButtonBase
        testID={testID}
        onClick={onClick}
        active={active}
        titleText={text}
        tabIndex={0}
        ref={ref}
      >
        <IconAndText text={text} icon={icon} />
      </ButtonBase>
    )
  }
)

Button.displayName = 'Button'
