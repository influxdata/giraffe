import * as React from 'react'
import {useRef, useCallback} from 'react'
import {useForceUpdate} from './useForceUpdate'

// Minimum number of pixels a user must drag before we decide whether the
// action is a vertical or horizontal drag
const MIN_DRAG_DELTA = 3

/**
 * Because dragging and mouse clicks are non trivial, this implementation of DragEvent consumes the mouseDown event
 * which means that 'onClick' doesn't work for anything that uses these events.
 *
 * We can compensate for that by having a listener for 'onMouseUpEnd' for the consumer of this event (see Brush)
 *
 * but in order to differentiate between a drag and a click, we need to pair up the mouseDowns with the MouseUps and
 * state which one is 'legal' with the mouseState.
 *
 * a 'mouseDown' is only legal if before it a "mouseUp" happened.
 *
 * if a 'mouseDown' happens after another 'mouseDown' (without a "mouseUp" in between)
 * then it is not legal and the 'mouseState' will be null.
 *
 * the consumer (Brush, in this example) keeps track of whether or not the drag happens.
 *
 *
 * We need differentiation because:
 *
 * the issue is that when the drag is over, both the onBrushEnd (x or y) and then the
 * onMouseUpEnd handlers get triggered.
 *
 * we want one or the other, not both. (a response to a range drag or to a single click)
 *
 * Each time there is a drag, there is ONE mouseDownEvent, then mousemove events, then one MouseUp Event that
 * triggers the onBrushEnd.
 *
 * most of the time, there are additional onMouseUpEvents after that. (i will call them phantom mouseUps)
 *
 * we only want the first onMouseUp event to be legal.
 * so we check that the previous 'mouseState' was a mouseDownEvent, and if so set the mouse state to a mouseUpHappened.
 *
 * when the next mouseUp Event happens (without a proper mouseUp Event), then mouseState will be set to null
 *
 * when the singleclick happens, it will check if the mouseState says 'mouseDownHappened'; if so; then it is a legal
 * mouseDown with a corresponding mouseUpHappened.
 * if the mouseState is null, then it is a phantom click; so nothing will happen.
 *
 * and thus we have some history and can pair mouse ups with mouse downs and assure that phantom clicks
 * do not cause wonky behavior.
 *
 * removing the phantom clicks entirely is a MUCH harder problem; because this is a clicker used by people with events.
 */

export interface DragEvent {
  type: 'drag' | 'dragend'
  initialX: number
  initialY: number
  direction: 'x' | 'y' | null
  x: number
  y: number
  mouseState: 'mouseUpHappened' | 'mouseDownHappened' | null
}

interface UseDragEventProps {
  onMouseDown: (e: React.MouseEvent<Element, MouseEvent>) => any
}

export const useDragEvent = (): [DragEvent | null, UseDragEventProps] => {
  const dragEventRef = useRef<DragEvent | null>(null)
  const forceUpdate = useForceUpdate()

  const onMouseDown = useCallback(
    (mouseDownEvent: React.MouseEvent<Element, MouseEvent>) => {
      mouseDownEvent.stopPropagation()

      console.log(
        'AA-1 in drag event......(on mouse down...was in frustration land....)'
      )

      const el = mouseDownEvent.currentTarget

      const getXYCoords = baseEvent => {
        const {left, top} = el.getBoundingClientRect()

        return [baseEvent.pageX - left, baseEvent.pageY - top]
      }

      const onMouseMove = mouseMoveEvent => {
        const [x, y] = getXYCoords(mouseMoveEvent)

        console.log('BB-1 in on mouse move (drag event) ack-42a')

        const {initialX, initialY} = dragEventRef.current
        let {direction} = dragEventRef.current

        if (!direction) {
          const dx = Math.abs(x - initialX)
          const dy = Math.abs(y - initialY)
          console.log('moving......dx & dy', dx, dy)

          if (dx >= dy && dx > MIN_DRAG_DELTA) {
            direction = 'x'
            console.log('direction set to x')
          } else if (dy > MIN_DRAG_DELTA) {
            direction = 'y'
            console.log('direction set to y')
          } else {
            //not really moving....set to notMoving! (none)
            console.log('no direction here....(none) ack-42!')
          }
        }

        dragEventRef.current = {
          ...dragEventRef.current,
          type: 'drag',
          direction,
          x,
          y,
        }

        forceUpdate()
      }

      const onMouseUp = mouseUpEvent => {
        document.removeEventListener('mousemove', onMouseMove)
        document.removeEventListener('mousemove', onMouseUp)

        console.log('CC-1 in on mouse up (drag event)')
        const [x, y] = getXYCoords(mouseUpEvent)

        let mouseState = null

        if (dragEventRef?.current?.mouseState === 'mouseUpHappened') {
          mouseState = 'mouseDownHappened'
        }

        dragEventRef.current = {
          ...dragEventRef.current,
          type: 'dragend',
          mouseState,
          x,
          y,
        }

        forceUpdate()
      }

      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', onMouseUp)

      const [x, y] = getXYCoords(mouseDownEvent)

      dragEventRef.current = {
        type: 'drag',
        initialX: x,
        initialY: y,
        x,
        y,
        direction: null,
        mouseState: 'mouseUpHappened',
      }

      forceUpdate()
    },
    []
  )

  const {current: dragEvent} = dragEventRef

  if (dragEvent && dragEvent.type === 'dragend') {
    // 'dragEnd' events should be emitted exactly once at the end of a drag
    dragEventRef.current = null
  }

  return [dragEvent, {onMouseDown}]
}
