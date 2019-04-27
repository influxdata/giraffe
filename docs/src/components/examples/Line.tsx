import * as React from 'react'
import {useState, FunctionComponent} from 'react'
import {RouteComponentProps} from '@reach/router'

import {Plot, Config} from '../../../../src/'

import {TABLE} from './'

type Props = RouteComponentProps

export const LineExample: FunctionComponent<Props> = ({}) => {
  const config: Config = {
    table: TABLE,
    yTickFormatter: x => `${Math.round(x)}%`,
    layers: [
      {
        type: 'line',
        x: '_time',
        y: '_value',
        fill: ['cpu'],
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
