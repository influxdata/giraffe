import * as React from 'react'
import {FunctionComponent} from 'react'
import {
  CandlestickLayerConfig,
  CandlestickLayerSpec,
  CandleStyle,
  LayerProps,
  Scale,
} from '../types'
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
  config: CandlestickLayerConfig
  candle: CandleValue
  /** width of candle */
  width: number
  yScale: Scale<number, number>
  hovered: boolean
}

const Candle: React.FC<CandleProps> = ({
  config,
  candle,
  yScale,
  width,
  hovered,
}) => {
  const {close, high, low, open}: CandleValue = {
    close: yScale(candle.close),
    high: yScale(candle.high),
    low: yScale(candle.low),
    open: yScale(candle.open),
  }

  const isRaise = open >= close

  const style = {
    ...config[isRaise ? 'candleRaising' : 'candleDecreasing'],
    ...(hovered
      ? config[isRaise ? 'candleRaisingHover' : 'candleDecreasingHover']
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
    config.mode === 'candles' ? (
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

export const CandlestickLayer: FunctionComponent<Props> = props => {
  const {
    config: {candlePadding},
    config,
    width,
    height,
    spec,
    xScale,
    yScale,
  } = props

  const {values, calculatedWindow} = spec

  const candleWidth =
    Math.round(Math.abs((xScale(0) - xScale(calculatedWindow)) * 100)) / 100 -
    candlePadding

  const isCandleVisible = (candle: OHLCResultEntry) => {
    const x = xScale(candle.windowStart)
    // svg has inversed y drawing so lower value has higher svg coords
    const yMax = yScale(candle.yRange[0])
    const yMin = yScale(candle.yRange[1])

    return (
      x >= -candleWidth &&
      x <= width + candleWidth &&
      yMin <= height &&
      yMax >= 0
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
              transform={`translate(${xScale(windowStart) +
                candlePadding / 2},0)`}
            >
              <Candle
                width={candleWidth}
                {...{
                  yScale,
                  candle,
                  config,
                  hovered: hoveredValue?.windowStart === windowStart,
                }}
              />
            </g>
          </>
        ))}
      </svg>
      {hoveredValue && (
        <CandlestickHoverTooltipLayer {...props} value={hoveredValue} />
      )}
    </>
  )
}
