// Libraries
import React from 'react'
import {FunctionComponent} from 'react'
import AntPath from 'react-leaflet-ant-path'

// Utils

// Types
import {GeoTable} from './processing/GeoTable'
import {GeoTrackMapViewLayer} from '../../types/geo'
import {Config} from '../../types'

interface Props {
  table: GeoTable
  properties: GeoTrackMapViewLayer
  stylingConfig: Partial<Config>
}

const DEFAULT_TRACK_COLOR = [{hex: '#FFC400'}, {hex: '#F90A13'}]
const DEFAULT_TRACK_PALETTE = [
  {hex: 'blue'},
  {hex: 'red'},
  {hex: 'green'},
  {hex: 'brown'},
  {hex: 'black'},
  {hex: 'deeppink'},
  {hex: 'olive'},
]

export const TrackMapLayer: FunctionComponent<Props> = props => {
  const {table, properties} = props
  let colors = properties.colors || DEFAULT_TRACK_COLOR
  if (!properties.colors && properties.randomColors)
    colors = DEFAULT_TRACK_PALETTE

  const options = {
    weight: properties.trackWidth || 3,
    delay: 50 + (properties.speed || 500),
    hardwareAccelerated: true,
  }
  return (
    <>
      {table.mapTracks((track, options, index) => {
        let startColor, endColor
        if (properties.randomColors) {
          startColor = colors[index % DEFAULT_TRACK_PALETTE.length].hex
          endColor = 'white'
        } else {
          startColor = colors[0].hex
          endColor = colors[colors.length - 1].hex
        }

        const optionsWithColor = {
          ...options,
          color: startColor,
          pulseColor: startColor === endColor ? 'white' : endColor,
        }
        return (
          <AntPath key={index} positions={track} options={optionsWithColor} />
        )
      }, options)}
    </>
  )
}

export default TrackMapLayer
