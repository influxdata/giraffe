import * as React from 'react'
import {FunctionComponent} from 'react'
import {RouteComponentProps} from '@reach/router'

import {Plot, Config} from '../../../../src/'

import {TABLE, COLORS} from './'

type Props = RouteComponentProps

export const LineExample: FunctionComponent<Props> = ({}) => {
  const config: Config = {
    table: TABLE,
    layers: [
      {
        type: 'line',
        x: '_time',
        y: '_value',
        fill: ['cpu'],
        colors: COLORS,
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
