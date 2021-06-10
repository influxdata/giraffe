import L from 'leaflet'
import {GeoViewLayer} from '..'
import {GeoTable} from '../components/geo/processing/GeoTable'
import {
  ClusterAggregation,
  GeoCircleViewLayer,
  GeoPointMapViewLayer,
  GeoQueryVariables,
} from '../types/geo'
import {formatValue} from '../components/geo/processing/toolTips'
import {getColor} from '../components/geo/dimensionCalculations'

// Constants
export const ZOOM_FRACTION = 8
export const MARKER_ICON_SIZE = [26, 38]
export const HEX_DIGIT_NUM = 16
const circumEarth = 40075016.686
const CLUSTER_ICON_SIZE = 30
const CLUSTER_ICON_SIZE_BORDER = 4
const DEFAULT_CLUSTER_COLOR = '#00a3ff'

export const getMinZoom = (width: number): number => {
  // Math.max(Math.log2(width/256)),Math.log2(height/256))
  // while the formula above would be technically correct, problem is that
  // web map projection is square (as opposed to regular book based world maps).
  // The polar areas are extremely distorted and people don't
  // want to look at those - they usually want to see all the continents and
  // expect to see a rectangle, similar to book based maps.
  return Math.ceil(Math.log2(width / 256) * ZOOM_FRACTION) / ZOOM_FRACTION
}

export const getRowLimit = (layers: GeoViewLayer[]) => {
  return Math.min.apply(
    null,
    layers.map(l => {
      switch (l.type) {
        case 'circleMap':
          return 5000
        case 'heatmap':
          return 100000
        case 'pointMap':
          return 2000
        case 'trackMap':
          return 2000
      }
    })
  )
}

export const calculateVariableAssignment = (
  width: number,
  height: number,
  lon: number,
  lat: number,
  zoom: number
): GeoQueryVariables => {
  const pixelRadius = Math.sqrt(width * width + height * height) / 2
  const metersPerPixel =
    (circumEarth * Math.abs(Math.cos((lat * Math.PI) / 180))) /
    Math.pow(2, zoom + 8)
  return {lon, lat, radius: (pixelRadius * metersPerPixel) / 1000}
}

export const formatCircleMarkerRowInfo = (
  properties: GeoCircleViewLayer,
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

  const {colorField, radiusField} = properties
  const radiusValue = table.getValue(index, radiusField)
  const {radiusDimension} = properties
  const radiusInfo = formatValue(
    radiusField,
    'Radius',
    radiusValue,
    radiusDimension
  )
  if (radiusInfo) {
    result.push(radiusInfo)
  }

  const colorValue = table.getValue(index, colorField)
  const {colorDimension} = properties
  const colorInfo = formatValue(colorField, 'Color', colorValue, colorDimension)
  if (colorInfo) {
    result.push(colorInfo)
  }
  return result
}

export const formatPointLayerRowInfo = (
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

  if (properties.fillColumns != []) {
    properties.fillColumns.forEach(element => {
      const colorValue = table.getValue(index, element)
      const {colorDimension} = properties
      const stringInfo = element.toString()
      const fillInfo = formatValue(
        element,
        stringInfo,
        colorValue,
        colorDimension
      )
      result.push(fillInfo)
    })
  }
  return result
}

// result is being overwritten in the function below
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
        value:
          values.length >= 0
            ? values.reduce((a, x) => a + x, 0) / values.length
            : 0,
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

export const createClusterCustomIcon = function(cluster) {
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
