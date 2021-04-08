import {AnnotationMark, LineHoverDimension, Scale} from '../types'
import {min} from 'd3-array'

export const getAnnotationsPositions = (
  annotationData: AnnotationMark[],
  xScale: Scale,
  yScale: Scale
): AnnotationMark[] => {
  const annotationMarks: AnnotationMark[] = []

  annotationData.forEach(annotation => {
    annotationMarks.push({
      ...annotation,
      pin: annotation.pin || 'none',
      startValue:
        annotation.dimension === 'y'
          ? yScale(annotation.startValue)
          : xScale(annotation.startValue),
      stopValue:
        annotation.dimension === 'y'
          ? yScale(annotation.stopValue)
          : xScale(annotation.stopValue),
    })
  })
  return annotationMarks
}

const isWithinHoverableArea = (
  startValue: number,
  stopValue: number,
  margin: number,
  hoverPosition: number
): boolean => {
  return (
    startValue - margin <= hoverPosition && stopValue + margin >= hoverPosition
  )
}

const distanceToMousePointer = (
  annotationMark: AnnotationMark,
  hoverPosition: number
) => {
  // check if the Annotation is a range type
  if (annotationMark.startValue !== annotationMark.stopValue) {
    if (
      annotationMark.startValue <= hoverPosition &&
      hoverPosition <= annotationMark.stopValue
    ) {
      // hover position is in the range, effective distance is 0
      return 0
    } else {
      // distance is the shortest of:
      // the distance between hoverPosition and annotation.startValue,
      // and the distance between hoverPosition and annotation.stopValue
      const distanceToStartLine = Math.abs(
        hoverPosition - annotationMark.startValue
      )
      const distanceToStopLine = Math.abs(
        hoverPosition - annotationMark.stopValue
      )
      return Math.min(distanceToStartLine, distanceToStopLine)
    }
  }
  return Math.abs(hoverPosition - annotationMark.startValue)
}

/***********************************************************************************
 * ANNOTATIONS HOVERING
 *
 * hover dimension 'xy' means find annotations only near the mouse position
 * hover dimension 'x' means find annotations along the x-axis at mouse position
 * hover dimension 'y' means find annotations along the y-axis at mouse position
 * hover dimension 'auto' means 'xy' see above
 *
 * Check to see if mouse position is within annotation's hoverable area only when
 *   hover dimension is 'xy' or hover dimension is same as annotation dimension
 *
 * Cross dimensions means the annotation is always hovered, occurs when:
 *   hover dimension is 'x' && annotation dimension is 'y'
 *   hover dimension is 'y' && annotation dimension is 'x'
 *
 */
export const getAnnotationHoverIndices = (
  hoverDimension: LineHoverDimension,
  hoverMargin: number,
  annotationData: AnnotationMark[],
  hoverX: number,
  hoverY: number
): number[] => {
  return Array.isArray(annotationData)
    ? annotationData.reduce((result, annotation, i) => {
        if (hoverX === null || hoverY === null) {
          return result
        }
        const {dimension, startValue, stopValue} = annotation
        if (
          (hoverDimension !== 'xy' && hoverDimension !== dimension) ||
          ((hoverDimension === 'xy' || hoverDimension === dimension) &&
            isWithinHoverableArea(
              startValue,
              stopValue,
              hoverMargin,
              dimension === 'x' ? hoverX : hoverY
            ))
        ) {
          result.push(i)

          if (result.length > 1) {
            const distances = []
            result.forEach(i => {
              const dist = distanceToMousePointer(
                annotationData[i],
                dimension === 'x' ? hoverX : hoverY
              )
              distances.push(dist)
            })
            const closestAnnotation = result[distances.indexOf(min(distances))]
            result = [closestAnnotation]
          }
        }
        return result
      }, [])
    : []
}
