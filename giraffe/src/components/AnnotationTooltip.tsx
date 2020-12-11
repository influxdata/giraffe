import React from 'react'
import {FunctionComponent} from 'react'
import {createPortal} from 'react-dom'

import {Config, AnnotationMark, TooltipPosition} from '../types'
import {ANNOTATION_TOOLTIP_CONTAINER_NAME} from '../constants'
import {useTooltipElement} from '../utils/useTooltipElement'

interface Props {
  config: Config
  data: AnnotationMark
  boundingReference: DOMRect
  width: number
  height: number
}

export const AnnotationTooltip: FunctionComponent<Props> = props => {
  const {config, data, boundingReference, width} = props
  const {
    legendFont: font,
    legendFontColor: fontColor,
    legendBackgroundColor: backgroundColor,
    legendBorder: border,
  } = config
  const {dimension, startValue} = data || {}

  const position = {
    x: dimension === 'x' ? startValue : width,
    y: dimension === 'y' ? startValue : 0,
  } as TooltipPosition
  const annotationTooltipElement = useTooltipElement(
    ANNOTATION_TOOLTIP_CONTAINER_NAME,
    {
      xOffset: boundingReference ? boundingReference.x : position.x,
      yOffset: boundingReference ? boundingReference.y : position.y,
      position,
      dimension,
    }
  )
  return createPortal(
    <div
      className="giraffe-annotation-tooltip"
      data-testid="giraffe-anntation-tooltip"
      style={{
        border,
        borderColor: data.color,
        font,
        backgroundColor,
        color: fontColor,
        borderRadius: '3px',
        padding: '10px',
      }}
    >
      <div>{data.title}</div>
      <div>{data.description}</div>
    </div>,
    annotationTooltipElement
  )
}
