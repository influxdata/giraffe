// Libraries
import React, {FunctionComponent, useRef, useEffect, useState} from 'react'
import {color as d3Color} from 'd3-color'
import {scaleLinear} from 'd3-scale'
import {range} from 'd3-array'
import {Color, GaugeMiniLayerConfig} from '../types'

const throwReturn = <T extends unknown>(msg: string): T => {
  throw new Error(msg)
}

interface Props {
  width: number
  height: number
  values: {colsMString: string; value: number}[]
  theme: Required<GaugeMiniLayerConfig>
}

/** create merged string for given column string values. String is same for all columns with same values and unique for different ones */
export const createColsMString = <T extends {[key: string]: true}>(
  groupedBy: T,
  col: {[key in keyof T]: string}
): string => {
  const columns = Object.keys(groupedBy).sort()
  const columnValues = columns.map(x => col[x])
  /**
   * replacing - with -- will ensures that rows
   * { a: '0-1', b: '2' } and  { a: '0', b: '1-2' }
   * will not have same string (0-1-2 instead they will be 0--1-2 and 0-1--2)
   */
  return columnValues.map(x => x.split('-').join('--')).join('-')
}

const barCssClass = 'gauge-mini-bar'

//#region colors

export type Colors = {
  min: Color
  max: Color
  secondary: string
  thresholds: Color[]
}

export const getColors = (theme: Required<GaugeMiniLayerConfig>): Colors => {
  const {colorSecondary: secondary, gaugeColors} = theme

  gaugeColors.forEach(
    ({hex, name}) =>
      d3Color(hex) ??
      throwReturn(`Object "${hex}" isn"t valid color for name:${name}`)
  )

  return {
    min:
      gaugeColors.find(x => x.type === 'min') ??
      throwReturn('color of type min must be defined'),
    max:
      gaugeColors.find(x => x.type === 'max') ??
      throwReturn('color of type max must be defined'),
    thresholds: gaugeColors
      .filter(({type}) => type === 'threshold')
      .sort(({value: a}, {value: b}) => a - b),
    secondary,
  }
}

//#endregion colors

//#region svg helpers

type TSvgTextRectProps = {
  onRectChanged?: (rect: DOMRect) => void
} & React.SVGProps<SVGTextElement>

/**
 * Helper component that returns rect when children changes. Usefull for calculating text box size.
 * !onRectChanged called only when children changes!
 */
export const SvgTextRect: React.FC<TSvgTextRectProps> = props => {
  const {onRectChanged = () => {}} = props

  const textRef = useRef<SVGTextElement>(null)

  useEffect(() => {
    const rect = textRef.current?.getBBox()
    if (!rect) {
      return
    }

    onRectChanged(rect)
  }, [props.children, onRectChanged])

  return (
    <>
      <text {...props} ref={textRef} />
    </>
  )
}

/**
 * Helper component for centering content.
 * !Doesn't react on content size changed. Recententering is done manualy by changing refreshToken!
 */
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

    if (!box || !boxParent) {
      return
    }

    setX((boxParent.width - box.width) / 2 - box.x)
    setY((boxParent.height - box.height) / 2 - box.y)
  }, [refreshToken, enabled])

  return (
    <g ref={ref} transform={`translate(${x},${y})`} {...props}>
      {children}
    </g>
  )
}

//#endregion svg helpers

//#region subcomponents

//#region types

type BarBackgroundProps = {
  theme: Required<GaugeMiniLayerConfig>
  colors: Colors
  barWidth: number
  getFrac: (x: number) => number
  barCenter: number
}

type BarValueProps = {
  theme: Required<GaugeMiniLayerConfig>
  barValueWidth: number
  colors: Colors
  value: number
  valueFracFixed: number
  barCenter: number
}

type TextProps = {
  theme: Required<GaugeMiniLayerConfig>
  barValueWidth: number
  colors: Colors
  value: number
}

type BarProps = {
  value: number
  theme: Required<GaugeMiniLayerConfig>
  barWidth: number
  y: number
  getFrac: (x: number) => number
}

type AxesProps = {
  theme: Required<GaugeMiniLayerConfig>
  barWidth: number
  y: number
  getFrac: (x: number) => number
}

//#endregion types

const BarBackground: FunctionComponent<BarBackgroundProps> = ({
  theme,
  colors: {max, min, secondary, thresholds},
  barWidth,
  getFrac,
  barCenter,
}) => {
  const {gaugeHeight, mode, gaugeRounding} = theme

  const y = barCenter - gaugeHeight / 2
  // todo: invalid HTML -> multiple same ID attribute possible
  const roundingDefId = `rounded-bar-w-${barWidth}-h-${gaugeHeight}-r-${gaugeRounding}`
  const gradientDefId = `gradient-${min.hex}-${max.hex}`

  type Segment = {start: number; end: number; hex: string}
  const segments: Segment[] = []
  if (mode === 'bullet') {
    // thresholds are already sorted by getColors
    const allColors = [min, ...thresholds, max]

    for (
      let i = 0, start = 0, end = 0;
      i + 1 < allColors.length;
      i++, start = end
    ) {
      const {hex} = allColors[i]
      const next = allColors[i + 1].value

      end = getFrac(next)
      segments.push({start, end, hex})
    }
  } else {
    segments.push({start: 0, end: 1, hex: secondary})
  }

  // todo: dont't render def linear gradient when is not used
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
        segments
          .reverse()
          .map(({hex: col, end, start}, i) => (
            <rect
              key={i}
              height={gaugeHeight}
              x={barWidth * start + (i === 0 ? 0 : -0.1)}
              width={barWidth * (end - start) + (i === 0 ? 0 : +0.1)}
              fill={col}
              clipPath={`url(#${roundingDefId})`}
              y={y}
            />
          ))
      )}
    </>
  )
}

const BarValue: FunctionComponent<BarValueProps> = ({
  colors,
  barValueWidth,
  value,
  theme,
  valueFracFixed,
  barCenter,
}) => {
  const {valueHeight, mode, valueRounding} = theme
  const colorModeGradient = colors.thresholds.length === 0

  const x = Math.sign(valueFracFixed) === -1 ? barValueWidth : 0
  const y = barCenter - valueHeight / 2

  const className = 'value-rect'

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

const Text: FunctionComponent<TextProps> = ({value, barValueWidth, theme}) => {
  const {
    valueFontColorInside,
    valueFontColorOutside,
    textMode,
    valueFormater,
    valueFontSize: fontSize,
    valuePadding,
  } = theme
  const textValue = valueFormater(value)
  const follow = textMode === 'follow'

  const [textBBox, setTextBBox] = useState<SVGRect | null>(null)

  const textWidth = textBBox?.width ? textBBox?.width + valuePadding * 2 : 0
  const textInside = textWidth < barValueWidth

  const textColor = textInside ? valueFontColorInside : valueFontColorOutside

  const textAnchor = textInside && follow ? 'end' : 'start'

  const x = follow
    ? Math.max(
        barValueWidth + (textInside ? -1 : +1) * valuePadding,
        valuePadding
      )
    : valuePadding

  return (
    <>
      <SvgTextRect
        {...{x, textAnchor, fontSize}}
        onRectChanged={setTextBBox}
        fill={textColor}
        alignmentBaseline="central"
      >
        {textValue}
      </SvgTextRect>
    </>
  )
}

const Bar: FunctionComponent<BarProps> = ({
  value,
  theme,
  y,
  barWidth,
  getFrac,
}) => {
  const {gaugeHeight, valueHeight, oveflowFraction} = theme

  const colors = getColors(theme)

  const valueFracFixed = Math.max(
    -oveflowFraction,
    Math.min(oveflowFraction + 1, getFrac(value))
  )

  const barValueWidth = barWidth * valueFracFixed
  const maxBarHeight = Math.max(gaugeHeight, valueHeight)
  const barCenter = maxBarHeight / 2

  return (
    <g className={barCssClass}>
      <g transform={`translate(${0},${y})`}>
        <BarBackground {...{colors, theme, barWidth, getFrac, barCenter}} />
        <BarValue
          {...{colors, theme, barValueWidth, value, valueFracFixed, barCenter}}
        />

        <g transform={`translate(${0},${barCenter})`}>
          <Text {...{centerY: y, colors, barValueWidth, theme, value}} />
        </g>
      </g>
    </g>
  )
}

const Axes: FunctionComponent<AxesProps> = ({theme, barWidth, y, getFrac}) => {
  const {axesSteps, axesFormater, axesFontColor, axesFontSize} = theme

  if (axesSteps === undefined || axesSteps === null) {
    return <></>
  }

  const colors = getColors(theme)
  const colorLen = colors.max.value - colors.min.value
  const axesLineStyle: React.CSSProperties = {
    stroke: axesFontColor,
    strokeWidth: 2,
    strokeLinecap: 'round',
  }

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
    text: string
    posX: number
  }[] = axesValuesArray
    .map(value => ({
      value,
      anchor: 'middle',
      lineLength: 5,
    }))
    .concat([
      {
        value: colors.min.value,
        anchor: 'start',
        lineLength: 3,
      },
      {
        value: colors.max.value,
        anchor: 'end',
        lineLength: 3,
      },
    ])
    .map(x => ({
      ...x,
      posX: getFrac(x.value) * barWidth,
      text: axesFormater(x.value),
    }))

  return (
    <>
      <g transform={`translate(${0},${y})`}>
        <line x2={barWidth} style={axesLineStyle} />
        {points.map(({posX, lineLength, anchor, text}, i) => (
          <g key={i} transform={`translate(${posX},${0})`}>
            <line y2={lineLength} style={axesLineStyle} />
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
        ))}
      </g>
    </>
  )
}

//#endregion subcomponents

export const GaugeMini: FunctionComponent<Props> = ({
  values,
  theme,
  width,
  height,
}) => {
  const {
    gaugeHeight,
    sidePaddings,
    valueHeight,
    barsDefinitions,
    barPaddings,
    labelMain,
    labelMainFontSize,
    labelMainFontColor,
    labelBarsFontColor,
    labelBarsFontSize,
  } = theme
  const [barLabelsWidth] = useState<number[]>([])

  const colors = getColors(theme)
  const colorLen = colors.max.value - colors.min.value
  const barLabelWidth = Math.max(...barLabelsWidth) || 0
  const barWidth = width - sidePaddings * 2 - barLabelWidth
  const maxBarHeight = Math.max(gaugeHeight, valueHeight)
  const allBarsHeight = values.length * (maxBarHeight + barPaddings)

  const {groupByColumns} = barsDefinitions
  const labelMapping: any = {}
  barsDefinitions?.bars?.forEach(x => {
    if (!x.label) {
      return
    }
    const mstring = createColsMString(groupByColumns, x.barDef)
    labelMapping[mstring] = x.label
  })

  const [autocenterToken, setAutocenterToken] = useState(0)
  useEffect(() => {
    setAutocenterToken(x => x + 1)
  }, [barLabelWidth, sidePaddings, valueHeight, width, height])

  /** return value as fraction 0->min 1->max */
  const getFrac = (val: number): number => (val - colors.min.value) / colorLen

  return (
    <svg
      width={width}
      height={height}
      style={{fontFamily: 'Rubik, monospace', userSelect: 'none'}}
    >
      <AutoCenterGroup enabled={true} refreshToken={autocenterToken}>
        {labelMain && (
          <text
            fill={labelMainFontColor}
            y={-barPaddings * 2}
            fontSize={labelMainFontSize}
          >
            {labelMain}
          </text>
        )}
        {values.map(({colsMString, value}, i) => {
          const y = 0 + i * (maxBarHeight + barPaddings)
          const label = labelMapping?.[colsMString]

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
          {...{
            barWidth,
            theme,
            values,
            y: allBarsHeight + barPaddings,
            getFrac,
          }}
        />
      </AutoCenterGroup>
    </svg>
  )
}
