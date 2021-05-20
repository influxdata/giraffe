import React, {FunctionComponent, createElement} from 'react'
import {AnnotationDimension, AnnotationPinType} from '../types'

import styles from './AnnotationLine.scss'

interface AnnotationLineProps {
  dimension: AnnotationDimension
  color: string
  secondaryColor?: string
  strokeWidth: number
  startValue: number
  stopValue: number
  length: number
  pin: AnnotationPinType
  id: string
}

// These could become configurable values
const PIN_CIRCLE_RADIUS = 4
const PIN_TRIANGLE_HEIGHT = 8
const PIN_TRIANGLE_WIDTH = 6
const LARGER_RADIUS = 6

export const AnnotationLine: FunctionComponent<AnnotationLineProps> = props => {
  const {
    dimension,
    color,
    secondaryColor,
    strokeWidth,
    startValue,
    stopValue,
    length,
    pin,
  } = props

  // This prevents blurry sub-pixel rendering as well as clipped lines
  // If the line is at the edge of the canvas the stroke will be half obscured
  // because the stroke is centered on the line. Giving a minimum value
  // prevents the line from being clipped
  const clampedStart = Math.max(1, Math.round(startValue))
  const clampedEnd = Math.max(1, Math.round(stopValue))

  if (dimension === 'y') {
    return (
      <>
        <line
          x1="0"
          x2={length}
          y1={clampedStart}
          y2={clampedStart}
          stroke={color}
          strokeWidth={strokeWidth}
          id={props.id}
          className={`${styles['giraffe-annotation-hover']} giraffe-annotation-line`}
        />
        {pin === 'circle' &&
          createElement('circle', {
            r: PIN_CIRCLE_RADIUS,
            fill: color,
            cx: length - PIN_CIRCLE_RADIUS,
            cy: clampedStart,
          })}
        {pin === 'start' &&
          createElement('polygon', {
            points: `${length - PIN_TRIANGLE_HEIGHT}, ${clampedStart} ${length -
              PIN_TRIANGLE_HEIGHT / 2}, ${clampedStart +
              PIN_TRIANGLE_WIDTH} ${length}, ${clampedStart}`,
            fill: color,
            style: {cursor: 'pointer'},
            id: props.id,
            className: 'giraffe-annotation-click-target',
          })}
        {pin === 'stop' &&
          createElement('polygon', {
            points: `${length - PIN_TRIANGLE_HEIGHT}, ${clampedStart} ${length -
              PIN_TRIANGLE_HEIGHT / 2}, ${clampedStart -
              PIN_TRIANGLE_WIDTH} ${length}, ${clampedStart}`,
            fill: color,
          })}
      </>
    )
  }

  // dimension is x:
  const xProps = {
    x1: clampedStart,
    x2: clampedStart,
    y1: '0',
    y2: length,
    stroke: color,
    strokeWidth,
    id: props.id,
    className: `${styles['giraffe-annotation-hover']} giraffe-annotation-line`,
  }

  // this is the rectangle that goes on top of a range annotation
  const makeRangeRectangle = () => {
    return createElement('polygon', {
      points: `${clampedStart}, 0
          ${clampedEnd}, 0
          ${clampedEnd}, ${PIN_TRIANGLE_HEIGHT}
          ${clampedStart}, ${PIN_TRIANGLE_HEIGHT}`,
      fill: secondaryColor,
      id: props.id,
    })
  }

  // this is the overlay that goes over the whole range; with 10% opacity
  const makeRangeOverlay = () => {
    return createElement('polygon', {
      points: `${clampedStart}, ${length}
          ${clampedEnd}, ${length}
          ${clampedEnd}, ${PIN_TRIANGLE_HEIGHT}
          ${clampedStart}, ${PIN_TRIANGLE_HEIGHT}`,
      fill: secondaryColor,
      id: props.id,
      opacity: 0.1,
      style: {cursor: 'pointer'},
      className: 'giraffe-annotation-click-target',
    })
  }

  const makePin = (pinType?: string, timeSignature?: number) => {
    if (!timeSignature) {
      timeSignature = clampedStart
    }
    if (!pinType) {
      pinType = pin
    }

    switch (pinType) {
      case 'circle':
        return createElement('circle', {
          r: PIN_CIRCLE_RADIUS,
          fill: color,
          cx: timeSignature,
          cy: PIN_CIRCLE_RADIUS,
        })
      case 'start':
        return createElement('polygon', {
          points: `${timeSignature - PIN_TRIANGLE_WIDTH}, 0
          ${timeSignature + PIN_TRIANGLE_WIDTH}, 0
          ${timeSignature}, ${PIN_TRIANGLE_HEIGHT}`,
          fill: color,
          style: {cursor: 'pointer'},
          id: props.id,
          className: 'giraffe-annotation-click-target',
        })
      case 'stop':
        return createElement('polygon', {
          points: `${timeSignature}, 0 ${timeSignature -
            PIN_TRIANGLE_WIDTH}, ${PIN_TRIANGLE_HEIGHT /
            2} ${timeSignature}, ${PIN_TRIANGLE_HEIGHT}`,
          fill: color,
        })
      default:
        return null
    }
  }
  if (clampedStart === clampedEnd) {
    return (
      // a separate line layer on the annotation line is required on top,
      // because the dashed line doesnt allow for a continuous click-able target
      // this top layer has an opacity of 0 so is not visible.
      <>
        <line {...xProps} strokeOpacity={0} />
        <line {...xProps} strokeDasharray={'4'} />
        {makePin()}
      </>
    )
  } else {
    // they are different, need two lines here
    const x2Props = {
      ...xProps,
      x1: clampedEnd,
      x2: clampedEnd,
    }
    return (
      <>
        <line {...xProps} strokeOpacity={0} />
        <line {...xProps} strokeDasharray={'4'} />
        <line {...x2Props} strokeOpacity={0} />
        <line {...x2Props} strokeDasharray={'4'} />
        {makeRangeOverlay()}
        {makeRangeRectangle()}
        {makePin()}
        {makePin('start', clampedEnd)}
      </>
    )
  }
}

export default AnnotationLine
