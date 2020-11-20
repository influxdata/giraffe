import * as React from 'react'
import {storiesOf} from '@storybook/react'
import {withKnobs, number, text} from '@storybook/addon-knobs'
import {Config, Plot, LASER} from '../../giraffe/src'

import {PlotContainer} from './helpers'
import {CPU} from './data/cpu'
import {singleStatTable} from './data/singleStatLayer'

storiesOf('Custom Layer', module)
  .addDecorator(withKnobs)
  .add('Highlighted Region', () => {
    const config: Config = {
      layers: [
        {
          table: CPU,
          type: 'scatter',
          x: '_time',
          y: '_value',
        },
        {
          type: 'custom',
          render: ({key, yScale}) => {
            return (
              <div
                key={key}
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
  .add('Single Stat', () => {
    const decimalPlaces = Number(text('Decimal Places', '4'))
    const textOpacity = number('Single Stat Opacity', 1, {
      range: true,
      min: 0,
      max: 1,
      step: 0.01,
    })
    const viewBoxWidth = number('SVG viewBox width', 55, {
      range: true,
      min: 0,
      max: 1000,
      step: 1,
    })
    const viewBoxX = number('SVG viewBox x', 0, {
      range: true,
      min: -500,
      max: 500,
      step: 1,
    })
    const viewBoxY = number('SVG viewBox y', 0, {
      range: true,
      min: -500,
      max: 500,
      step: 1,
    })
    const prefix = text('Prefix', '')
    const suffix = text('Suffix', '')
    const config: Config = {
      showAxes: false,
      layers: [
        {
          table: singleStatTable,
          type: 'single stat',
          prefix,
          suffix,
          decimalPlaces: {
            isEnforced: true,
            digits: decimalPlaces,
          },
          textColor: LASER,
          textOpacity,
          svgAttributes: {
            viewBox: stat =>
              `${viewBoxX} ${viewBoxY} ${stat.length * viewBoxWidth} 100`,
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
