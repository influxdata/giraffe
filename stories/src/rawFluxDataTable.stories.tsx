import * as React from 'react'
import {storiesOf} from '@storybook/react'
import {withKnobs, text} from '@storybook/addon-knobs'
import {Config, Plot} from '../../giraffe/src'

import {PlotContainer} from './helpers'
import {RawFluxDataTableLayerConfig} from '../../giraffe/src/types'

import {fluxCSV} from './data/fluxCSV'

storiesOf('Raw Flux Data Table', module)
  .addDecorator(withKnobs)
  .add('Raw Flux Data Table', () => {
    const csv = text('Paste CSV here:', '')
    console.log('csv', csv)

    const config: Config = {
      fluxResponse: csv || fluxCSV,
      showAxes: false,
      layers: [
        {
          type: 'flux data table',
          // height: 100,
          // width: 100,
          disableVerticalScrolling: false,
        } as RawFluxDataTableLayerConfig,
      ],
    }
    return (
      <PlotContainer>
        <Plot config={config} />
      </PlotContainer>
    )
  })
