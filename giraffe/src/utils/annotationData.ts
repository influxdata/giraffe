import {AnnotationMark, LineHoverDimension, Scale} from '../types'
import {min} from 'd3-array'
import {ANNOTATION_DEFAULT_OVERLAP_HOVER_MARGIN} from '../constants/index'

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

// is the mouse within the start/stop area ? (using the margin)
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
    }
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
  return Math.abs(hoverPosition - annotationMark.startValue)
}

/**
 * Summary: do a weighted comparison between the distance of the mouse to range and point
 * annotations.
 *
 * Details:
 * While a mouse is hovering within a range annotation, the 'distance' is zero.
 *
 * But there might be a point annotation overlapping the range,
 * and then when the mouse is directly over that point, it should show the tooltip for
 * the point and not the range
 *
 * Without weighting it, the point annotation hovered tooltip will never show.
 * (very hard to get it *exactly*; and even if so, 0 === 0)
 *
 * If the types of the annotations are different, 'weighting' the range annotation by a small factor
 * (ANNOTATION_DEFAULT_OVERLAP_HOVER_MARGIN, which is equal to 8)
 * so that when you are *very* close to the point;  then the point, and not the range annotation
 * will show up in the tooltip popup.
 *
 * If the two types of annotations being compared are the same, then they will be weighed the same
 * and the weights will cancel each other out and it will be a simple comparison.
 *
 * NOTE:  the overlap hover margin is currently less than the default hover margin (which is 20)
 * If the default hover margin gets below the the overlap hover margin (or the user sets a lower one),
 * then the overlap margin should be reduced.
 */
const getWeightedDistance = distance => {
  if (distance.annoType === 'range') {
    return distance.dist + ANNOTATION_DEFAULT_OVERLAP_HOVER_MARGIN
  }
  return distance.dist
}

export const sortDistances = (dist1, dist2) => {
  return getWeightedDistance(dist1) - getWeightedDistance(dist2)
}

/***********************************************************************************
 * ANNOTATIONS HOVERING
 *
 * This returns the index of the annotation in the cell that should have its
 *  tooltip popup appear.
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
 *  This method accounts for overlapping annotations; if a point annotation is within a range
 *  annotation, the point annotation tooltip *will* show up when the mouse is within
 *  the ANNOTATION_DEFAULT_OVERLAP_HOVER_MARGIN, which is equal to 10;
 *  which is essentially only when the mouse is right on top of the line.
 *
 *  (see previous method to sort distances for details)
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
              const annoType =
                annotationData[i].startValue === annotationData[i].stopValue
                  ? 'point'
                  : 'range'
              distances.push({index: i, dist, annoType})
            })

            const closestAnnotation = distances.sort(sortDistances)[0].index
            result = [closestAnnotation]
          }
        }
        return result
      }, [])
    : []
}
