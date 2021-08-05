// Libraries
import React, {FunctionComponent} from 'react'

// Components
import {Icon} from '../../../Icon'

// Types
import {IconFont} from '../../../../types/input'

// Styles
import styles from './Button.scss'

export interface IconAndTextProps {
  text?: string
  icon?: IconFont | string
}

export const IconAndText: FunctionComponent<IconAndTextProps> = ({
  text,
  icon,
}) => {
  const iconEl = !!icon && (
    <Icon glyph={icon} className={`${styles['cf-button-icon']}`} />
  )
  const textEl = !!text && (
    <span className={`${styles['cf-button--label']}`}>{text}</span>
  )

  if (!icon && !text) {
    return null
  }

  return (
    <>
      {iconEl}
      {textEl}
    </>
  )
}

IconAndText.displayName = 'IconAndText'
