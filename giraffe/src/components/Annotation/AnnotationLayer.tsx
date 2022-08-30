import React, {CSSProperties, FunctionComponent, useMemo, useRef} from 'react'
import {
  AnnotationLayerConfig,
  AnnotationLayerSpec,
  LayerProps,
  LineHoverDimension,
} from '../../types'
import {
  getAnnotationHoverIndices,
  getAnnotationsPositions,
} from '../../utils/annotationData'
import {ANNOTATION_DEFAULT_HOVER_MARGIN} from '../../constants/index'
import {AnnotationHoverLayer} from './AnnotationHoverLayer'
import {AnnotationLine} from './AnnotationLine'

export interface AnnotationLayerProps extends LayerProps {
  spec: AnnotationLayerSpec
  config: AnnotationLayerConfig
  onHover: (forceHide: boolean) => void
}

const ANNOTATION_OVERLAY_DEFAULT_STYLE = {
  position: 'absolute',
} as CSSProperties

export const AnnotationLayer: FunctionComponent<AnnotationLayerProps> = props => {
  const {
    config,
    spec,
    width,
    height,
    hoverX,
    hoverY,
    xScale,
    yScale,
    onHover,
  } = props
  const lineWidth = config.lineWidth || 2
  const annotationsPositions = useMemo(
    () => getAnnotationsPositions(spec.annotationData, xScale, yScale),
    [spec.annotationData, xScale, yScale]
  )
  const svgRef = useRef<SVGSVGElement>(null)

  let hoverDimension = 'xy' as LineHoverDimension
  if (config.hoverDimension === 'x' || config.hoverDimension === 'y') {
    hoverDimension = config.hoverDimension
  }

  const hoverMargin = config.hoverMargin
    ? config.hoverMargin
    : ANNOTATION_DEFAULT_HOVER_MARGIN

  const hoverRowIndices = getAnnotationHoverIndices(
    hoverDimension,
    hoverMargin,
    annotationsPositions,
    hoverX,
    hoverY
  )

  let boundingRect: DOMRect
  if (svgRef.current) {
    boundingRect = svgRef.current.getBoundingClientRect()
  }

  const handleClick = event => {
    if (config.handleAnnotationClick && event.target.id) {
      config.handleAnnotationClick(event.target.id)
    }
  }

  return (
    <svg
      className="giraffe-layer giraffe-layer-annotation"
      ref={svgRef}
      style={{...ANNOTATION_OVERLAY_DEFAULT_STYLE, width, height}}
      onClick={handleClick}
    >
      <AnnotationHoverLayer
        {...props}
        annotationPositions={annotationsPositions}
        boundingReference={boundingRect}
        hoverRowIndices={hoverRowIndices}
        width={width}
      />
      {annotationsPositions.map(annotationData =>
        annotationData.dimension === 'y' ? (
          <AnnotationLine
            dimension={annotationData.dimension}
            key={`line-y-${annotationData.dimension}-${annotationData.startValue}-${annotationData.stopValue}`}
            length={width}
            startValue={annotationData.startValue}
            stopValue={annotationData.stopValue}
            color={annotationData.color}
            strokeWidth={lineWidth}
            pin={annotationData.pin}
            id={annotationData.id}
          />
        ) : (
          <AnnotationLine
            dimension={annotationData.dimension}
            key={`line-x-${annotationData.dimension}-${annotationData.startValue}-${annotationData.stopValue}`}
            length={height}
            startValue={annotationData.startValue}
            stopValue={annotationData.stopValue}
            color={annotationData.color}
            strokeWidth={lineWidth}
            pin={annotationData.pin}
            id={annotationData.id}
            onHover={onHover}
          />
        )
      )}
    </svg>
  )
}
