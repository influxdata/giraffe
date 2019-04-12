import * as React from 'react'
import {useState, FunctionComponent} from 'react'
import {RouteComponentProps} from '@reach/router'

import {Plot, Config} from '../../../../src/'

import {TABLE, COLOR_SCHEMES} from './'

type Props = RouteComponentProps

export const LineExample: FunctionComponent<Props> = ({}) => {
  const [yDomain, onSetYDomain] = useState([0, 50])

  const config: Config = {
    table: TABLE,
    yDomain,
    onSetYDomain,
    onResetYDomain: () => onSetYDomain([0, 50]),
    yTickFormatter: x => `${Math.round(x)}%`,
    layers: [
      {
        type: 'line',
        x: '_time',
        y: '_value',
        fill: ['cpu'],
        colors: COLOR_SCHEMES.find(d => d.name === 'InfluxDB A').colors,
        interpolation: 'monotoneX',
      },
    ],
  }

  return (
    <div className="example-plot">
      <Plot config={config} />
    </div>
  )
}
