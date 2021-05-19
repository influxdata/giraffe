import React, {FunctionComponent, createElement} from 'react'
import {AnnotationDimension, AnnotationPinType} from '../types'

import styles from './AnnotationLine.scss'

interface AnnotationLineProps {
  dimension: AnnotationDimension
  color: string
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

export const AnnotationLine: FunctionComponent<AnnotationLineProps> = props => {
  const {
    dimension,
    color,
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

  console.log('using xProps...jill-foo 32 aab-1')

  const makePin = () => {
    switch (pin) {
      case 'circle':
        return createElement('circle', {
          r: PIN_CIRCLE_RADIUS,
          fill: color,
          cx: clampedStart,
          cy: PIN_CIRCLE_RADIUS,
        })
      case 'start':
        return createElement('polygon', {
          points: `${clampedStart - PIN_TRIANGLE_WIDTH}, 0
          ${clampedStart + PIN_TRIANGLE_WIDTH}, 0
          ${clampedStart}, ${PIN_TRIANGLE_HEIGHT}`,
          fill: color,
          style: {cursor: 'pointer'},
          id: props.id,
          className: 'giraffe-annotation-click-target',
        })
      case 'stop':
        return createElement('polygon', {
          points: `${clampedStart}, 0 ${clampedStart -
            PIN_TRIANGLE_WIDTH}, ${PIN_TRIANGLE_HEIGHT /
            2} ${clampedStart}, ${PIN_TRIANGLE_HEIGHT}`,
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
    //they are different, need two lines here
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
      </>
    )
  }
}

export default AnnotationLine
