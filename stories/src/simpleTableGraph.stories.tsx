import * as React from 'react'
import {storiesOf} from '@storybook/react'
import {withKnobs, boolean} from '@storybook/addon-knobs'
import {PlotContainer} from './helpers'
import {Config, Plot} from '../../giraffe/src'
import {tableCSV} from './data/tableGraph'

storiesOf('Simple Table Graph', module)
  .addDecorator(withKnobs)
  .add('Table Graph', () => {
    const fixFirstColumn = boolean('showAll', false)

    const config: Config = {
      fluxResponse: tableCSV,
      layers: [
        {
          type: 'simple table',
          showAll: fixFirstColumn,
        },
      ],
    }

    return (
      <PlotContainer>
        <Plot config={config} />
      </PlotContainer>
    )
  })
