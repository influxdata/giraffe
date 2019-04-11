import * as React from 'react'
import {FunctionComponent} from 'react'
import {RouteComponentProps} from '@reach/router'

import {Plot, Config} from '../../../../src/'

import {TABLE, COLOR_SCHEMES} from './'

type Props = RouteComponentProps

export const HeatmapExample: FunctionComponent<Props> = ({}) => {
  const config: Config = {
    table: TABLE,
    layers: [
      {
        type: 'heatmap',
        x: '_time',
        y: '_value',
        colors: COLOR_SCHEMES.find(d => d.name === 'Inferno').colors,
      },
    ],
  }

  return (
    <div className="example-plot">
      <Plot config={config} />
    </div>
  )
}
