import React from 'react'
import {CANDLESTICK_THEME_DARK} from '../constants/candlestickStyles'
import {CandlestickLayerConfig, CandleStyle} from '../types'

interface CandleValue {
  open: number
  close: number
  high: number
  low: number
}

interface CandlestickProps {
  theme: Partial<CandlestickLayerConfig>
  values: CandleValue[]
  width: number
  height: number
}

interface CandleProps {
  theme: CandlestickLayerConfig
  value: CandleValue
  /** width of candle */
  width: number
  /** returns height position from value */
  heightPositionFormatter: (value: number) => number
}

const Candle: React.FC<CandleProps> = ({
  heightPositionFormatter,
  theme,
  value,
  width,
}) => {
  const {close, high, low, open}: CandleValue = {
    close: heightPositionFormatter(value.close),
    high: heightPositionFormatter(value.high),
    low: heightPositionFormatter(value.low),
    open: heightPositionFormatter(value.open),
  }

  const isRaise = open >= close

  const {
    bodyColor,
    bodyFillOpacity,
    bodyRounding,
    bodyStrokeWidth,
    shadowColor,
    shadowStrokeWidth,
  }: CandleStyle = theme[isRaise ? 'candleRaising' : 'candleDecreasing']

  const height = Math.abs(open - close)
  const y = Math.min(open, close)

  const centerY = width / 2

  return (
    <>
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
      {value.high > Math.max(value.open, value.close) && (
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
      {value.low < Math.min(value.open, value.close) && (
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
}

export const Candlestick: React.FC<CandlestickProps> = ({
  theme: _theme,
  values,
  width,
  height,
}) => {
  const theme: CandlestickLayerConfig = {
    ...CANDLESTICK_THEME_DARK,
    ..._theme,
  }

  const {
    candlePadding,
    // candleDecreasing, candleRaising, mode
  } = theme

  const candles = values.length
  const candleWidthStep = width / candles
  const candleWidth = candleWidthStep - candlePadding
  // todo: style
  const hegihtRange = height - 2
  // const maxHeight = minHeight + hegihtRange

  const allValues = values.map(x => [x.open, x.close, x.high, x.low]).flat()
  const minValue = Math.min(...allValues)
  const maxValue = Math.max(...allValues)
  const valueRange = maxValue - minValue

  const heightPositionFormatter: CandleProps['heightPositionFormatter'] = (
    value: number
  ) => {
    const valueFrac = (value - minValue) / valueRange
    return (1 - valueFrac) * hegihtRange
  }

  return (
    <>
      <svg
        width={width}
        height={height}
        style={{fontFamily: 'Rubik, monospace', userSelect: 'none'}}
      >
        {values.map((x, i) => (
          <>
            <g transform={`translate(${candleWidthStep * i},0)`}>
              <Candle
                theme={theme}
                value={x}
                {...{heightPositionFormatter}}
                width={candleWidth}
              />
            </g>
          </>
        ))}
      </svg>
    </>
  )
}
