// Libraries
import React, {forwardRef} from 'react'

// Components
import {ButtonBase, ButtonBaseRef} from './ButtonBase'
import {IconAndText} from './IconAndText'

// Types
import {
  ButtonShape,
  ButtonType,
  ComponentColor,
  ComponentSize,
  ComponentStatus,
  IconFont,
} from '../../../../types'
import {ButtonBaseProps} from './ButtonBase'

export interface ButtonProps extends ButtonBaseProps {
  /** Text to be displayed on button */
  text?: string
  /** Icon to be displayed to the left of text or in place of text */
  icon?: IconFont
  /** Reverse ordering of text and icon */
  placeIconAfterText?: boolean
}

export type ButtonRef = ButtonBaseRef

export const Button = forwardRef<ButtonRef, ButtonProps>(
  (
    {
      active = false,
      className,
      color = ComponentColor.Default,
      disabledTitleText,
      icon = '',
      id,
      onClick,
      onMouseEnter,
      onMouseLeave,
      onMouseOut,
      onMouseOver,
      placeIconAfterText = false,
      shape = ButtonShape.Default,
      size = ComponentSize.Small,
      status = ComponentStatus.Default,
      style,
      tabIndex,
      testID = 'button',
      text,
      titleText,
      type = ButtonType.Button,
    },
    ref
  ) => {
    if (!icon && !text) {
      throw new Error('Button requires either "text" or "icon" props')
    }

    return (
      <ButtonBase
        active={active}
        className={className}
        color={color}
        disabledTitleText={disabledTitleText}
        id={id}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onMouseOut={onMouseOut}
        onMouseOver={onMouseOver}
        ref={ref}
        shape={shape}
        size={size}
        status={status}
        style={style}
        tabIndex={!!tabIndex ? tabIndex : 0}
        testID={testID}
        titleText={titleText || text}
        type={type}
      >
        <IconAndText
          placeIconAfterText={placeIconAfterText}
          text={text}
          icon={icon}
        />
        {status === ComponentStatus.Loading && (
          <div className={`cf-button-spinner cf-button-spinner--${size}`} />
        )}
      </ButtonBase>
    )
  }
)

Button.displayName = 'Button'
