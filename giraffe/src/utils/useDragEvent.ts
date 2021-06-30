import * as React from 'react'
import {useRef, useCallback} from 'react'
import {useForceUpdate} from './useForceUpdate'

// Minimum number of pixels a user must drag before we decide whether the
// action is a vertical or horizontal drag
const MIN_DRAG_DELTA = 3

/**
 * Because dragging and mouse clicks are non trivial, this implementation of DragEvent consumes the mouseDown event;
 * which means that 'onClick' doesn't work for anything that uses these events.
 *
 * We can compensate for that by having a listener for 'onMouseUpEnd' for the consumer of this event (see Brush)
 *
 * But in order to differentiate between a drag and a click, we need to pair up the mouseDowns with the MouseUps and
 * only allow 'legal' mouseUps with the mouseActionState.
 *
 * A 'mouseUp' is only legal if it can be paired with a previous "mouseDown".
 *
 * If a 'mouseUp' happens after another 'mouseUp' (without a "mouseDown" in between)
 * then it is not legal and the 'mouseActionState' will be null.
 *
 * The consumer (Brush, in this example) keeps track of whether or not the drag happens.
 *
 * We need differentiation because:
 *
 * The issue is that when the drag is over, both the onBrushEnd (x or y) and then the
 * onMouseUpEnd handlers get triggered; because of multiple mouseUp events.
 *
 * We want one or the other, not both. (a response to a range drag or to a single click)
 *
 * Each time there is a drag, there is ONE mouseDownEvent, then mousemove events, then one MouseUp Event that
 * triggers the onBrushEnd.
 *
 * Most of the time, there are additional onMouseUpEvents after that. (we will call them phantom mouseUps)
 *
 * We only want the first onMouseUp event to be legal.
 * So we check that the previous 'mouseActionState' was a mouseDownEvent ('mouseDownHappened'), and if so set the mouse state to a 'mouseUpHappened'.
 *
 * When the next mouseUp Event happens (without a proper, previous matching mouseDown Event),
 * then mouseActionState will be set to null.
 *
 * When the singleclick happens, it will check if the mouseActionState says 'mouseDownHappened'; if so; then it is a legal
 * mouseUp; and the mouseActionState will be set to 'mouseUpHappened'.  If the mouse state is *anything* other then ''mouseDownHappened', then
 * the mouseActionState is set to null.
 *
 * The consumer checks the mouseActionState, and only fires the event if the mouseActionState is 'mouseUpHappened'
 *
 * And thus we have some history and can pair mouse ups with mouse downs and assure that phantom clicks
 * do not cause wonky behavior.
 *
 * Removing the phantom clicks entirely is a MUCH harder problem; because this is a clicker used by people with events.
 *
 * We are putting the mouseEvent into the event so that the consumer for the 'onMouseUpEnd' can use it, since that consumer
 * is a mouseListener and needs the mouseEvent information.
 *
 * isShiftDown is added for mouse down events
 */

export interface DragEvent {
  type: 'drag' | 'dragend'
  initialX: number
  initialY: number
  direction: 'x' | 'y' | null
  x: number
  y: number
  mouseActionState: 'mouseUpHappened' | 'mouseDownHappened' | null
  mouseEvent?: React.MouseEvent
  isShiftDown?: boolean
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

      const el = mouseDownEvent.currentTarget

      const getXYCoords = baseEvent => {
        const {left, top} = el.getBoundingClientRect()

        return [baseEvent.pageX - left, baseEvent.pageY - top]
      }

      const onMouseMove = mouseMoveEvent => {
        const [x, y] = getXYCoords(mouseMoveEvent)

        const {initialX, initialY} = dragEventRef.current
        let {direction} = dragEventRef.current

        if (!direction) {
          const dx = Math.abs(x - initialX)
          const dy = Math.abs(y - initialY)

          if (dx >= dy && dx > MIN_DRAG_DELTA) {
            direction = 'x'
          } else if (dy > MIN_DRAG_DELTA) {
            direction = 'y'
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
        document.removeEventListener('mouseup', onMouseUp)

        const [x, y] = getXYCoords(mouseUpEvent)

        let mouseActionState = null

        if (dragEventRef?.current?.mouseActionState === 'mouseDownHappened') {
          mouseActionState = 'mouseUpHappened'
        }

        dragEventRef.current = {
          ...dragEventRef.current,
          type: 'dragend',
          mouseActionState,
          x,
          y,
          mouseEvent: mouseUpEvent,
        }

        forceUpdate()
      }

      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', onMouseUp)

      const [x, y] = getXYCoords(mouseDownEvent)
      const isShiftDown = mouseDownEvent.getModifierState('Shift')

      // TODO:  even though the 'isShiftDown' gets reset with each mousedown,
      // incase other mouse events/triggers/callbacks want to use the shift key, make sure to set
      // it to false in all the other places where events are emitted to reset it properly!
      dragEventRef.current = {
        type: 'drag',
        initialX: x,
        initialY: y,
        x,
        y,
        direction: null,
        mouseActionState: 'mouseDownHappened',
        isShiftDown,
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
