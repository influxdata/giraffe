import * as React from 'react'
import {FunctionComponent} from 'react'
import {
  CandlestickLayerConfig,
  CandlestickLayerSpec,
  CandleStyle,
  LayerProps,
} from '../types'
import {CANDLESTICK_THEME_DARK} from '../constants/candlestickStyles'

interface CandleValue {
  open: number
  close: number
  high: number
  low: number
}

interface CandleProps {
  theme: CandlestickLayerConfig
  candle: CandleValue
  /** width of candle */
  width: number
  /** returns height position from value */
  heightPositionFormatter: (value: number) => number
}

const Candle: React.FC<CandleProps> = ({
  heightPositionFormatter,
  theme,
  candle,
  width,
}) => {
  const {close, high, low, open}: CandleValue = {
    close: heightPositionFormatter(candle.close),
    high: heightPositionFormatter(candle.high),
    low: heightPositionFormatter(candle.low),
    open: heightPositionFormatter(candle.open),
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
}

export interface Props extends LayerProps {
  config: CandlestickLayerConfig
  spec: CandlestickLayerSpec
}

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

  const getXSVGCoords = (xKey: number) => xScale(xKey * calculatedWindow)
  // (xKey: number) => ((xKey * calculatedWindow - xMin) / xLen) * width

  const candleWidth =
    Math.round(Math.abs((xScale(0) - xScale(calculatedWindow)) * 100)) / 100 -
    candlePadding
  // todo: style
  // const maxHeight = minHeight + hegihtRange

  const heightPositionFormatter: CandleProps['heightPositionFormatter'] = yScale

  return (
    <>
      <svg
        width={width}
        height={height}
        style={{fontFamily: 'Rubik, monospace', userSelect: 'none'}}
      >
        {Object.entries(values)
          .map(([xKey, candle]) => [+xKey, candle] as const)
          .map(([xKey, candle]) => (
            <>
              <g
                transform={`translate(${getXSVGCoords(xKey) -
                  candleWidth / 2},0)`}
              >
                <Candle
                  width={candleWidth}
                  {...{heightPositionFormatter, candle, theme}}
                />
              </g>
            </>
          ))}
      </svg>
    </>
  )
}
