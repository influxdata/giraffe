import React, {FunctionComponent} from 'react'
import {AnnotationDimension, AnnotationPinType} from '../types'

interface AnnotationLineProps {
  dimension: AnnotationDimension
  stroke: string
  strokeWidth: number
  startValue: number
  stopValue: number
  length: number
  pin: AnnotationPinType
}

export const AnnotationLine: FunctionComponent<AnnotationLineProps> = props => {
  const {dimension, stroke, strokeWidth, startValue, length} = props

  // This prevents blurry sub-pixel rendering as well as clipped lines
  // If the line is at the edge of the canvas the stroke will be half obscured
  // because the stroke is centered on the line. Giving a minimum value
  // prevents the line from being clipped
  const trimmedStart = Math.max(1, Math.round(startValue))

  if (dimension === 'y') {
    return (
      <line
        x1="0"
        x2={length}
        y1={trimmedStart}
        y2={trimmedStart}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
    )
  }

  return (
    <line
      x1={trimmedStart}
      x2={trimmedStart}
      y1="0"
      y2={length}
      stroke={stroke}
      strokeWidth={strokeWidth}
    />
  )
}

export default AnnotationLine
