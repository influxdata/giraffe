// Libraries
import React, {useEffect, useState} from 'react'
import {FunctionComponent, useLayoutEffect} from 'react'
import {Marker} from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-markercluster'
import 'react-leaflet-markercluster/dist/styles.min.css'

// Utils
import {getColor} from './dimensionCalculations'
import {SVGIcon} from './SVGIcon'
import {defineToolTipEffect} from './processing/toolTips'
import {GeoTooltip} from './GeoTooltip'
import {
  formatPointLayerRowInfo,
  createClusterCustomIcon,
  MARKER_ICON_SIZE,
} from '../../utils/geo'

// Types
import {GeoTable} from './processing/GeoTable'
import {GeoPointMapViewLayer} from '../../types/geo'
import {Config} from '../../types'

interface Props {
  table: GeoTable
  colorFieldName: string
  properties: GeoPointMapViewLayer
  stylingConfig: Partial<Config>
  isClustered: boolean
}

export const PointMapLayer: FunctionComponent<Props> = props => {
  const {table, colorFieldName, properties, stylingConfig, isClustered} = props
  const rowCount = table.getRowCount()
  const result = [],
    tooltips = []
  for (let i = 0; i < rowCount; i++) {
    const latLon = table.getLatLon(i)
    if (!latLon) {
      continue
    }
    const {lat, lon} = latLon
    const colorValue = table.getValue(i, colorFieldName)
    const color = getColor(properties.colors, colorValue, false)
    const icon = SVGIcon({color: color, iconSize: MARKER_ICON_SIZE})
    const markerRef = {current: null}
    result.push(
      <Marker
        ref={ref => {
          markerRef.current = ref
          if (ref) {
            const leafletElement = ref.leafletElement
            leafletElement.clusterRenderingProperties = properties
            leafletElement.value = table.getValue(i, properties.colorField)
          }
        }}
        key={i}
        position={[lat, lon]}
        icon={icon}
      />
    )
    const rowInfo = formatPointLayerRowInfo(properties, table, i)
    tooltips.push({markerRef, rowInfo})
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
  const [visible, setVisible] = useState(true)
  useEffect(() => {
    setVisible(false)
    setTimeout(() => {
      setVisible(true)
    }, 0)
  }, [properties.areClustersColored, properties.maxClusterRadius])
  return (
    <>
      {isClustered === true && visible ? (
        <MarkerClusterGroup
          iconCreateFunction={createClusterCustomIcon}
          maxClusterRadius={properties.maxClusterRadius || 40}
        >
          {result}
        </MarkerClusterGroup>
      ) : (
        result
      )}
      {tooltip}
    </>
  )
}

export default PointMapLayer
