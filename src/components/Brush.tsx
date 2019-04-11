// Libraries
import * as React from 'react'
import {useLayoutEffect, FunctionComponent, CSSProperties} from 'react'

import {PlotEnv} from '../utils/PlotEnv'
import {DragEvent} from '../utils/useDragEvent'
import {getRectDimensions, getDomains} from '../utils/brush'

const MIN_SELECTION_SIZE = 5 // pixels

interface Props {
  event: DragEvent | null
  env: PlotEnv
  onSetXDomain: (xDomain: number[]) => void
  onSetYDomain: (yDomain: number[]) => void
}

export const Brush: FunctionComponent<Props> = ({
  event,
  env,
  onSetXDomain,
  onSetYDomain,
}) => {
  useLayoutEffect(() => {
    if (!event || event.type !== 'dragend') {
      return
    }

    const {xDomain, yDomain} = getDomains(
      event,
      env.xScale,
      env.yScale,
      env.innerWidth,
      env.innerHeight
    )

    const shouldSetXDomain =
      event.dragMode === 'brushX' &&
      Math.abs(event.initialX - event.x) >= MIN_SELECTION_SIZE

    const shouldSetYDomain =
      event.dragMode === 'brushY' &&
      Math.abs(event.initialY - event.y) >= MIN_SELECTION_SIZE

    if (shouldSetXDomain) {
      onSetXDomain(xDomain)
    }

    if (shouldSetYDomain) {
      onSetYDomain(yDomain)
    }
  })

  if (!event || !event.dragMode || event.type === 'dragend') {
    return null
  }

  const {x, y, width, height} = getRectDimensions(event, env)

  const selectionStyle: CSSProperties = {
    display: event.initialX === null ? 'none' : 'inherit',
    position: 'absolute',
    left: `${x}px`,
    width: `${width}px`,
    top: `${y}px`,
    height: `${height}px`,
    opacity: 0.1,
    backgroundColor: 'aliceblue',
  }

  return <div className="vis-brush-selection" style={selectionStyle} />
}
