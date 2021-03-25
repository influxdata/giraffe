import React, {CSSProperties} from 'react'
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

  // move this sucker 15 pixels up to get out of the way of the annotation click target
  const yAxisTooltipOffset = -15

  const position = {
    x: dimension === 'x' ? startValue : width,
    y: dimension === 'y' ? startValue : yAxisTooltipOffset,
  } as TooltipPosition

  const clampedXOffset = Math.round(
    boundingReference ? boundingReference.x : position.x
  )

  const clampedYOffset = Math.round(
    boundingReference ? boundingReference.y : position.y
  )

  const annotationTooltipElement = useTooltipElement(
    ANNOTATION_TOOLTIP_CONTAINER_NAME,
    {
      xOffset: clampedXOffset,
      yOffset: clampedYOffset,
      position,
      dimension,
    }
  )

  let tooltipCaretStyle: CSSProperties = {
    position: 'absolute',
    borderWidth: '10px',
    borderStyle: 'solid',
    borderColor: 'transparent',
    zIndex: 2,
  }
  let tooltipCaretFillStyle

  if (dimension === 'x') {
    tooltipCaretStyle = {
      ...tooltipCaretStyle,
      borderTopColor: data.color,
      left: '50%',
      top: '100%',
      transform: 'translateX(-50%)',
    }

    tooltipCaretFillStyle = {
      ...tooltipCaretStyle,
      borderTopColor: backgroundColor,
      top: 'calc(100% - 4px)',
      zIndex: 3,
    }
  }

  if (dimension === 'y') {
    tooltipCaretStyle = {
      ...tooltipCaretStyle,
      borderRightColor: data.color,
      top: '50%',
      right: '100%',
      transform: 'translateY(-50%)',
    }

    tooltipCaretFillStyle = {
      ...tooltipCaretStyle,
      borderRightColor: backgroundColor,
      right: 'calc(100% - 4px)',
      zIndex: 3,
    }
  }

  return createPortal(
    <div
      className="giraffe-annotation-tooltip"
      data-testid="giraffe-annotation-tooltip"
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
      <div style={tooltipCaretStyle} />
      <div style={tooltipCaretFillStyle} />
      <div>{data.title}</div>
      <div>{data.description}</div>
    </div>,
    annotationTooltipElement
  )
}
