import * as React from 'react'
import {storiesOf} from '@storybook/react'
import {withKnobs, boolean} from '@storybook/addon-knobs'
import {PlotContainer} from './helpers'
import {Config, Plot} from '../../giraffe/src'
import {tableCSV} from './data/tableGraph'

storiesOf('Simple Table Graph', module)
  .addDecorator(withKnobs)
  .add('Table Graph', () => {
    const showAll = boolean('showAll', false)

    const config: Config = {
      fluxResponse: tableCSV,
      layers: [
        {
          type: 'simple table',
          showAll: showAll,
        },
      ],
    }

    return (
      <PlotContainer>
        <Plot config={config} />
      </PlotContainer>
    )
  })
