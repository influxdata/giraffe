import * as React from 'react'
import {FunctionComponent} from 'react'
import {
  CandlestickLayerConfig,
  CandlestickLayerSpec,
  LayerProps,
} from '../types'
import {Candlestick} from './Candlestick'

export interface Props extends LayerProps {
  config: CandlestickLayerConfig
  spec: CandlestickLayerSpec
}

//todo: only proxies props into Candlestick ? if true -> candlestick should be implemented here
export const CandlestickLayer: FunctionComponent<Props> = props => {
  const {config, width, height, spec} = props

  return (
    <Candlestick theme={config} {...{width, height}} values={spec.values} />
  )
}
