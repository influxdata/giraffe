// Libraries
import React, {useEffect, useState} from 'react'
import {FunctionComponent, useLayoutEffect} from 'react'
import L from 'leaflet'
import {Marker} from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-markercluster'
import 'react-leaflet-markercluster/dist/styles.min.css'

// Utils
import {getColor} from './dimensionCalculations'
import {SVGIcon} from './SVGIcon'
import {defineToolTipEffect, formatValue} from './processing/toolTips'
import {GeoTooltip} from './GeoTooltip'

// Types
import {GeoTable} from './processing/GeoTable'
import {ClusterAggregation, GeoPointMapViewLayer} from '../../types/geo'
import {Config} from '../../types'

// Constants
const MARKER_ICON_SIZE = [26, 38]
const CLUSTER_ICON_SIZE = 30
const CLUSTER_ICON_SIZE_BORDER = 4
const DEFAULT_CLUSTER_COLOR = '#00a3ff'

interface Props {
  table: GeoTable
  colorFieldName: string
  properties: GeoPointMapViewLayer
  stylingConfig: Partial<Config>
  isClustered: boolean
}

const formatRowInfo = (
  properties: GeoPointMapViewLayer,
  table: GeoTable,
  index
) => {
  const result = []
  const timeValue = table.getTimeString(index)
  if (timeValue) {
    result.push({
      key: '_time',
      name: 'Time',
      type: 'string',
      values: [timeValue],
    })
  }
  const colorValue = table.getValue(index, properties.colorField)
  const {colorDimension} = properties
  const colorInfo = formatValue(
    properties.colorField,
    'Color',
    colorValue,
    colorDimension
  )
  if (colorInfo) {
    result.push(colorInfo)
  }
  return result
}

const getClusterValues = (cluster, result: number[]): GeoPointMapViewLayer => {
  let clusterRenderingProperties
  for (const marker of cluster._markers) {
    result.push(marker.value)
    clusterRenderingProperties = marker.clusterRenderingProperties
  }
  for (const childCluster of cluster._childClusters) {
    const properties = getClusterValues(childCluster, result)
    if (properties) {
      clusterRenderingProperties = properties
    }
  }
  return clusterRenderingProperties
}

const getClusterValue = (
  cluster
): {value: number; properties: GeoPointMapViewLayer} => {
  const values: number[] = []
  const properties = getClusterValues(cluster, values)
  const aggregation =
    properties.clusterAggregationFunction || ClusterAggregation.max
  switch (aggregation) {
    case ClusterAggregation.max:
      return {value: Math.max(...values), properties}
    case ClusterAggregation.min:
      return {value: Math.min(...values), properties}
    case ClusterAggregation.mean:
      return {
        value: values.reduce((a, x) => a + x, 0) / values.length,
        properties,
      }
    case ClusterAggregation.median:
      if (values.length === 1) {
        return {value: values[0], properties}
      }
      values.sort()
      if (values.length % 2 === 0) {
        const half = values.length / 2
        return {value: (values[half - 1] + values[half]) / 2, properties}
      } else {
        return {value: values[Math.floor(values.length / 2)], properties}
      }
    default:
      return {value: 0, properties}
  }
}

const createClusterCustomIcon = function(cluster) {
  let outerColor = DEFAULT_CLUSTER_COLOR,
    innerColor = 'white'
  const {value, properties} = getClusterValue(cluster)
  if (properties.areClustersColored && properties.colors) {
    innerColor = 'white'
    outerColor = getColor(properties.colors, value, false)
  }
  const outer = `\
background-color: ${outerColor};\
height: ${CLUSTER_ICON_SIZE}px;\
border-radius: ${CLUSTER_ICON_SIZE / 2}px;`
  const inner = `\
height: ${CLUSTER_ICON_SIZE - 2 * CLUSTER_ICON_SIZE_BORDER}px;\
width: ${CLUSTER_ICON_SIZE - 2 * CLUSTER_ICON_SIZE_BORDER}px;\
left: ${CLUSTER_ICON_SIZE_BORDER}px;\
top: ${CLUSTER_ICON_SIZE_BORDER}px;\
position: relative;\
border-radius:${(CLUSTER_ICON_SIZE - 2 * CLUSTER_ICON_SIZE_BORDER) / 2}px;\
background-color: ${innerColor};\
font-size: 13px;\
text-align: center;\
color: dimgray;\
line-height:${CLUSTER_ICON_SIZE - 2 * CLUSTER_ICON_SIZE_BORDER}px;`
  return L.divIcon({
    html: `<div style="${outer}"><div style="${inner}">${cluster.getChildCount()}</div></div>`,
    className: 'marker-cluster-custom',
    iconSize: L.point(CLUSTER_ICON_SIZE, CLUSTER_ICON_SIZE, true),
  })
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
    const rowInfo = formatRowInfo(properties, table, i)
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
