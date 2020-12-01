import React, {FunctionComponent, useMemo} from 'react'
import {AnnotationLayerConfig, AnnotationLayerSpec, LayerProps} from '../types'
import {getAnnotationsPositions} from '../utils/annotationData'

interface AnnotationLayerProps extends LayerProps {
  spec: AnnotationLayerSpec
  config: AnnotationLayerConfig
}

const ANNOTATION_OVERLAY_DEFAULT_STYLE = {
  width: '100%',
  height: '100%',
}

export const AnnotationLayer: FunctionComponent<AnnotationLayerProps> = props => {
  const {height, width, spec, xScale, yScale} = props
  const annotationsPositions = useMemo(
    () => getAnnotationsPositions(spec.annotations, xScale, yScale),
    [spec.annotations, xScale, yScale]
  )

  return (
    <svg style={{...ANNOTATION_OVERLAY_DEFAULT_STYLE}}>
      {annotationsPositions.map((annotation, i) =>
        annotation.direction === 'y' ? (
          <line
            key={i}
            x1="0"
            x2={width}
            y1={annotation.startValue}
            y2={annotation.startValue}
            stroke={annotation.color}
          />
        ) : (
          <line
            key={i}
            x1={annotation.startValue}
            x2={annotation.startValue}
            y1="0"
            y2={height}
            stroke={annotation.color}
          />
        )
      )}
    </svg>
  )
}
