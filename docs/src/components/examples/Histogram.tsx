import * as React from 'react'
import {useState, FunctionComponent} from 'react'
import {RouteComponentProps} from '@reach/router'

import {Plot, Config} from '../../../../src/'

import {TABLE, COLORS} from './'

type Props = RouteComponentProps

export const HistogramExample: FunctionComponent<Props> = ({}) => {
  const [xDomain, setXDomain] = useState([0, 100])

  const config: Config = {
    table: TABLE,
    xDomain,
    onSetXDomain: setXDomain,
    layers: [
      {
        type: 'histogram',
        x: '_value',
        fill: ['cpu'],
        binCount: 10,
        position: 'stacked',
        colors: COLORS,
      },
    ],
  }

  return (
    <div className="example-plot">
      <Plot config={config} />
    </div>
  )
}
