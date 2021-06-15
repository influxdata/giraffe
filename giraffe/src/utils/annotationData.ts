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
 * while a mouse is hovering within a range annotation, the 'distance' is zero.
 *
 * but there might be a point annotation overlapping the range,
 * and then when the mouse is directly over that point, it sholud show the tooltip for the point and not the range
 *
 * so without weighing it, the point annotation hovered tooltip will never show.
 *
 * so, if the types of the annotations are different, 'weighing' the range annotation by a small factor
 * (ANNOTATION_DEFAULT_OVERLAP_HOVER_MARGIN, which is equal to 10)
 * so that when you are *very* close to the point then it will show up in the tooltip popup.
 *
 * if the two types of annotations being compared are the same, then just do the simple comparison.
 * */
const getWeightedDistance = distance => {
  if (distance.annoType === 'range') {
    return distance.dist + ANNOTATION_DEFAULT_OVERLAP_HOVER_MARGIN
  }
  return distance.dist
}

export const sortDistances = (dist1, dist2) => {
  // just weighting the distance for everything, if the two types are the same
  // they will get weighted the same and will cancel each other out
  // add a handicap to the range, so that if within a certain distance, the point will get selected instead
  return getWeightedDistance(dist1) - getWeightedDistance(dist2)
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
        console.log(`${i}: annotation: ${startValue}: ${stopValue}`)
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
          console.log('pushing:', i)
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

            result = [distances.sort(sortDistances)[0].index]
          }
        }
        return result
      }, [])
    : []
}
