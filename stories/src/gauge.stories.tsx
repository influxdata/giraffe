import * as React from 'react'
import {storiesOf} from '@storybook/react'
import {withKnobs, number, text, boolean} from '@storybook/addon-knobs'
import {Config, Plot, GaugeTheme} from '../../giraffe/src'
import {DEFAULT_GAUGE_COLORS} from '../../giraffe/src'

import {PlotContainer} from './helpers'
import {getGaugeTable} from './data/gaugeLayer'

storiesOf('Gauge', module)
  .addDecorator(withKnobs)
  .add('Gauge', () => {
    const fixed = boolean('Fixed data', false)
    const decimalPlaces = Number(text('Decimal Places', '4'))
    const lineCount = Number(text('Gauge Lines', '6'))
    const smallLineCount = Number(text('Ticks between lines', '10'))
    const valuePositionYOffset = number('Value Position Y Offset', 0.5, {
      range: true,
      min: -3,
      max: 3,
      step: 0.1,
    })
    const valuePositionXOffset = number('Value Position X Offset', 0, {
      range: true,
      min: -3,
      max: 3,
      step: 0.01,
    })
    const gaugeSize = number('Gauge Size', Number(Math.PI.toFixed(2)), {
      range: true,
      min: Number(Math.PI.toFixed(2)),
      max: Number((2 * Math.PI).toFixed(2)),
      step: 0.01,
    })
    const minLineWidth = number('Gauge Color Thickness', 22, {
      range: true,
      min: 0,
      max: 200,
      step: 1,
    })
    const gaugeMin = number('Gauge Min', 0)
    const gaugeMax = Number(text('Gauge Max', '100'))
    const prefix = text('Prefix', '')
    const suffix = text('Suffix', '')
    const tickPrefix = text('TickPrefix', '')
    const tickSuffix = text('TickSuffix', '')

    const config: Config = {
      table: getGaugeTable(fixed, gaugeMin, gaugeMax),
      layers: [
        {
          type: 'gauge',
          prefix,
          suffix,
          tickPrefix,
          tickSuffix,
          decimalPlaces: {
            isEnforced: true,
            digits: decimalPlaces,
          },
          gaugeColors: [
            {...DEFAULT_GAUGE_COLORS[0], value: gaugeMin},
            {...DEFAULT_GAUGE_COLORS[1], value: gaugeMax},
          ],
          gaugeSize,
          gaugeTheme: {
            valuePositionYOffset,
            valuePositionXOffset,
            lineCount,
            smallLineCount,
            minLineWidth,
          } as GaugeTheme,
        },
      ],
    }
    return (
      <PlotContainer>
        <Plot config={config} />
      </PlotContainer>
    )
  })
