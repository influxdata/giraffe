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
  opacity: number
  color: string
  onXBrushEnd: (xRange: number[]) => void
  onYBrushEnd: (yRange: number[]) => void
}

export const Brush: FunctionComponent<Props> = ({
  event,
  width,
  height,
  opacity,
  color,
  onXBrushEnd,
  onYBrushEnd,
}) => {
  const isBrushing = event && event.direction

  useLayoutEffect(() => {
    if (!isBrushing || event.type !== 'dragend') {
      return
    }

    let p0
    let p1
    let callback

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

    callback([p0, p1])
  })

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
    opacity,
    backgroundColor: color,
  }

  return <div className="giraffe-brush-selection" style={selectionStyle} />
}

Brush.displayName = 'Brush'
