import * as React from 'react'
import {storiesOf} from '@storybook/react'
import {boolean, text, withKnobs} from '@storybook/addon-knobs'
import {PlotContainer} from './helpers'
import {Config, Plot, fromFlux} from '../../giraffe/src'
import {tableCSV, nonNumbersInNumbersColumn} from './data/tableGraph'

storiesOf('Simple Table Graph', module)
  .addDecorator(withKnobs)
  .add('Simple Table', () => {
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
  .add('Non-numbers in a numbers column', () => {
    const showAll = boolean('showAll', false)

    const config: Config = {
      fluxResponse: nonNumbersInNumbersColumn,
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
  .add('Custom CSV:', () => {
    const csv = text('Paste CSV here:', '')

    let fromFluxResult = fromFlux(csv)
    const showAll = boolean('showAll', false)

    const config: Config = {
      fromFluxResult,
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
