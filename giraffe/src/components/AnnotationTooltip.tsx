import React, {CSSProperties} from 'react'
import {FunctionComponent} from 'react'
import {createPortal} from 'react-dom'

import {Config, AnnotationMark, TooltipPosition} from '../types'
import {
  ANNOTATION_TOOLTIP_CONTAINER_NAME,
  ANNOTATION_DEFAULT_MAX_WIDTH,
} from '../constants'
import {useAnnotationTooltipElement} from '../utils/legend/useTooltipElement'

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

  const {dimension, startValue, stopValue} = data || {}

  // move this 15 pixels up to get out of the way of the annotation click target
  const yAxisTooltipOffset = -15

  // setting position to be the average between start and stop;
  // if it is a ranged annotation then it will appear in the middle,
  // if it is a point annotation then the math is a no-op.
  const position = {
    x: dimension === 'x' ? (startValue + stopValue) / 2 : width,
    y: dimension === 'y' ? (startValue + stopValue) / 2 : yAxisTooltipOffset,
  } as TooltipPosition

  const clampedXOffset = Math.round(
    boundingReference ? boundingReference.x : position.x
  )

  const clampedYOffset = Math.round(
    boundingReference ? boundingReference.y : position.y
  )

  const annotationTooltipElement = useAnnotationTooltipElement(
    ANNOTATION_TOOLTIP_CONTAINER_NAME,
    {
      xOffset: clampedXOffset,
      yOffset: clampedYOffset,
      position,
      dimension,
    }
  )

  let tooltipCaretStyle: CSSProperties = {
    position: 'fixed',
    borderWidth: '7px',
    borderStyle: 'solid',
    borderColor: 'transparent',
    zIndex: 2,
  }
  let tooltipCaretFillStyle

  if (dimension === 'x') {
    tooltipCaretStyle = {
      ...tooltipCaretStyle,
      borderTopColor: data.color,
      left: `${clampedXOffset + position.x}px`,
      top: `${clampedYOffset + position.y}px`,
      transform: 'translateX(-50%)',
    }

    tooltipCaretFillStyle = {
      ...tooltipCaretStyle,
      borderTopColor: backgroundColor,
      top: `calc(${clampedYOffset + position.y}px - 4px)`,
      zIndex: 3,
    }
  }

  if (dimension === 'y') {
    tooltipCaretStyle = {
      ...tooltipCaretStyle,
      position: 'absolute',
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

  const textContainerStyle: CSSProperties = {
    overflowWrap: 'break-word',
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
        display: 'inline-block',
        maxWidth: `${ANNOTATION_DEFAULT_MAX_WIDTH}px`,
      }}
    >
      <div style={tooltipCaretStyle} />
      <div style={tooltipCaretFillStyle} />
      <div style={textContainerStyle}>{data.title}</div>
      <div style={textContainerStyle}>{data.description}</div>
    </div>,
    annotationTooltipElement
  )
}
