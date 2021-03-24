import React, {FunctionComponent, createElement} from 'react'
import {AnnotationDimension, AnnotationPinType} from '../types'

interface AnnotationLineProps {
  dimension: AnnotationDimension
  color: string
  strokeWidth: number
  startValue: number
  stopValue: number
  length: number
  pin: AnnotationPinType
}

// These could become configurable values
const PIN_CIRCLE_RADIUS = 4
const PIN_TRIANGLE_HEIGHT = 10
const PIN_TRIANGLE_WIDTH = 6

export const AnnotationLine: FunctionComponent<AnnotationLineProps> = props => {
  const {dimension, color, strokeWidth, startValue, length, pin} = props

  // This prevents blurry sub-pixel rendering as well as clipped lines
  // If the line is at the edge of the canvas the stroke will be half obscured
  // because the stroke is centered on the line. Giving a minimum value
  // prevents the line from being clipped
  const clampedStart = Math.max(1, Math.round(startValue))

  if (dimension === 'y') {
    return (
      <>
        {pin === 'circle' &&
          createElement('circle', {
            r: PIN_CIRCLE_RADIUS,
            fill: color,
            cx: length - PIN_CIRCLE_RADIUS,
            cy: clampedStart,
          })}
        {pin === 'start' &&
          createElement('polygon', {
            points: `${length - PIN_TRIANGLE_HEIGHT},${clampedStart} ${length -
              PIN_TRIANGLE_HEIGHT / 2},${clampedStart +
              PIN_TRIANGLE_WIDTH} ${length},${clampedStart}`,
            fill: color,
          })}
        {pin === 'stop' &&
          createElement('polygon', {
            points: `${length - PIN_TRIANGLE_HEIGHT},${clampedStart} ${length -
              PIN_TRIANGLE_HEIGHT / 2},${clampedStart -
              PIN_TRIANGLE_WIDTH} ${length},${clampedStart}`,
            fill: color,
          })}
        <line
          x1="0"
          x2={length}
          y1={clampedStart}
          y2={clampedStart}
          stroke={color}
          strokeWidth={strokeWidth}
        />
      </>
    )
  }

  return (
    <>
      {pin === 'circle' &&
        createElement('circle', {
          r: PIN_CIRCLE_RADIUS,
          fill: color,
          cx: clampedStart,
          cy: PIN_CIRCLE_RADIUS,
        })}
      {pin === 'start' &&
        createElement('polygon', {
          points: `${clampedStart - PIN_TRIANGLE_WIDTH},0
          ${clampedStart + PIN_TRIANGLE_WIDTH},0 
          ${clampedStart},${PIN_TRIANGLE_HEIGHT}`,
          onClick: (event) => {
            event.nativeEvent.stopImmediatePropagation();
            console.log("thing clicked")},
          fill: color,
        })}
      {pin === 'stop' &&
        createElement('polygon', {
          points: `${clampedStart},0 ${clampedStart -
            PIN_TRIANGLE_WIDTH},${PIN_TRIANGLE_HEIGHT /
            2} ${clampedStart},${PIN_TRIANGLE_HEIGHT}`,
          fill: color,
        })}
      <line
        x1={clampedStart}
        x2={clampedStart}
        y1="0"
        y2={length}
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </>
  )
}

export default AnnotationLine
