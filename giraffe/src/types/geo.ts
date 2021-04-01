export interface GeoLayerConfig {
  type: 'geo'
  lat: number
  lon: number
  zoom: number
  allowPanAndZoom: boolean
  mapStyle?: string
  detectCoordinateFields: boolean
  useS2CellID?: boolean
  s2Column?: string
  latLonColumns?: LatLonColumns

  onViewportChange?: (lat: number, lon: number, zoom: number) => void
  onUpdateViewport?: (lat: number, lon: number, zoom: number) => void
  onUpdateQuery?: (variables: GeoQueryVariables) => void

  layers: GeoViewLayer[]
  tileServerConfiguration: TileServerConfiguration
}

export type GeoViewLayer =
  | GeoCircleViewLayer
  | GeoHeatMapViewLayer
  | GeoPointMapViewLayer
  | GeoTrackMapViewLayer

export interface GeoViewLayerProperties {
  type: 'heatmap' | 'circleMap' | 'pointMap' | 'trackMap'
}

export type GeoHeatMapViewLayer = GeoViewLayerProperties & {
  type: 'heatmap'
  intensityField: string
  intensityDimension: Axis
  radius?: number
  blur?: number
  colors?: DashboardColor[]
}

export type GeoCircleViewLayer = GeoViewLayerProperties & {
  type: 'circleMap'
  radiusField?: string
  radiusDimension?: Axis
  colorField?: string
  colorDimension?: Axis
  colors?: DashboardColor[]
  radius?: number
  interpolateColors?: boolean
}

export enum ClusterAggregation {
  min = 'min',
  max = 'max',
  mean = 'mean',
  median = 'median',
}

export type GeoPointMapViewLayer = GeoViewLayerProperties & {
  type: 'pointMap'
  colorField?: string
  colorDimension?: Axis
  colors?: DashboardColor[]
  isClustered?: boolean
  maxClusterRadius?: number
  areClustersColored?: boolean
  clusterAggregationFunction?: ClusterAggregation
}

export type GeoTrackMapViewLayer = GeoViewLayerProperties & {
  type: 'trackMap'
  trackWidth?: number
  speed?: number
  randomColors?: boolean
  colors?: DashboardColor[]
  endStopMarkers?: boolean
  endStopMarkerRadius?: number
}

export interface Axis {
  bounds?: string[]
  label?: string
  prefix?: string
  suffix?: string
}

export interface DashboardColor {
  type?: 'min' | 'max' | 'threshold' | 'scale' | 'text' | 'background'
  hex: string
  value?: number
}

export interface TileServerConfiguration {
  tileServerUrl?: string
  bingKey?: string
}

export interface GeoQueryVariables {
  lon: number
  lat: number
  radius: number
}

export type LatLonColumns = {
  lat: LatLonColumn
  lon: LatLonColumn
}

export type LatLonColumn = {
  key: string
  column: string
}