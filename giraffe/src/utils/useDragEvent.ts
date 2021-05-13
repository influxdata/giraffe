import * as React from 'react'
import {useRef, useCallback} from 'react'
import {useForceUpdate} from './useForceUpdate'

// Minimum number of pixels a user must drag before we decide whether the
// action is a vertical or horizontal drag
const MIN_DRAG_DELTA = 3

/**
 * inprogress says that a drag is happening
 *
 * the issue is that when the drag is over, both the onBrushEnd (x or y) and then the
 * onMouseUp handlers get triggered.
 *
 * if we are doing a drag with an area, we DON'T want the onMouseUp handler triggered
 * if we are doing just a single click, then a dragEvent is triggered (the mouseDownEvent propagation stopping
 * prevents a normal onClick listener from working; and even if that wasn't there then the onClick would get triggered
 * with each drag; which we DON"T want happening)
 *
 * but with a single click, the onBrushEnd(x,y) is not triggered; because there is an onMouseMoveEvent
 *
 * so, there is one onMouseDown event, then potentially mousemove events,
 * then the dragEnd happens, and the consuming code can tell if the brushEnd(x or y) needs to be called,
 * but whether it maved or not the onMouseUpEnd is called (it can't tell if its the end of a single click or
 * the end of a zoom.
 *
 * but, since there is only ONE mouseDown, we set inProgress to true when that happens, then after the brushEnd we set it to false
 *
 * and the onMouseUpEnd checks if inprogress is true (was it already consumed by brushEnd?)
 * if inProgress is true; then call onMouseUpEnd (and set inProgress to false), else do nothing.
  */


export interface DragEvent {
  type: 'drag' | 'dragend'
  initialX: number
  initialY: number
  direction: 'x' | 'y' | null
  x: number
  y: number
    inProgress: 'mouseUpHappened' | 'mouseDownHappened' | null
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

          let inProgress = null;

         
            if (dragEventRef?.current?.inProgress === 'mouseUpHappened') {
                inProgress = 'mouseDownHappened'
            }


        dragEventRef.current = {
          ...dragEventRef.current,
          type: 'dragend',
            inProgress,
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
          inProgress: 'mouseUpHappened'
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
