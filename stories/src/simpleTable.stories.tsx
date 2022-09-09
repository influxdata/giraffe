import * as React from 'react'
import {storiesOf} from '@storybook/react'
import {boolean, text, withKnobs} from '@storybook/addon-knobs'
import {PlotContainer} from './helpers'
import {Config, Plot, fromFlux} from '../../giraffe/src'
import {tableCSV, nonNumbersInNumbersColumn} from './data/tableGraph'
import {largeDataSet} from './data/largeDataSet'

storiesOf('Simple Table', module)
  .addDecorator(withKnobs)
  .add('Simple Table', () => {
    const backgroundColor = text('Background contrast color:', 'black')

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
      // Simple Table needs a black background by default,
      //   override Storybook's dark grey
      <PlotContainer style={{backgroundColor}}>
        <Plot config={config} />
      </PlotContainer>
    )
  })
  .add('Non-numbers in a numbers column', () => {
    const backgroundColor = text('Background contrast color:', 'black')

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
      // Simple Table needs a black background by default,
      //   override Storybook's dark grey
      <PlotContainer style={{backgroundColor}}>
        <Plot config={config} />
      </PlotContainer>
    )
  })
  .add('Very large data set', () => {
    const backgroundColor = text('Background contrast color:', 'black')

    const showAll = boolean('showAll', false)

    const config: Config = {
      fluxResponse: largeDataSet,
      layers: [
        {
          type: 'simple table',
          showAll: showAll,
        },
      ],
    }

    return (
      // Simple Table needs a black background by default,
      //   override Storybook's dark grey
      <PlotContainer style={{backgroundColor}}>
        <Plot config={config} />
      </PlotContainer>
    )
  })
  .add('Custom CSV:', () => {
    const csv = text('Paste CSV here:', '')

    let fromFluxResult = fromFlux(csv)

    const backgroundColor = text('Background contrast color:', 'black')

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
      // Simple Table needs a black background by default,
      //   override Storybook's dark grey
      <PlotContainer style={{backgroundColor}}>
        <Plot config={config} />
      </PlotContainer>
    )
  })
