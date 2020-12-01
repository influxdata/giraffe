import {AnnotationMark} from '../types'

export const getAnnotationsPositions = (
  annotations: AnnotationMark[],
  xScale: Function,
  yScale: Function
): AnnotationMark[] => {
  const annotationMarks: AnnotationMark[] = []

  annotations.forEach(annotation => {
    annotationMarks.push({
      ...annotation,
      startValue:
        annotation.direction === 'y'
          ? yScale(annotation.startValue)
          : xScale(annotation.startValue),
      stopValue:
        annotation.direction === 'y'
          ? yScale(annotation.stopValue)
          : xScale(annotation.stopValue),
    })
  })
  return annotationMarks
}
