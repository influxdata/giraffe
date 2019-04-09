import * as React from 'react'
import {useState, FunctionComponent} from 'react'
import {RouteComponentProps} from '@reach/router'

import {Plot, Config} from '../../../../src/'

import {TABLE, COLOR_SCHEMES} from './'

type Props = RouteComponentProps

export const HistogramExample: FunctionComponent<Props> = ({}) => {
  const [xDomain, setXDomain] = useState([0, 50])

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
