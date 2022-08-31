// Libraries
import React, {
  FunctionComponent,
  useRef,
  useState,
  useEffect,
  UIEvent,
} from 'react'
import classnames from 'classnames'
import Scrollbar from 'react-scrollbars-custom'
import {ScrollState} from 'react-scrollbars-custom/dist/types/types'

import {StandardFunctionProps} from '../../types'
import {ComponentSize} from '../../types'
import {InfluxColors} from '../../constants/colorSchemes'
import styles from './DapperScrollbars.scss'

import {styleReducer} from '../../utils/styleReducer'

// Types
type UIEventHandler = (event: UIEvent<HTMLDivElement>) => void
type ScrollStateEventHandler = (
  scrollValues: ScrollState,
  prevScrollValues?: ScrollState
) => void

type FusionScrollHandler = UIEventHandler & ScrollStateEventHandler

interface DapperScrollbarsProps extends StandardFunctionProps {
  /** Toggle display of tracks when no scrolling is necessary */
  removeTracksWhenNotUsed?: boolean
  /** Toggle display of vertical track when no scrolling is necessary */
  removeTrackYWhenNotUsed?: boolean
  /** Toggle display of horizontal track when no scrolling is necessary */
  removeTrackXWhenNotUsed?: boolean
  /** Disable scrolling horizontally */
  noScrollX?: boolean
  /** Disable scrolling vertically */
  noScrollY?: boolean
  /** Disable scrolling */
  noScroll?: boolean
  /** Gradient start color */
  thumbStartColor?: string | InfluxColors
  /** Gradient end color */
  thumbStopColor?: string | InfluxColors
  /** Hide scrollbar when not actively scrolling */
  autoHide?: boolean
  /** Scroll container will grow to fit the content width and height */
  autoSize?: boolean
  /** Scroll container will grow to fit the content width */
  autoSizeWidth?: boolean
  /** Scroll container will grow to fit the content height */
  autoSizeHeight?: boolean
  /** Vertical scroll position in pixels */
  scrollTop?: number
  /** Horizontal scroll position in pixels */
  scrollLeft?: number
  /** Function to be called when called scroll event fires */
  onScroll?: Function
  /** Function called after component updated */
  onUpdate?: Function
  /** Component Size **/
  size?: ComponentSize
}

export const DapperScrollbars: FunctionComponent<DapperScrollbarsProps> = ({
  id,
  style,
  children,
  className,
  onScroll,
  onUpdate,
  scrollTop = 0,
  scrollLeft = 0,
  autoHide = false,
  autoSize = false,
  noScroll = false,
  noScrollX = false,
  noScrollY = false,
  autoSizeWidth = false,
  autoSizeHeight = false,
  thumbStopColor = 'rgba(255, 255, 255, 0.25)',
  thumbStartColor = 'rgba(255, 255, 255, 0.25)',
  testID = 'dapper-scrollbars',
  removeTracksWhenNotUsed = true,
  removeTrackYWhenNotUsed = true,
  removeTrackXWhenNotUsed = true,
  size = ComponentSize.Small,
}) => {
  const scrollEl = useRef<any>(null)
  // State is used here to ensure that the scroll position does not jump when
  // a component using DapperScrollbars re-renders
  const [scrollTopPos, setScrollTopPos] = useState<number>(Number(scrollTop))
  const [scrollLeftPos, setScrollLeftPos] = useState<number>(Number(scrollLeft))

  useEffect(() => {
    if (scrollTop >= 0) {
      setScrollTopPos(Number(scrollTop))
    }
  }, [scrollTop])

  useEffect(() => {
    setScrollLeftPos(Number(scrollLeft))
  }, [scrollLeft])

  let dapperScrollbarsClasses = classnames('cf-dapper-scrollbars', {
    'cf-dapper-scrollbars--autohide': autoHide,
    [`cf-dapper-scrollbars--${size}`]: size,
  })
    .split(' ')
    .reduce((accum, current) => styleReducer(styles, accum, current), '')

  dapperScrollbarsClasses =
    typeof className === 'string'
      ? `${dapperScrollbarsClasses} ${className}`
      : dapperScrollbarsClasses

  const thumbXStyle = {
    background: `linear-gradient(to right,  ${thumbStartColor} 0%,${thumbStopColor} 100%)`,
  }

  const thumbYStyle = {
    background: `linear-gradient(to bottom,  ${thumbStartColor} 0%,${thumbStopColor} 100%)`,
  }

  const handleOnScroll = (
    scrollValues: ScrollState,
    prevScrollValues: ScrollState
  ) => {
    if (onScroll) {
      onScroll(scrollValues, prevScrollValues)
    }

    const {scrollTop, scrollLeft} = scrollValues
    setScrollTopPos(scrollTop)
    setScrollLeftPos(scrollLeft)
  }

  const handleUpdate = (scrollValues, prevScrollValues) => {
    if (onUpdate) {
      onUpdate(scrollValues, prevScrollValues)
    }
  }

  return (
    <Scrollbar
      ref={scrollEl}
      onScroll={handleOnScroll as FusionScrollHandler}
      onUpdate={handleUpdate}
      data-testid={testID}
      translateContentSizesToHolder={autoSize}
      translateContentSizeYToHolder={autoSizeHeight}
      translateContentSizeXToHolder={autoSizeWidth}
      className={dapperScrollbarsClasses}
      style={style}
      noDefaultStyles={false}
      removeTracksWhenNotUsed={removeTracksWhenNotUsed}
      removeTrackYWhenNotUsed={removeTrackYWhenNotUsed}
      removeTrackXWhenNotUsed={removeTrackXWhenNotUsed}
      noScrollX={noScrollX}
      noScrollY={noScrollY}
      noScroll={noScroll}
      wrapperProps={{className: styles['cf-dapper-scrollbars--wrapper']}}
      contentProps={{className: styles['cf-dapper-scrollbars--content']}}
      trackXProps={{className: styles['cf-dapper-scrollbars--track-x']}}
      thumbXProps={{
        renderer: props => {
          const {elementRef, style, ...restProps} = props
          const thumbStyle = {...style, ...thumbXStyle}
          return (
            <div
              className={styles['cf-dapper-scrollbars--thumb-x']}
              ref={elementRef}
              style={thumbStyle}
              {...restProps}
              data-testid={`${testID}--thumb-x`}
            />
          )
        },
      }}
      trackYProps={{className: styles['cf-dapper-scrollbars--track-y']}}
      thumbYProps={{
        renderer: props => {
          const {elementRef, style, ...restProps} = props
          const thumbStyle = {...style, ...thumbYStyle}
          return (
            <div
              className={styles['cf-dapper-scrollbars--thumb-y']}
              ref={elementRef}
              style={thumbStyle}
              {...restProps}
              data-testid={`${testID}--thumb-y`}
            />
          )
        },
      }}
      scrollTop={scrollTopPos}
      scrollLeft={scrollLeftPos}
      id={id}
      download={null}
      inlist={null}
    >
      {children}
    </Scrollbar>
  )
}

DapperScrollbars.displayName = 'GiraffeDapperScrollbars'
