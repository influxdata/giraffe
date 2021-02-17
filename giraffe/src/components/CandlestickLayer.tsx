import * as React from 'react'
import {FunctionComponent} from 'react'
import {
  CandlestickLayerConfig,
  CandlestickLayerSpec,
  CandleStyle,
  LayerProps,
} from '../types'
import {CANDLESTICK_THEME_DARK} from '../constants/candlestickStyles'
import {OHLCResultEntry} from '../utils/ohlc'
import {
  candlestickGetHoveredValueEntry,
  CandlestickHoverTooltipLayer,
} from './CandlestickHoverTooltipLayer'

interface CandleValue {
  open: number
  close: number
  high: number
  low: number
}

export interface CandleProps {
  theme: CandlestickLayerConfig
  candle: CandleValue
  /** width of candle */
  width: number
  /** returns height position from value */
  // todo: use yScale
  heightPositionFormatter: (value: number) => number
  hovered: boolean
}

const Candle: React.FC<CandleProps> = ({
  heightPositionFormatter,
  theme,
  candle,
  width,
  hovered,
}) => {
  const {close, high, low, open}: CandleValue = {
    close: heightPositionFormatter(candle.close),
    high: heightPositionFormatter(candle.high),
    low: heightPositionFormatter(candle.low),
    open: heightPositionFormatter(candle.open),
  }

  const isRaise = open >= close

  const style = {
    ...theme[isRaise ? 'candleRaising' : 'candleDecreasing'],
    ...(hovered
      ? theme[isRaise ? 'candleRaisingHover' : 'candleDecreasingHover']
      : {}),
  }

  const {
    bodyColor,
    bodyFillOpacity,
    bodyRounding,
    bodyStrokeWidth,
    shadowColor,
    shadowStrokeWidth,
  }: CandleStyle = style

  const height = Math.abs(open - close)
  const y = Math.min(open, close)

  const centerY = width / 2

  const body =
    theme.mode === 'candles' ? (
      <rect
        width={width}
        {...{y, height}}
        fill={bodyColor}
        stroke={bodyColor}
        strokeWidth={bodyStrokeWidth}
        fillOpacity={bodyFillOpacity}
        rx={bodyRounding}
        ry={bodyRounding}
      ></rect>
    ) : (
      <>
        <line
          stroke={bodyColor}
          strokeWidth={bodyStrokeWidth}
          y1={y}
          y2={y + height}
          x1={width / 2}
          x2={width / 2}
          strokeLinecap="round"
        />
        <line
          stroke={bodyColor}
          strokeWidth={bodyStrokeWidth}
          y1={open}
          y2={open}
          x1={width / 2}
          x2={0}
          strokeLinecap="round"
        />
        <line
          stroke={bodyColor}
          strokeWidth={bodyStrokeWidth}
          y1={close}
          y2={close}
          x1={width / 2}
          x2={width}
          strokeLinecap="round"
        />
      </>
    )

  const shadow = (
    <>
      {candle.high > Math.max(candle.open, candle.close) && (
        <line
          x1={centerY}
          x2={centerY}
          y1={Math.min(open, close)}
          y2={high}
          stroke={shadowColor}
          strokeWidth={shadowStrokeWidth}
          strokeLinecap="round"
        ></line>
      )}
      {candle.low < Math.min(candle.open, candle.close) && (
        <line
          x1={centerY}
          x2={centerY}
          y1={Math.max(open, close)}
          y2={low}
          stroke={shadowColor}
          strokeWidth={shadowStrokeWidth}
          strokeLinecap="round"
        ></line>
      )}
    </>
  )

  return (
    <>
      {body}
      {shadow}
    </>
  )
}

export interface Props extends LayerProps {
  config: CandlestickLayerConfig
  spec: CandlestickLayerSpec
}

export type CandlestickLayerProps = Props

//todo: only proxies props into Candlestick ? if true -> candlestick should be implemented here
export const CandlestickLayer: FunctionComponent<Props> = props => {
  const {config: _theme, width, height, spec, xScale, yScale} = props
  // todo default values already present in _theme ?
  const theme: CandlestickLayerConfig = {
    ...CANDLESTICK_THEME_DARK,
    ..._theme,
  }

  const {candlePadding} = theme

  const {values, calculatedWindow} = spec

  // todo: naming
  const getXSVGCoords = xScale
  const heightPositionFormatter: CandleProps['heightPositionFormatter'] = yScale

  const candleWidth =
    Math.round(Math.abs((xScale(0) - xScale(calculatedWindow)) * 100)) / 100 -
    candlePadding
  // todo: style
  // const maxHeight = minHeight + hegihtRange

  const isCandleVisible = (candle: OHLCResultEntry) => {
    const x = getXSVGCoords(candle.windowStart)
    const yMin = heightPositionFormatter(candle.yRange[0])
    const yMax = heightPositionFormatter(candle.yRange[1])

    return (
      x >= -candleWidth &&
      x <= width + candleWidth &&
      // svg has inversed y drawing so lower value has higher svg coords
      yMax <= height &&
      yMin >= 0
    )
  }

  const hoveredValue = candlestickGetHoveredValueEntry(props)

  return (
    <>
      <svg
        width={width}
        height={height}
        style={{fontFamily: 'Rubik, monospace', userSelect: 'none'}}
      >
        {values.filter(isCandleVisible).map(({windowStart, value: candle}) => (
          <>
            <g
              transform={`translate(${getXSVGCoords(windowStart) -
                candleWidth / 2},0)`}
            >
              <Candle
                width={candleWidth}
                {...{
                  heightPositionFormatter,
                  candle,
                  theme,
                  hovered: hoveredValue?.windowStart === windowStart,
                }}
              />
            </g>
          </>
        ))}
      </svg>
      <CandlestickHoverTooltipLayer {...props} />
    </>
  )
}
