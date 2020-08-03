// Libraries
import React, {forwardRef} from 'react'
import classnames from 'classnames'

// Types
import {StandardFunctionProps} from '../types'
import {IconFont} from '../types/input'

// Styles
import styles from './Icon.scss'

export interface IconProps extends StandardFunctionProps {
  /** Icon to display */
  glyph: IconFont | string
}

export type IconRef = HTMLSpanElement

export const Icon = forwardRef<IconRef, IconProps>(
  ({id, glyph, style, testID = 'icon', className}, ref) => {
    const iconClassNames = classnames('cf-icon', {
      [`${glyph}`]: glyph,
      [`${className}`]: className,
    })
      .split(' ')
      .reduce((accum, current) => {
        if (styles[current]) {
          return accum ? `${accum} ${styles[current]}` : `${styles[current]}`
        }
        return accum ? `${accum} ${current}` : `${current}`
      }, '')

    return (
      <span
        id={id}
        ref={ref}
        style={style}
        data-testid={testID}
        className={iconClassNames}
      />
    )
  }
)

Icon.displayName = 'GiraffeIcon'
