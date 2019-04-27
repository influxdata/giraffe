import * as React from 'react'
import {useState, FunctionComponent} from 'react'
import {RouteComponentProps} from '@reach/router'

import {Plot, Config} from '../../../../src/'

import {TABLE} from './'

type Props = RouteComponentProps

export const HistogramExample: FunctionComponent<Props> = ({}) => {
  const [xDomain, setXDomain] = useState([0, 50])

  const config: Config = {
    table: TABLE,
    xTickFormatter: tick => `${Math.round(tick)}%`,
    xDomain,
    onSetXDomain: setXDomain,
    layers: [
      {
        type: 'histogram',
        x: '_value',
        fill: ['cpu'],
        binCount: 10,
      },
    ],
  }

  return (
    <div className="example-plot">
      <Plot config={config} />
    </div>
  )
}
