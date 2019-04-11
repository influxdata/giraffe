import {Scale} from '../types'
import {PlotEnv} from '../utils/PlotEnv'
import {DragEvent} from '../utils/useDragEvent'

export const getRectDimensions = (event: DragEvent, env: PlotEnv) => {
  if (event.dragMode === 'brushX') {
    const x = Math.max(0, Math.min(event.initialX, event.x))

    const width = Math.min(
      Math.max(event.initialX, event.x) - x,
      env.innerWidth - x
    )

    return {
      x,
      y: 0,
      width,
      height: env.innerHeight,
    }
  }

  if (event.dragMode === 'brushY') {
    const y = Math.max(0, Math.min(event.initialY, event.y))

    const height = Math.min(
      Math.max(event.initialY, event.y) - y,
      env.innerHeight - y
    )

    return {
      x: 0,
      y,
      width: env.innerWidth,
      height: height,
    }
  }

  return null
}

export const getDomains = (
  event: DragEvent,
  xScale: Scale<number, number>,
  yScale: Scale<number, number>,
  width: number,
  height: number
): {xDomain: number[]; yDomain: number[]} => ({
  xDomain: [
    xScale.invert(Math.max(Math.min(event.initialX, event.x), 0)),
    xScale.invert(Math.min(Math.max(event.initialX, event.x), width)),
  ],
  yDomain: [
    yScale.invert(Math.min(Math.max(event.initialY, event.y), height)),
    yScale.invert(Math.max(Math.min(event.initialY, event.y), 0)),
  ],
})
