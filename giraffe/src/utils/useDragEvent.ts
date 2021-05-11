import * as React from 'react'
import {useRef, useCallback} from 'react'
import {useForceUpdate} from './useForceUpdate'

// Minimum number of pixels a user must drag before we decide whether the
// action is a vertical or horizontal drag
const MIN_DRAG_DELTA = 3

export interface DragEvent {
  type: 'drag' | 'dragend'
  initialX: number
  initialY: number
  direction: 'x' | 'y' | null
  x: number
  y: number
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
        'in drag event......(on mouse down...was in frustration land....)'
      )

      const el = mouseDownEvent.currentTarget

      const getXYCoords = (baseEvent) => {
        const {left, top} = el.getBoundingClientRect()

        return [baseEvent.pageX - left, baseEvent.pageY - top]
      }

      const onMouseMove = (mouseMoveEvent) => {
        const [x, y] = getXYCoords(mouseMoveEvent)

        console.log('in mouse mouse (drag event)')

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

      const onMouseUp = (mouseUpEvent) => {
        document.removeEventListener('mousemove', onMouseMove)
        document.removeEventListener('mousemove', onMouseUp)

        console.log('in on mouse up (drag event)')
        const [x, y] = getXYCoords(mouseUpEvent)

        dragEventRef.current = {
          ...dragEventRef.current,
          type: 'dragend',
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
