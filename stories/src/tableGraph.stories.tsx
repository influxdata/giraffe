import * as React from 'react'
import {storiesOf} from '@storybook/react'
import {withKnobs, text, select} from '@storybook/addon-knobs'
import {Config, Plot} from '../../giraffe/src'

import {PlotContainer} from './helpers'
import {TableLayerConfig} from '../../giraffe/src/types'
import {DEFAULT_TABLE_COLORS} from '../../giraffe/src'

import {tableCSV} from './data/tableGraph'

storiesOf('Table Graph', module)
  .addDecorator(withKnobs)
  .add('Table Graph', () => {
    const csv = text('Paste CSV here:', '')
    console.log('csv', csv)
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
    const config: Config = {
      fluxResponse: tableCSV,
      showAxes: false,
      layers: [
        {
          type: 'table',
          properties: {
            type: 'table',
            // queries: DashboardQuery[],
            colors: DEFAULT_TABLE_COLORS,
            shape: 'chronograf-v2',
            note: '',
            showNoteWhenEmpty: false,
            tableOptions: {
              verticalTimeAxis: true,
              fixFirstColumn: false,
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
              digits: 2,
              isEnforced: true,
            },
          },
          timeZone: 'Local',
          tableTheme: 'light',
          setFieldOptions: () => {
            console.log('setFieldOptions called!')
          },
        } as TableLayerConfig,
      ],
    }
    return (
      <PlotContainer>
        <Plot config={config} />
      </PlotContainer>
    )
  })
