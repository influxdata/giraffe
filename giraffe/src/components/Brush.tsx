// Libraries
import * as React from 'react'
import {useLayoutEffect, FunctionComponent, CSSProperties} from 'react'

import {DragEvent} from '../utils/useDragEvent'
import {getRectDimensions} from '../utils/brush'

const MIN_SELECTION_SIZE = 5 // pixels

interface Props {
  event: DragEvent | null
  width: number
  height: number
  onXBrushEnd: (xRange: number[]) => void
  onYBrushEnd: (yRange: number[]) => void
  onMouseUpEnd?: () => void
}

export const Brush: FunctionComponent<Props> = ({
  event,
  width,
  height,
  onXBrushEnd,
  onYBrushEnd,
  onMouseUpEnd,
}) => {
  const isBrushing = event && event.direction

  // debounce a function WITHOUT ARGS
  // rolling our own, not using lodash b/c lodash is large and not included in giraffe
  function debounce(func, timeout = 300) {
    let timer
    return () => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        func()
      }, timeout)
    }
  }

  const debouncedOnMouseUpEnd = debounce(onMouseUpEnd)

  useLayoutEffect(() => {
    if (event?.type !== 'dragend') {
      console.log('the event (not dragend).....(ack-42-1)', event)
      return
    }

    console.log('the event (dragEnd! :).....(ack-42)', event)

    if (isBrushing) {
      console.log('got to main action! (woohoo!) ACK')
      let callback
      let p0
      let p1

      if (event.direction === 'x') {
        p0 = Math.min(event.initialX, event.x)
        p1 = Math.max(event.initialX, event.x)
        callback = onXBrushEnd
      } else if (event.direction === 'y') {
        p0 = Math.min(event.initialY, event.y)
        p1 = Math.max(event.initialY, event.y)
        callback = onYBrushEnd
      } else {
        return
      }

      if (p1 - p0 < MIN_SELECTION_SIZE) {
        return
      }
      console.log('brushing now!!!')
      callback([p0, p1])
    } else {
      console.log('not brushing, but over.... (call onMouseUpEnd here)')
      console.log('in progress???', event.mouseState)
      if (event.mouseState === 'mouseDownHappened') {
        console.log('DD-1 for reals!')
        //want to elicit an onMouseUpEnd callback here

        //TODO:  remove debounce.  pairing up mouse downs with ups removes the need for one.
        debouncedOnMouseUpEnd()
      } else {
        console.log('EE-1 ......phantom click.  DO NOTHING')
      }
    }
  }, [event?.type])

  if (!isBrushing || event.type === 'dragend') {
    return null
  }

  const {x, y, width: brushWidth, height: brushHeight} = getRectDimensions(
    event,
    width,
    height
  )

  const selectionStyle: CSSProperties = {
    display: event.initialX === null ? 'none' : 'inherit',
    position: 'absolute',
    left: `${x}px`,
    width: `${brushWidth}px`,
    top: `${y}px`,
    height: `${brushHeight}px`,
    opacity: 0.1,
    backgroundColor: 'aliceblue',
  }

  return <div className="giraffe-brush-selection" style={selectionStyle} />
}

Brush.displayName = 'Brush'
