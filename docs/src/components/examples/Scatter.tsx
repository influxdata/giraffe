import * as React from 'react'
import {FunctionComponent} from 'react'
import {RouteComponentProps} from '@reach/router'

import {Plot, Config} from '../../../../src/'

import {TABLE} from './'

type Props = RouteComponentProps

export const ScatterExample: FunctionComponent<Props> = () => {
  const config: Config = {
    table: TABLE,
    yDomain: [0, 50],
    layers: [
      {
        type: 'scatter',
        x: '_time',
        y: '_value',
        fill: ['cpu'],
        symbol: ['cpu'],
      },
    ],
  }
  return (
    <div className="example-plot">
      <Plot config={config} />
    </div>
  )
}
