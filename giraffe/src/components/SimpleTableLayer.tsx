// Libraries
import React, {FunctionComponent} from 'react'
import {SimpleTable, SimpleTableViewProperties} from './SimpleTableGraph'

// Utils
import {fromFlux, FromFluxResult} from '../utils/fromFlux'

// Types
import {SimpleTableLayerConfig} from '../types'

interface Props {
  config: SimpleTableLayerConfig
  fluxResponse?: string
  fromFluxResult: FromFluxResult
}

export const SimpleTableLayer: FunctionComponent<Props> = ({
  config,
  fluxResponse,
  fromFluxResult,
}: Props) => {
  const {showAll} = config
  const properties: SimpleTableViewProperties = {
    type: 'simple-table',
    showAll,
  }
  const result = fromFluxResult ? fromFluxResult : fromFlux(fluxResponse)

  return <SimpleTable result={result} properties={properties} />
}
