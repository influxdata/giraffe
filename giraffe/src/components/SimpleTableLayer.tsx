// Libraries
import React, {FunctionComponent} from 'react'
import {SimpleTable, SimpleTableViewProperties} from './SimpleTableGraph'

// Utils
import {fromFlux} from '../utils/fromFlux'

// Types
import {SimpleTableLayerConfig} from '../types'

interface Props {
  config: SimpleTableLayerConfig
}

export const SimpleTableLayer: FunctionComponent<Props> = (props: Props) => {
  const {showAll, fluxResponse, fromFluxResult} = props.config
  const properties: SimpleTableViewProperties = {
    type: 'simple-table',
    showAll,
  }
  const result = fromFluxResult ? fromFluxResult : fromFlux(fluxResponse)

  return <SimpleTable result={result} properties={properties} />
}
