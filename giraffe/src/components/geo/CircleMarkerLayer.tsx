// Libraries
import React, {createRef, FunctionComponent, useLayoutEffect} from 'react'
import {CircleMarker} from 'react-leaflet'

// Utils
import {
  calculateMinAndMax,
  getColor,
  normalizeValue,
} from './dimensionCalculations'
import {defineToolTipEffect} from './processing/toolTips'
import {formatCircleMarkerRowInfo} from '../../utils/geo'

// Types
import {GeoTable} from './processing/GeoTable'
import {GeoTooltip} from './GeoTooltip'
import {Config} from '../../types'
import {GeoCircleViewLayer} from '../../types/geo'

const DEFAULT_RADIUS = 50

interface Props {
  radiusFieldName: string
  colorFieldName: string
  table: GeoTable
  properties: GeoCircleViewLayer
  stylingConfig: Partial<Config>
}

export const CircleMarkerLayer: FunctionComponent<Props> = props => {
  const {
    table,
    radiusFieldName,
    colorFieldName,
    stylingConfig,
    properties,
  } = props

  const {bounds} = properties.radiusDimension
  const radiusMinAndMax = radiusFieldName
    ? calculateMinAndMax(bounds, table, radiusFieldName)
    : null
  const result = []
  const tooltips = []
  const rowCount = table.getRowCount()
  for (let i = 0; i < rowCount; i++) {
    const latLon = table.getLatLon(i)
    if (!latLon) {
      continue
    }
    const {lat, lon} = latLon
    const radiusValue = table.getValue(i, radiusFieldName)
    if (radiusValue !== undefined) {
      const colorValue = table.getValue(i, colorFieldName)
      const radius = normalizeValue(
        radiusMinAndMax,
        properties.radius || DEFAULT_RADIUS,
        radiusValue
      )
      const color = getColor(
        properties.colors,
        colorValue,
        properties.interpolateColors
      )
      const markerRef = createRef<CircleMarker>()
      result.push(
        <CircleMarker
          key={i}
          ref={markerRef}
          center={{lon, lat}}
          color={color}
          radius={radius}
        />
      )
      const rowInfo = formatCircleMarkerRowInfo(properties, table, i)
      tooltips.push({markerRef, rowInfo})
    }
  }
  const tooltip = (
    <GeoTooltip
      stylingConfig={stylingConfig}
      onCreate={setTooltip => {
        useLayoutEffect(defineToolTipEffect(tooltips, setTooltip), [
          properties,
          table,
        ])
      }}
    />
  )
  return (
    <>
      {result}
      {tooltip}
    </>
  )
}

export default CircleMarkerLayer
