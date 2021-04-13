// Libraries
import React, {FunctionComponent, useRef, useEffect} from 'react'
import {range} from '../utils/range'
import {get} from '../utils/get'

// Utils
import {formatStatValue, MAX_DECIMAL_PLACES} from '../utils/formatStatValue'

import {
  COLOR_TYPE_MIN,
  COLOR_TYPE_MAX,
  DEFAULT_VALUE_MIN,
  DEFAULT_VALUE_MAX,
  MIN_THRESHOLDS,
} from '../constants/gaugeStyles'

// Types
import {Color, DecimalPlaces, GaugeTheme} from '../types'

interface Props {
  width: number
  height: number
  gaugePosition: number
  colors: Color[]
  prefix: string
  tickPrefix: string
  suffix: string
  tickSuffix: string
  decimalPlaces: DecimalPlaces
  theme: GaugeTheme
  gaugeSize: number
  gaugeUnit: string[]
}

const resetCanvas = (
  canvasRef: React.MutableRefObject<HTMLCanvasElement>,
  width: number,
  height: number
): void => {
  const canvas = canvasRef.current
  const ctx = canvas.getContext('2d')
  const dpRatio = window.devicePixelRatio || 1

  // Set up canvas to draw on HiDPI / Retina screens correctly
  canvas.width = width * dpRatio
  canvas.height = height * dpRatio
  canvas.style.width = `${width}px`
  canvas.style.height = `${height}px`
  ctx.scale(dpRatio, dpRatio)

  // Clear the canvas
  ctx.clearRect(0, 0, width, height)
}

const updateCanvas = (
  canvasRef: React.MutableRefObject<HTMLCanvasElement>,
  props: Props
): void => {
  const {width, height, colors, theme, gaugeSize, gaugeUnit} = props
  resetCanvas(canvasRef, width, height)

  const canvas = canvasRef.current
  const ctx = canvas.getContext('2d')

  const centerX = width / 2
  const centerY = (height / 2) * 1.13
  const radius = (Math.min(width, height) / 2) * 0.5

  const {minLineWidth, minFontSize} = theme
  const gradientThickness = Math.max(minLineWidth, radius / 4)
  const labelValueFontSize = Math.max(minFontSize, radius / 4)

  if (!Array.isArray(colors) || colors.length === 0) {
    return
  }

  // Distill out max and min values
  const minValue = Number(
    get(
      colors.find(color => color.type === COLOR_TYPE_MIN),
      'value',
      DEFAULT_VALUE_MIN
    )
  )
  const maxValue = Number(
    get(
      colors.find(color => color.type === COLOR_TYPE_MAX),
      'value',
      DEFAULT_VALUE_MAX
    )
  )

  // The following functions must be called in the specified order
  if (colors.length === MIN_THRESHOLDS) {
    drawGradientGauge(
      ctx,
      centerX,
      centerY,
      radius,
      gradientThickness,
      colors,
      gaugeSize
    )
  } else {
    drawSegmentedGauge(
      ctx,
      centerX,
      centerY,
      radius,
      minValue,
      maxValue,
      gradientThickness,
      colors,
      gaugeSize
    )
  }
  drawGaugeLines(
    ctx,
    centerX,
    centerY,
    radius,
    gradientThickness,
    theme,
    gaugeSize
  )
  drawGaugeLabels(
    ctx,
    radius,
    gradientThickness,
    minValue,
    maxValue,
    gaugeUnit,
    props
  )
  drawGaugeValue(ctx, radius, labelValueFontSize, props)
  drawNeedle(ctx, radius, minValue, maxValue, gaugeUnit, props)
}

const drawGradientGauge = (
  ctx: CanvasRenderingContext2D,
  xc: number,
  yc: number,
  radius: number,
  gradientThickness: number,
  colors: Color[],
  gaugeSize: number
): void => {
  const sortedColors = Array.isArray(colors)
    ? colors.sort((color1, color2) => color1.value - color2.value)
    : []

  const arcStart = Math.PI - (gaugeSize - Math.PI) / 2
  const arcEnd = arcStart + gaugeSize

  // Determine coordinates for gradient
  const xStart = xc + Math.cos(arcStart) * radius
  const yStart = yc + Math.sin(arcStart) * radius
  const xEnd = xc + Math.cos(arcEnd) * radius
  const yEnd = yc + Math.sin(arcEnd) * radius

  const gradient = ctx.createLinearGradient(xStart, yStart, xEnd, yEnd)
  gradient.addColorStop(0, sortedColors[0].hex)
  gradient.addColorStop(1.0, sortedColors[1].hex)

  ctx.beginPath()
  ctx.lineWidth = gradientThickness
  ctx.strokeStyle = gradient
  ctx.arc(xc, yc, radius, arcStart, arcEnd)
  ctx.stroke()
}

const drawSegmentedGauge = (
  ctx: CanvasRenderingContext2D,
  xc: number,
  yc: number,
  radius: number,
  minValue: number,
  maxValue: number,
  gradientThickness: number,
  colors: Color[],
  gaugeSize: number
): void => {
  let thresholdColors = []
  if (Array.isArray(colors)) {
    thresholdColors = colors.filter(color => {
      return color.value >= minValue && color.value <= maxValue
    })
  }

  const sortedColors = thresholdColors.sort(
    (color1, color2) => color1.value - color2.value
  )

  const trueValueRange = Math.abs(maxValue - minValue)
  const totalArcLength = gaugeSize
  let startingPoint = Math.PI - (gaugeSize - Math.PI) / 2

  // Iterate through colors, draw arc for each
  for (let c = 0; c < sortedColors.length - 1; c++) {
    // Use this color and the next to determine arc length
    const color = sortedColors[c]
    const nextColor = sortedColors[c + 1]

    // adjust values by subtracting minValue from them
    const adjustedValue = Number(color.value) - minValue
    const adjustedNextValue = Number(nextColor.value) - minValue

    const thisArc = Math.abs(adjustedValue - adjustedNextValue)
    // Multiply by arcLength to determine this arc's length
    const arcLength = totalArcLength * (thisArc / trueValueRange)
    // Draw arc
    ctx.beginPath()
    ctx.lineWidth = gradientThickness
    ctx.strokeStyle = color.hex
    ctx.arc(xc, yc, radius, startingPoint, startingPoint + arcLength)
    ctx.stroke()
    // Add this arc's length to starting point
    startingPoint += arcLength
  }
}

const drawGaugeLines = (
  ctx: CanvasRenderingContext2D,
  xc: number,
  yc: number,
  radius: number,
  gradientThickness: number,
  theme: GaugeTheme,
  gaugeSize: number
): void => {
  const {
    lineCount,
    lineColor,
    lineStrokeSmall,
    lineStrokeLarge,
    tickSizeSmall,
    tickSizeLarge,
    smallLineCount,
  } = theme

  const arcLength = gaugeSize
  const arcStop = (gaugeSize - Math.PI) / 2
  const totalSmallLineCount = lineCount * smallLineCount

  const startDegree = Math.PI - arcStop
  const arcLargeIncrement = arcLength / lineCount
  const arcSmallIncrement = arcLength / totalSmallLineCount

  // Semi-circle
  const arcRadius = radius + gradientThickness * 0.8
  ctx.beginPath()
  ctx.arc(xc, yc, arcRadius, startDegree, arcStop)
  ctx.lineWidth = 3
  ctx.lineCap = 'round'
  ctx.strokeStyle = lineColor
  ctx.stroke()
  ctx.closePath()

  // Match center of canvas to center of gauge
  ctx.translate(xc, yc)

  // Draw Large ticks
  for (let lt = 0; lt <= lineCount; lt++) {
    // Rotation before drawing line
    ctx.rotate(startDegree)
    ctx.rotate(lt * arcLargeIncrement)
    // Draw line
    ctx.beginPath()
    ctx.lineWidth = lineStrokeLarge
    ctx.lineCap = 'round'
    ctx.strokeStyle = lineColor
    ctx.moveTo(arcRadius, 0)
    ctx.lineTo(arcRadius + tickSizeLarge, 0)
    ctx.stroke()
    ctx.closePath()
    // Return to starting rotation
    ctx.rotate(-lt * arcLargeIncrement)
    ctx.rotate(-startDegree)
  }

  // Draw Small ticks
  for (let lt = 0; lt <= totalSmallLineCount; lt++) {
    // Rotation before drawing line
    ctx.rotate(startDegree)
    ctx.rotate(lt * arcSmallIncrement)
    // Draw line
    ctx.beginPath()
    ctx.lineWidth = lineStrokeSmall
    ctx.lineCap = 'round'
    ctx.strokeStyle = lineColor
    ctx.moveTo(arcRadius, 0)
    ctx.lineTo(arcRadius + tickSizeSmall, 0)
    ctx.stroke()
    ctx.closePath()
    // Return to starting rotation
    ctx.rotate(-lt * arcSmallIncrement)
    ctx.rotate(-startDegree)
  }
}

const drawGaugeLabels = (
  ctx: CanvasRenderingContext2D,
  radius: number,
  gradientThickness: number,
  minValue: number,
  maxValue: number,
  gaugeUnit: string[],
  props: Props
): void => {
  const {tickPrefix, tickSuffix, decimalPlaces, gaugeSize} = props
  const {lineCount, labelColor, labelFontSize} = props.theme
  const startDegree = Math.PI - (gaugeSize - Math.PI) / 2
  const arcLength = gaugeSize
  const arcIncrement = arcLength / lineCount
  let labelRadius: number

  // Format labels text
  ctx.font = `bold ${labelFontSize}px Rubik`
  ctx.fillStyle = labelColor
  ctx.textBaseline = 'middle'
  ctx.textAlign = 'right'

  if (gaugeUnit.toString() === 'bytes') {
    const labels = ['0b', '1024Kb', '1024Mb', '1024Gb', '1024Tb', '1024Pb']
    const lineCount = 5
    for (let i = 0; i <= lineCount; i++) {
      labelRadius = radius + gradientThickness + 23
      if (i / (lineCount + 1) >= 0.5) {
        ctx.textAlign = 'left'
      }

      ctx.rotate(startDegree)
      ctx.rotate(i * arcIncrement)
      ctx.translate(labelRadius, 0)
      ctx.rotate(i * -arcIncrement)
      ctx.rotate(-startDegree)
      ctx.fillText(labels[i], 0, 0)
      ctx.rotate(startDegree)
      ctx.rotate(i * arcIncrement)
      ctx.translate(-labelRadius, 0)
      ctx.rotate(i * -arcIncrement)
      ctx.rotate(-startDegree)
    }
  } else if (gaugeUnit.toString() === 'time') {
    const labels = ['0', '60s', '60m', '24h', '30d']
    const lineCount = 5
    for (let i = 0; i <= lineCount; i++) {
      labelRadius = radius + gradientThickness + 23
      if (i / (lineCount + 1) >= 0.5) {
        ctx.textAlign = 'left'
      }

      ctx.rotate(startDegree)
      ctx.rotate(i * arcIncrement)
      ctx.translate(labelRadius, 0)
      ctx.rotate(i * -arcIncrement)
      ctx.rotate(-startDegree)
      ctx.fillText(labels[i], 0, 0)
      ctx.rotate(startDegree)
      ctx.rotate(i * arcIncrement)
      ctx.translate(-labelRadius, 0)
      ctx.rotate(i * -arcIncrement)
      ctx.rotate(-startDegree)
    }
  } else if (gaugeUnit.toString() === 'USD') {
    const labels = ['0', '1000', '1000m', '1000b', '1000t']
    const lineCount = 5
    for (let i = 0; i <= lineCount; i++) {
      labelRadius = radius + gradientThickness + 23
      if (i / (lineCount + 1) >= 0.5) {
        ctx.textAlign = 'left'
      }

      ctx.rotate(startDegree)
      ctx.rotate(i * arcIncrement)
      ctx.translate(labelRadius, 0)
      ctx.rotate(i * -arcIncrement)
      ctx.rotate(-startDegree)
      ctx.fillText(labels[i], 0, 0)
      ctx.rotate(startDegree)
      ctx.rotate(i * arcIncrement)
      ctx.translate(-labelRadius, 0)
      ctx.rotate(i * -arcIncrement)
      ctx.rotate(-startDegree)
    }
  } else {
    const tickValues = [
      ...range(minValue, maxValue, Math.abs(maxValue - minValue) / lineCount),
      maxValue,
    ]

    const labels = tickValues.map(tick =>
      formatStatValue(tick, {
        decimalPlaces,
        prefix: tickPrefix,
        suffix: tickSuffix,
      })
    )

    for (let i = 0; i <= lineCount; i++) {
      labelRadius = radius + gradientThickness + 23
      if (lineCount === 1 && i === 1) {
        ctx.textAlign = 'left'
      } else if (lineCount % 2 === 0 && lineCount / i === 2) {
        ctx.textAlign = 'center'
      } else if (i / (lineCount + 1) >= 0.5) {
        ctx.textAlign = 'left'
      }

      ctx.rotate(startDegree)
      ctx.rotate(i * arcIncrement)
      ctx.translate(labelRadius, 0)
      ctx.rotate(i * -arcIncrement)
      ctx.rotate(-startDegree)
      ctx.fillText(labels[i], 0, 0)
      ctx.rotate(startDegree)
      ctx.rotate(i * arcIncrement)
      ctx.translate(-labelRadius, 0)
      ctx.rotate(i * -arcIncrement)
      ctx.rotate(-startDegree)
    }
  }
}

const drawGaugeValue = (
  ctx: CanvasRenderingContext2D,
  radius: number,
  labelValueFontSize: number,
  props: Props
): void => {
  const {gaugePosition, prefix, suffix, decimalPlaces} = props
  const {valueColor, valuePositionYOffset, valuePositionXOffset} = props.theme

  ctx.font = `${labelValueFontSize}px Rubik`
  ctx.fillStyle = valueColor
  ctx.textBaseline = 'middle'
  ctx.textAlign = 'center'

  const textX = valuePositionXOffset * radius
  const textY = valuePositionYOffset * radius
  const textContent = formatStatValue(gaugePosition, {
    decimalPlaces,
    prefix,
    suffix,
  })

  ctx.fillText(textContent, textX, textY)
}

const drawNeedle = (
  ctx: CanvasRenderingContext2D,
  radius: number,
  minValue: number,
  maxValue: number,
  gaugeUnit: string[],
  props: Props
): void => {
  const {gaugePosition, gaugeSize, decimalPlaces} = props
  const {needleColor0, needleColor1, overflowDelta} = props.theme
  const arcDistance = gaugeSize

  let needleRotation: number

  let digits = decimalPlaces?.isEnforced
    ? decimalPlaces.digits
    : gaugePosition.toString().indexOf('.') === -1
    ? 0
    : 2

  digits = Math.min(digits, MAX_DECIMAL_PLACES)

  const formattedGaugePosition = Number(gaugePosition.toFixed(digits))
  if (gaugeUnit.toString() === 'bytes') {
    maxValue = 5120
  }

  if (formattedGaugePosition < minValue) {
    needleRotation = 0 - overflowDelta
  } else if (formattedGaugePosition > maxValue) {
    needleRotation = 1 + overflowDelta
  } else {
    needleRotation = (formattedGaugePosition - minValue) / (maxValue - minValue)
  }

  const needleGradient = ctx.createLinearGradient(0, -10, 0, radius)
  needleGradient.addColorStop(0, needleColor0)
  needleGradient.addColorStop(1, needleColor1)

  // Starting position of needle is at minimum
  ctx.rotate(0.5 * Math.PI - (gaugeSize - Math.PI) / 2)
  ctx.rotate(arcDistance * needleRotation)
  ctx.beginPath()
  ctx.fillStyle = needleGradient
  ctx.arc(0, 0, 10, 0, Math.PI, true)
  ctx.lineTo(0, radius)
  ctx.lineTo(10, 0)
  ctx.fill()
}

export const Gauge: FunctionComponent<Props> = (props: Props) => {
  const {width, height} = props
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    updateCanvas(canvasRef, props)
  }, [props])

  return (
    <canvas
      className="giraffe-gauge"
      width={width}
      height={height}
      ref={canvasRef}
    />
  )
}
