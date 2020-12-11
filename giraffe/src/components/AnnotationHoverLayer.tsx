import React, {FunctionComponent} from 'react'
import {AnnotationMark} from '../types'
import {AnnotationLayerProps} from './AnnotationLayer'
import {AnnotationTooltip} from './AnnotationTooltip'

interface AnnotationHoverLayerProps extends AnnotationLayerProps {
  annotationPositions: AnnotationMark[]
  boundingReference: DOMRect
  hoverRowIndices: number[]
  width: number
}

export const AnnotationHoverLayer: FunctionComponent<AnnotationHoverLayerProps> = props => {
  const {
    annotationPositions,
    plotConfig,
    hoverRowIndices,
    boundingReference,
    width,
  } = props

  const hoveredAnnotations = (_, i: number) => hoverRowIndices.includes(i)

  return (
    <>
      {annotationPositions.filter(hoveredAnnotations).map(annotationData => (
        <AnnotationTooltip
          key={`annotation-tooltip-${annotationData.dimension}-${annotationData.startValue}-${annotationData.stopValue}`}
          config={plotConfig}
          data={annotationData}
          boundingReference={boundingReference}
          width={width}
        />
      ))}
    </>
  )
}
