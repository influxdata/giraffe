// Libraries
import React, {forwardRef} from 'react'
import classnames from 'classnames'

// Components
import {Icon} from '../Icon'

// Types
import {} from '../../types'
import {
  ComponentSize,
  ComponentStatus,
  IconFont,
  StandardFunctionProps,
} from '../../types'

// Styles
import styles from './StatusIndicator.scss'

// Utils
import {styleReducer} from '../../utils/styleReducer'

export interface StatusIndicatorProps extends StandardFunctionProps {
  /** The status to indicate */
  status: ComponentStatus
  /** Renders a shadow beneath the indicator for increased legibility */
  shadow?: boolean
  /** Controls the size of the indicator, this should match the size of the associated input */
  size?: ComponentSize
}

export type StatusIndicatorRef = HTMLDivElement

export const StatusIndicator = forwardRef<
  StatusIndicatorRef,
  StatusIndicatorProps
>(
  (
    {
      id,
      size = ComponentSize.Small,
      style,
      status,
      testID = 'status-indicator',
      shadow = true,
      className,
    },
    ref
  ) => {
    const statusIndicatorClasses = classnames('cf-status-indicator', {
      [`cf-status-indicator__${status}`]: status,
      [`cf-status-indicator__${size}`]: size,
      [`${className}`]: className,
    })
      .split(' ')
      .reduce((accum, current) => styleReducer(styles, accum, current), '')

    let statusElement: JSX.Element = <></>
    const shadowElement = shadow && (
      <div className={styles['cf-status-indicator--shadow']} />
    )

    if (status === ComponentStatus.Loading) {
      statusElement = (
        <span className={styles['cf-status-indicator--child']}>
          <div className={styles['cf-status-indicator--spinner']} />
        </span>
      )
    }

    if (status === ComponentStatus.Error) {
      statusElement = (
        <Icon
          glyph={IconFont.AlertTriangle}
          className={styles['cf-status-indicator--child']}
        />
      )
    }

    if (status === ComponentStatus.Valid) {
      statusElement = (
        <Icon
          glyph={IconFont.CheckMark_New}
          className={styles['cf-status-indicator--child']}
        />
      )
    }

    return (
      <div
        className={statusIndicatorClasses}
        data-testid={`${testID}--${status}`}
        ref={ref}
        id={id}
        style={style}
      >
        {statusElement}
        {shadowElement}
      </div>
    )
  }
)

StatusIndicator.displayName = 'GiraffeStatusIndicator'
