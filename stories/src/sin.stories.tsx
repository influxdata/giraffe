import * as React from 'react'
import {storiesOf} from '@storybook/react'

import {Config, Plot} from '../../giraffe/src'
import {SIN} from './sin'

import {PlotContainer} from './helpers'

storiesOf('Line Plot Stress Test', module).add('Line', () => {
  const config: Config = {
    table: SIN,
    layers: [
      {
        type: 'line',
        x: 'x',
        y: 'y',
        fill: ['tag'],
      },
    ],
  }

  return (
    <PlotContainer>
      <Plot config={config} />
    </PlotContainer>
  )
})
