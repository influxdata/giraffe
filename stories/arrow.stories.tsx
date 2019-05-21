import * as React from 'react'
import {Table} from 'apache-arrow'
import {useState, useEffect} from 'react'
import {storiesOf} from '@storybook/react'

import {Config, Plot, fromArrow} from '../src'

import {PlotContainer} from './helpers'

const LoadArrow = ({url, children}) => {
  const [data, setData] = useState(null)

  useEffect(() => {
    fetch(url)
      .then(response => response.arrayBuffer())
      .then(buffer => setData(Table.from([new Uint8Array(buffer)])))
  }, [url])

  if (!data) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        Loading...
      </div>
    )
  }

  return children(data)
}

storiesOf('Arrow-Based Plot', module).add('Simple', () => {
  const URL =
    'https://raw.githubusercontent.com/vega/vega-datasets/master/data/flights-200k.arrow'

  return (
    <LoadArrow url={URL}>
      {table => {
        const config: Config = {
          table: fromArrow(table),
          tickFont: '12px sans-serif',
          layers: [
            {
              type: 'heatmap',
              x: 'distance',
              y: 'delay',
            },
          ],
        }

        return (
          <PlotContainer>
            <Plot config={config} />
          </PlotContainer>
        )
      }}
    </LoadArrow>
  )
})
