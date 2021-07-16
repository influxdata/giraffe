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
  onHover?: (forceHide: boolean) => void
}

// These could become configurable values
const PIN_CIRCLE_RADIUS = 4
const PIN_TRIANGLE_HEIGHT = 11
const PIN_TRIANGLE_WIDTH = 9
const RANGE_HEIGHT = 9

/**
 *  This class draws the annotation itself.  Another handles the tooltip. (AnnotationTooltip)
 *
 *  If the annotation is a 'y' annotation, then this class *only* draws a point annotation
 *  (a single dotted line) (at the start value) with an optional pin on the right.
 *
 *  If it the annotation is an 'x' annotation, if the startTime === stopTime
 *  then this class draws a single dotted line, with an optional pin at the top
 *
 *  If startTime < stopTime
 *  then this draws a line at the start, another at the end, with a 'hat' over it that is
 *  entirely clickable; along with an overlay with 10% opacity that is NOT clickable.
 *
 *  The overlay is not clickable to allow overlapping point annotations.
 *  If there are two overlapping range annotations (or any type of annotation, range or point)
 *  then the annotation that was drawn last is clickable.  (they stack).  They are drawn in the order that
 *  the annotations are created; not in their time order.
 *
 *  To make any element of the annotation line clickable, then that element needs to have the 'props.id' assigned to its id,
 *  and (nice to have, but not required for clicking, but this shows the user that it
 *  is clickable (affordance)), the style should get changed;
 *
 *  add to the 'createElement' object:
 *
 *  style: {cursor: 'pointer'}
 *
 *  the 'onHover' method is for firing when the user is hovering over
 *  a clickable area.  it sends a 'true' when the user entered a clickable area
 *  and a 'false' when it leaves.  This is so if there is a hover legend showing,
 *  then it will be hidden while on the clickable area.
 *
 *  adding the 'onHover' to the tops of the annotations that are clickable:
 *  the range rectangle and the 'start' pin for vertical annotation lines.
 *
 * */
export const AnnotationLine: FunctionComponent<AnnotationLineProps> = props => {
  const {
    dimension,
    color,
    strokeWidth,
    startValue,
    stopValue,
    length,
    pin,
    onHover = () => {},
  } = props

  // This prevents blurry sub-pixel rendering as well as clipped lines
  // If the line is at the edge of the canvas the stroke will be half obscured
  // because the stroke is centered on the line. Giving a minimum value
  // prevents the line from being clipped
  const clampedStart = Math.max(1, Math.round(startValue))
  const clampedEnd = Math.max(1, Math.round(stopValue))

  console.log('ack ack cak 776a')

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

  /**
   * This is the rectangle or 'hat' that goes on top of a range annotation.
   * The entire hat is click to edit for the annotation.
   *
   * Setting the opacity to 60%; so that the 'hat' still looks good;
   * and so that any overlapping point annotations still have their top pinned 'triangle'
   * show up well on 'top' of the hat  (you can distinguish the triangle that overlaps
   * the 'hat')
   */
  const makeRangeRectangle = () => {
    const pixelMargin = 1

    return createElement('polygon', {
      points: `${clampedStart - pixelMargin}, 0
          ${clampedEnd + pixelMargin}, 0
          ${clampedEnd + pixelMargin}, ${RANGE_HEIGHT}
          ${clampedStart - pixelMargin}, ${RANGE_HEIGHT}`,
      fill: color,
      id: props.id,
      style: {cursor: 'pointer', opacity: '60%'},
      onMouseEnter: () => {
        onHover(true)
      },
      onMouseLeave: () => {
        onHover(false)
      },
    })
  }

  // this is the overlay that goes over the whole range; with 10% opacity
  // making this click to edit will make overlapping point annotations impossible
  const makeRangeOverlay = () => {
    return createElement('polygon', {
      points: `${clampedStart}, ${length}
          ${clampedEnd}, ${length}
          ${clampedEnd}, ${RANGE_HEIGHT}
          ${clampedStart}, ${RANGE_HEIGHT}`,
      fill: color,
      opacity: 0.1,
    })
  }

  const makePin = (pinType?: string) => {
    if (!pinType) {
      pinType = pin
    }

    switch (pinType) {
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
          onMouseEnter: () => {
            onHover(true)
          },
          onMouseLeave: () => {
            onHover(false)
          },
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

  if (clampedStart === clampedEnd) {
    // point annotation:
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
  }

  // they are different (range annotation) , need two lines here
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
    </>
  )
}

export default AnnotationLine
