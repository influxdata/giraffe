import {AnnotationMark, LineHoverDimension, Scale} from '../types'

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
        }
        return result
      }, [])
    : []
}
