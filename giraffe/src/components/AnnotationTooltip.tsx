import React from 'react'
import {FunctionComponent} from 'react'
import {createPortal} from 'react-dom'

import {Config, AnnotationMark, TooltipPosition} from '../types'
import {ANNOTATION_TOOLTIP_CONTAINER_NAME} from '../constants'
import {useTooltipElement} from '../utils/useTooltipElement'

interface Props {
  boundingReference: DOMRect
  config: Config
  data: AnnotationMark
  width: number
}

export const AnnotationTooltip: FunctionComponent<Props> = props => {
  const {boundingReference, config, data, width} = props
  const {
    legendBackgroundColor: backgroundColor,
    legendBorder: border,
    legendFont: font,
    legendFontColor: fontColor,
  } = config
  const {dimension, startValue} = data || {}

  const position = {
    x: dimension === 'x' ? startValue : width,
    y: dimension === 'y' ? startValue : 0,
  } as TooltipPosition

  const annotationTooltipElement = useTooltipElement(
    ANNOTATION_TOOLTIP_CONTAINER_NAME,
    {
      xOffset: Math.round(boundingReference ? boundingReference.x : position.x),
      yOffset: Math.round(boundingReference ? boundingReference.y : position.y),
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
        boxShadow: `0 0 4px 0px ${data.color}`,
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
