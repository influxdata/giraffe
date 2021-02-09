// commented for chromatic testing purposes
export default {}
/*

import * as React from 'react'
import {storiesOf} from '@storybook/react'
import {withKnobs, select, boolean} from '@storybook/addon-knobs'
import {Config, Plot} from '../../giraffe/src'

import {PlotContainer} from './helpers'
import {TableGraphLayerConfig} from '../../giraffe/src/types'
import {HoverTimeProvider} from '../../giraffe/src/components/hoverTime'
import {DEFAULT_TABLE_COLORS} from '../../giraffe/src'

import {tableCSV} from './data/tableGraph'

storiesOf('Table Graph', module)
  .addDecorator(withKnobs)
  .add('Table Graph', () => {
    const timeFormat = select(
      'Time Format',
      {
        'DD/MM/YYYY HH:mm:ss.sss': 'DD/MM/YYYY HH:mm:ss.sss',
        'MM/DD/YYYY HH:mm:ss.sss': 'MM/DD/YYYY HH:mm:ss.sss',
        'YYYY/MM/DD HH:mm:ss': 'YYYY/MM/DD HH:mm:ss',
        'YYYY-MM-DD HH:mm:ss ZZ': 'YYYY-MM-DD HH:mm:ss ZZ',
        'hh:mm a': 'hh:mm a',
        'HH:mm': 'HH:mm',
        'HH:mm:ss': 'HH:mm:ss',
        'HH:mm:ss ZZ': 'HH:mm:ss ZZ',
        'HH:mm:ss.sss': 'HH:mm:ss.sss',
        'MMMM D, YYYY HH:mm:ss': 'MMMM D, YYYY HH:mm:ss',
        'dddd, MMMM D, YYYY HH:mm:ss': 'dddd, MMMM D, YYYY HH:mm:ss',
      },
      'YYYY-MM-DD HH:mm:ss ZZ'
    )
    const theme = select('Theme', {dark: 'dark', light: 'light'}, 'dark')
    const fixFirstColumn = boolean('Fix First Column', false)
    const config: Config = {
      fluxResponse: tableCSV,
      layers: [
        {
          type: 'table',
          properties: {
            colors: DEFAULT_TABLE_COLORS,
            tableOptions: {
              fixFirstColumn,
              verticalTimeAxis: true,
            },
            fieldOptions: [
              {
                displayName: '_start',
                internalName: '_start',
                visible: true,
              },
              {
                displayName: '_stop',
                internalName: '_stop',
                visible: true,
              },
              {
                displayName: '_time',
                internalName: '_time',
                visible: true,
              },
              {
                displayName: '_value',
                internalName: '_value',
                visible: true,
              },
              {
                displayName: '_field',
                internalName: '_field',
                visible: true,
              },
              {
                displayName: '_measurement',
                internalName: '_measurement',
                visible: true,
              },
              {
                displayName: 'cpu',
                internalName: 'cpu',
                visible: true,
              },
              {
                displayName: 'host',
                internalName: 'host',
                visible: true,
              },
            ],
            timeFormat,
            decimalPlaces: {
              digits: 3,
              isEnforced: true,
            },
          },
          timeZone: 'Local',
          tableTheme: theme,
        } as TableGraphLayerConfig,
      ],
    }
    return (
      <HoverTimeProvider>
        <PlotContainer>
          <Plot config={config} />
        </PlotContainer>
      </HoverTimeProvider>
    )
  })

*/
