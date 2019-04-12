import * as React from 'react'
import {FunctionComponent} from 'react'
import {RouteComponentProps} from '@reach/router'

import {Plot, Config} from '../../../../src/'

import {TABLE, COLOR_SCHEMES} from './'

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
        colors: COLOR_SCHEMES.find(d => d.name === 'InfluxDB A').colors,
      },
    ],
  }
  return (
    <div className="example-plot">
      <Plot config={config} />
    </div>
  )
}
