// Libraries
import React, {FunctionComponent} from 'react'
import LeafletHeatmapLayer from 'react-leaflet-heatmap-layer'

// Types
import {GeoTable} from './processing/GeoTable'
import {GeoHeatMapViewLayer} from '../../types/geo'

// Utils
import {calculateMinAndMax, normalizeValue} from './dimensionCalculations'

interface Props {
  table: GeoTable
  intensityFieldName: string
  radius?: number
  blur?: number
  properties: GeoHeatMapViewLayer
}

const DEFAULT_BLUR = 15
const DEFAULT_RADIUS = 30
const DEFAULT_GRADIENT = {0.4: 'blue', 0.8: 'orange', 1.0: 'red'}

const HeatmapLayer: FunctionComponent<Props> = props => {
  const {properties, table, intensityFieldName, radius, blur} = props
  const {bounds} = properties.intensityDimension
  const intensityMinAndMax = intensityFieldName
    ? calculateMinAndMax(bounds, table, intensityFieldName)
    : null
  const {colors} = properties
  const leafletGradient = colors
    ? colors.reduce((acc, v, i) => {
        acc[i / (colors.length - 1)] = v.hex
        return acc
      }, {})
    : DEFAULT_GRADIENT

  const count = table.getRowCount()
  const points = []
  for (let i = 0; i < count; i++) {
    const latLon = table.getLatLon(i)
    if (!latLon) {
      continue
    }
    const intensityValue = table.getValue(i, intensityFieldName)
    if (!intensityValue) {
      continue
    }
    const normalizedValue = normalizeValue(
      intensityMinAndMax,
      1,
      intensityValue
    )
    points.push({...latLon, intensity: normalizedValue})
  }
  return (
    <LeafletHeatmapLayer
      blur={blur || DEFAULT_BLUR}
      radius={radius || DEFAULT_RADIUS}
      points={points}
      max={1}
      minOpacity={0.5}
      gradient={leafletGradient}
      longitudeExtractor={p => p.lon}
      latitudeExtractor={p => p.lat}
      intensityExtractor={p => p.intensity}
    />
  )
}

export default HeatmapLayer
