// Libraries
import React, {FunctionComponent, useMemo} from 'react'

// Components
import {SimpleTable, SimpleTableViewProperties} from './SimpleTableGraph'

// Utils
import {fromFlux, FromFluxResult} from '../../utils/fromFlux'

// Types
import {SimpleTableLayerConfig} from '../../types'

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
  const properties: SimpleTableViewProperties = useMemo(
    () => ({
      type: 'simple-table',
      showAll,
    }),
    [showAll]
  )

  const result = useMemo(
    () => (fromFluxResult ? fromFluxResult : fromFlux(fluxResponse)),
    [fluxResponse, fromFluxResult]
  )

  return useMemo(
    () => <SimpleTable result={result} properties={properties} />,
    [result, properties]
  )
}
