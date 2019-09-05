import * as React from 'react'
import {storiesOf} from '@storybook/react'
import {Config, Plot} from '@influxdata/giraffe'

import {PlotContainer} from './helpers'
import {CPU} from './data'

storiesOf('Custom Layer', module).add('Highlighted Region', () => {
  const config: Config = {
    table: CPU,
    layers: [
      {
        type: 'scatter',
        x: '_time',
        y: '_value',
      },
      {
        type: 'custom',
        render: ({yScale}) => {
          return (
            <div
              style={{
                width: '100%',
                position: 'absolute',
                top: `${yScale(20)}px`,
                height: `${yScale(10) - yScale(20)}px`,
                background: 'tomato',
                opacity: 0.3,
              }}
            />
          )
        },
      },
    ],
  }

  return (
    <PlotContainer>
      <Plot config={config} />
    </PlotContainer>
  )
})
