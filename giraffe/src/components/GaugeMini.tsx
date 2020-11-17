// Libraries
import React, {FunctionComponent, useRef, useEffect, useState} from 'react'
import {color as d3Color} from 'd3-color'
import {scaleLinear} from 'd3-scale'
import {range} from 'd3-array'
import {Color, GaugeMiniLayerConfig} from '../types'

// todo: remove before minigauge release
export const t = (x: number, y: number) => ({
  transform: `translate(${x},${y})`,
})

const throwReturn = <T extends unknown>(msg: string): T => {
  throw new Error(msg)
}

interface IProps {
  width: number
  height: number
  value: number | {_field: string; value: number}[]
  theme: Required<GaugeMiniLayerConfig>
}

//#region colors

export type Colors = {
  min: Color
  max: Color
  secondary: string
  thresholds: Color[]
  // targets: Color[],
}

export const getColors = (theme: Required<GaugeMiniLayerConfig>): Colors => {
  const {colorSecondary: secondary, gaugeColors: colorsAndTargets} = theme

  colorsAndTargets.forEach(
    ({hex, name}) =>
      d3Color(hex) ??
      throwReturn(`Object "${hex}" isn"t valid color for name:${name}`)
  )

  const min: Color =
    colorsAndTargets.find(x => x.type === 'min') ??
    throwReturn('color of type min must be defined')
  const max: Color =
    colorsAndTargets.find(x => x.type === 'max') ??
    throwReturn('color of type max must be defined')

  const thresholds = colorsAndTargets
    .filter(({type}) => type === 'threshold')
    .sort(({value: a}, {value: b}) => a - b)
  // const targets = colorsAndTargets.filter(({ type }) => type === "target").sort(({ value: a }, { value: b }) => a - b);

  return {max, min, secondary, /* targets, */ thresholds}
}

//#endregion colors

//#region svg helpers

type TSvgTextRectProps = {
  onRectChanged?: (rect: DOMRect) => void
} & React.SVGProps<SVGTextElement>

/**
 * Helper component that returns rect when children changes. Usefull for calculating text box size.
 */
export const SvgTextRect: React.FC<TSvgTextRectProps> = props => {
  const {onRectChanged = () => {}} = props

  const textRef = useRef<SVGTextElement>(null)

  useEffect(() => {
    const rect = textRef.current?.getBBox()
    if (!rect) return

    onRectChanged(rect)
  }, [props.children])

  return (
    <>
      <text {...props} ref={textRef} />
    </>
  )
}

const AutoCenterGroup: FunctionComponent<{
  enabled?: boolean
  refreshToken?: number | string
} & React.SVGProps<SVGGElement>> = props => {
  const {children, enabled = true, refreshToken = 0} = props
  const ref = useRef<SVGGElement>(null)

  const [x, setX] = useState(0)
  const [y, setY] = useState(0)

  useEffect(() => {
    if (!enabled) {
      setX(0)
      setY(0)
      return
    }

    const g = ref.current
    // we use this function because we want to know how much we are in negative direction
    const box = g?.getBBox()
    // we use this function because we want to have fixed parent width/height
    const boxParent = ((g?.parentElement as any) as
      | SVGGraphicsElement
      | undefined)?.getBoundingClientRect()

    if (!box || !boxParent) return

    setX((boxParent.width - box.width) / 2 - box.x)
    setY((boxParent.height - box.height) / 2 - box.y)
  }, [refreshToken])

  return (
    <g ref={ref} {...t(x, y)} {...props}>
      {children}
    </g>
  )
}

//#endregion svg helpers

const barCssClass = 'gauge-mini-bar'

const BarBackground: FunctionComponent<{
  theme: Required<GaugeMiniLayerConfig>
  colors: Colors
  barWidth: number
  getFrac: (x: number) => number
  barCenter: number
}> = ({
  theme,
  colors: {max, min, secondary, thresholds},
  barWidth,
  getFrac,
  barCenter,
}) => {
  const {gaugeHeight, mode, gaugeRounding} = theme

  const colors: {start: number; end: number; col: string}[] = []
  if (mode === 'progress') {
    colors.push({start: 0, end: 1, col: secondary})
  } else {
    const all = [min, ...thresholds, max]
    let start = 0
    for (let i = 0; i + 1 < all.length; i++) {
      const {hex: col} = all[i]
      const {value} = all[i + 1]

      const end = getFrac(value)

      colors.push({start, end, col})
      start = end
    }
  }

  const y = barCenter - gaugeHeight / 2

  // todo: invalid HTML -> multiple same ID attribute possible
  // todo: move to svg root
  const roundingDefId = `rounded-bar-${barWidth}-${gaugeHeight}`
  const gradientDefId = `gradient-${min.hex}-${max.hex}`

  return (
    <>
      <defs>
        <clipPath id={roundingDefId}>
          <rect
            rx={gaugeRounding}
            width={barWidth}
            height={gaugeHeight}
            y={y}
          />
        </clipPath>
        <linearGradient id={gradientDefId}>
          <stop offset="0%" stopColor={min.hex} />
          <stop offset="100%" stopColor={max.hex} />
        </linearGradient>
      </defs>
      {thresholds.length === 0 && mode === 'bullet' ? (
        <rect
          height={gaugeHeight}
          width={barWidth}
          fill={`url(#${gradientDefId})`}
          clipPath={`url(#${roundingDefId})`}
          y={y}
        />
      ) : (
        colors.map(({col, end, start}) => (
          <rect
            height={gaugeHeight}
            x={barWidth * start}
            width={barWidth * (end - start)}
            fill={col}
            clipPath={`url(#${roundingDefId})`}
            y={y}
          />
        ))
      )}
    </>
  )
}

const BarValue: FunctionComponent<{
  theme: Required<GaugeMiniLayerConfig>
  barValueWidth: number
  colors: Colors
  value: number
  valueFracFixed: number
  barCenter: number
}> = ({colors, barValueWidth, value, theme, valueFracFixed, barCenter}) => {
  const {valueHeight, gaugeHeight, mode, valueRounding} = theme
  const colorModeGradient = colors.thresholds.length === 0

  const colorValue =
    mode === 'bullet'
      ? colors.secondary
      : d3Color(
          (() => {
            if (colorModeGradient) {
              return scaleLinear()
                .range([colors.min.hex, colors.max.hex] as any)
                .domain([colors.min.value, colors.max.value])(value) as any
            } else {
              const sortedColors = [
                colors.min,
                ...colors.thresholds,
                colors.max,
              ]
              let i = 0
              while (
                i < sortedColors.length &&
                value >= sortedColors[i].value
              ) {
                i++
              }
              return sortedColors[
                Math.max(Math.min(i - 1, sortedColors.length - 1), 0)
              ].hex
            }
          })()
        )
          ?.brighter(1)
          .hex()

  const y = barCenter - valueHeight / 2
  const x = Math.sign(valueFracFixed) === -1 ? barValueWidth : 0

  const className = 'value-rect'

  // todo: move styling out -> styling is now multiple times inserted
  return (
    <>
      <style>{`
    .${barCssClass} .${className} {
      transition: stroke-width 150ms ease-in;
      stroke: #ffffffcc;
      stroke-width: 0;
    }
    .${barCssClass}:hover .${className} {
      stroke-width: 2;
    }
  `}</style>
      <rect
        className={className}
        rx={valueRounding}
        height={valueHeight}
        width={Math.abs(barValueWidth)}
        {...{x, y}}
        fill={colorValue as any}
      />
    </>
  )
}

const Bar: FunctionComponent<{
  value: number
  theme: Required<GaugeMiniLayerConfig>
  barWidth: number
  y: number
  getFrac: (x: number) => number
}> = ({value, theme, y, barWidth, getFrac}) => {
  const {gaugeHeight, valueHeight} = theme

  const colors = getColors(theme)

  const oveflowFrac = 0.03
  // fixes fraction into -oveflowFrac <-> 1+oveflowFrac
  const getFixedFrac = (val: number) =>
    Math.max(-oveflowFrac, Math.min(oveflowFrac + 1, getFrac(val)))
  const valueFracFixed = getFixedFrac(value)

  const barY = y
  const barValueWidth = barWidth * valueFracFixed
  const maxBarHeight = Math.max(gaugeHeight, valueHeight)
  const barCenter = maxBarHeight / 2

  return (
    <g className={barCssClass}>
      <g {...t(0, barY)}>
        <BarBackground {...{colors, barWidth, theme, getFrac, barCenter}} />
        <BarValue
          {...{colors, barValueWidth, theme, value, valueFracFixed, barCenter}}
        />

        <g {...t(0, barCenter)}>
          <Text {...{centerY: y, colors, barValueWidth, theme, value}} />
        </g>
      </g>
    </g>
  )
}

const Text: FunctionComponent<{
  theme: Required<GaugeMiniLayerConfig>
  barValueWidth: number
  colors: Colors
  value: number
}> = ({value, barValueWidth, theme}) => {
  const {
    valueFontColorInside,
    valueFontColorOutside,
    textMode,
    valueFormater,
    valueFontSize,
  } = theme
  const textValue = valueFormater(value)

  const [textBBox, setTextBBox] = useState<SVGRect | null>(null)
  const padding = 5

  const textInside =
    (textBBox?.width ? textBBox?.width + padding * 2 : 0) < barValueWidth

  const textAnchor = textInside && textMode === 'follow' ? 'end' : 'start'

  const textColor = textInside ? valueFontColorInside : valueFontColorOutside

  const x =
    textMode === 'follow'
      ? Math.max(barValueWidth + (textInside ? -padding : padding), padding)
      : padding

  return (
    <>
      <SvgTextRect
        onRectChanged={setTextBBox}
        x={x}
        fill={textColor}
        textAnchor={textAnchor}
        alignmentBaseline="central"
        fontSize={valueFontSize}
      >
        {textValue}
      </SvgTextRect>
    </>
  )
}

const Axes: FunctionComponent<{
  theme: Required<GaugeMiniLayerConfig>
  barWidth: number
  y: number
  getFrac: (x: number) => number
}> = ({theme, barWidth, y, getFrac}) => {
  const {axesSteps, axesFormater, axesFontColor, axesFontSize} = theme

  if (axesSteps === undefined || axesSteps === null) return <></>

  const colors = getColors(theme)

  const colorLen = colors.max.value - colors.min.value

  const axesLineStyle = {stroke: axesFontColor, strokeWidth: 2}

  const axesValuesArray = Array.isArray(axesSteps)
    ? axesSteps
    : axesSteps === 'thresholds'
    ? colors.thresholds.map(x => x.value)
    : Number.isInteger(axesSteps)
    ? range(axesSteps).map(
        x => ((x + 1) * colorLen) / (axesSteps + 1) + colors.min.value
      )
    : throwReturn<number[]>(
        `${JSON.stringify(
          axesSteps
        )} axesSteps must be number | "thresholds" | number[] | undefined.`
      )

  const points: {
    anchor: string
    value: number
    lineLength: number
  }[] = axesValuesArray
    .map(value => ({
      anchor: 'middle',
      value,
      lineLength: 5,
    }))
    .concat([
      {
        anchor: 'start',
        lineLength: 3,
        value: colors.min.value,
      },
      {
        anchor: 'end',
        lineLength: 3,
        value: colors.max.value,
      },
    ])

  return (
    <>
      <g {...t(0, y)}>
        <line x2={barWidth} style={axesLineStyle} stroke-linecap="round" />
        {points.map(({anchor, lineLength, value}, i) => {
          const posX = getFrac(value) * barWidth
          const text = axesFormater(value)
          return (
            <>
              <g {...t(posX, 0)}>
                <line
                  y2={lineLength}
                  style={axesLineStyle}
                  stroke-linecap="round"
                />
                <text
                  y={8}
                  textAnchor={anchor}
                  alignmentBaseline="hanging"
                  fill={axesFontColor}
                  fontSize={axesFontSize}
                >
                  {text}
                </text>
              </g>
            </>
          )
        })}
      </g>
    </>
  )
}

export const GaugeMini: FunctionComponent<IProps> = ({
  value,
  theme,
  width,
  height,
}) => {
  const {
    gaugeHeight,
    sidePaddings: gaugePaddingSides,
    valueHeight,
    barPaddings,
    labelMain,
    labelBars,
    labelMainFontSize,
    labelMainFontColor,
    labelBarsFontColor,
    labelBarsFontSize,
  } = theme
  const [barLabelsWidth] = useState<number[]>([])

  const valueArray = Array.isArray(value)
    ? value
    : [{_field: '_default', value}]

  const colors = getColors(theme)
  const colorLen = colors.max.value - colors.min.value
  const centerY = height / 2

  const barLabelWidth = Math.max(...barLabelsWidth) || 0

  const barWidth = width - gaugePaddingSides * 2 - barLabelWidth

  const maxBarHeight = Math.max(gaugeHeight, valueHeight)

  const allBarsHeight = valueArray.length * (maxBarHeight + barPaddings)

  const [autocenterToken, setAutocenterToken] = useState(0)
  useEffect(() => {
    setAutocenterToken(autocenterToken + 1)
  }, [barLabelsWidth, gaugePaddingSides, valueHeight, width, height])

  /** return value as fraction 0->min 1->max */
  const getFrac = (val: number): number => (val - colors.min.value) / colorLen

  return (
    <svg width={width} height={height} style={{fontFamily: 'Rubik, monospace'}}>
      <AutoCenterGroup
        enabled={true}
        refreshToken={autocenterToken}
        style={{userSelect: 'none'}}
      >
        {labelMain && (
          <text
            fill={labelMainFontColor}
            y={-barPaddings * 2}
            fontSize={labelMainFontSize}
          >
            {labelMain}
          </text>
        )}
        {valueArray.map(({_field, value}, i) => {
          const y = 0 + i * (maxBarHeight + barPaddings)
          const label = labelBars?.find(({_field: f}) => f === _field)?.label

          const textCenter = y + maxBarHeight / 2

          // todo: no rerender ?
          const onRectChanged = (r: DOMRect) => {
            barLabelsWidth[i] = r.width
          }

          return (
            <>
              <Bar {...{barWidth, y, theme, value, getFrac}} />
              <SvgTextRect
                onRectChanged={onRectChanged}
                y={textCenter}
                x={-10}
                alignmentBaseline="central"
                textAnchor="end"
                fontSize={labelBarsFontSize}
                fill={labelBarsFontColor}
              >
                {label}
              </SvgTextRect>
            </>
          )
        })}
        <Axes
          {...{barWidth, theme, value, y: allBarsHeight + barPaddings, getFrac}}
        />
      </AutoCenterGroup>
    </svg>
  )
}
