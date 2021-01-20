import {Config, Table} from '../../types'
import {GeoLayerConfig, GeoQueryVariables} from '../..'
import Geo from '../Geo'
import React from 'react'

export interface GeoLayerProps {
  table: Table
  config: GeoLayerConfig
  plotConfig: Config
}

export interface LastRenderProperties {
  latOnLastRender?: number
  lonOnLastRender?: number
  zoomOnLastRender?: number
  widthOnLastRender?: number
  heightOnLastRender?: number
  delayedQueryTimerHandle?: ReturnType<typeof setTimeout>
}

export const onAutoResize = (
  props: GeoLayerProps,
  lastRenderProperties: LastRenderProperties,
  width,
  height
) => {
  const {config, plotConfig, table} = props
  const {
    layers,
    lat,
    lon,
    zoom,
    allowPanAndZoom,
    detectCoordinateFields,
    mapStyle,
  } = config
  const {
    latOnLastRender,
    lonOnLastRender,
    zoomOnLastRender,
  } = lastRenderProperties
  updateQuery(
    props,
    lastRenderProperties,
    width,
    height,
    latOnLastRender === undefined ? lat : latOnLastRender,
    lonOnLastRender === undefined ? lon : lonOnLastRender,
    zoomOnLastRender === undefined ? zoom : zoomOnLastRender
  )
  return (
    <div className="geo">
      <Geo
        width={width}
        height={height}
        table={table}
        lat={lat}
        lon={lon}
        zoom={zoom}
        mapStyle={mapStyle}
        detectCoordinateFields={detectCoordinateFields}
        layers={layers}
        stylingConfig={plotConfig}
        onViewportChange={onViewportChange(props, lastRenderProperties)}
        allowPanAndZoom={allowPanAndZoom}
        tileServerConfiguration={config.tileServerConfiguration}
      />
    </div>
  )
}

const onViewportChange = (
  props: GeoLayerProps,
  lastRenderProperties: LastRenderProperties
) => (lat: number, lon: number, zoom: number) => {
  const {config} = props
  const {allowPanAndZoom, onUpdateViewport} = config
  if (allowPanAndZoom && onUpdateViewport) {
    onUpdateViewport(lat, lon, zoom)
  }
  const {widthOnLastRender, heightOnLastRender} = lastRenderProperties
  updateQuery(
    props,
    lastRenderProperties,
    widthOnLastRender,
    heightOnLastRender,
    lat,
    lon,
    zoom
  )
}

const updateQuery = (
  props: GeoLayerProps,
  lastRenderProperties: LastRenderProperties,
  width: number,
  height: number,
  lat: number,
  lon: number,
  zoom: number
) => {
  const {onUpdateQuery = () => {}} = props.config
  const {
    widthOnLastRender,
    heightOnLastRender,
    latOnLastRender,
    lonOnLastRender,
    zoomOnLastRender,
    delayedQueryTimerHandle,
  } = lastRenderProperties
  if (
    widthOnLastRender !== width ||
    heightOnLastRender !== height ||
    latOnLastRender !== lat ||
    lonOnLastRender !== lon ||
    zoomOnLastRender !== zoom
  ) {
    const variableAssignment = calculateVariableAssignment(
      width,
      height,
      lon,
      lat,
      zoom
    )
    if (delayedQueryTimerHandle) {
      clearInterval(lastRenderProperties.delayedQueryTimerHandle)
    }
    // we don't want to call query update too often (on window resize)
    // we get decoupled from onUpdateQuery call errors
    lastRenderProperties.delayedQueryTimerHandle = setTimeout(() => {
      if (variableAssignment.radius > 0) {
        onUpdateQuery(variableAssignment)
      }
    }, 100)
  }
  lastRenderProperties.latOnLastRender = lat
  lastRenderProperties.lonOnLastRender = lon
  lastRenderProperties.zoomOnLastRender = zoom
  lastRenderProperties.widthOnLastRender = width
  lastRenderProperties.heightOnLastRender = height
}

const calculateVariableAssignment = (
  width: number,
  height: number,
  lon: number,
  lat: number,
  zoom: number
): GeoQueryVariables => {
  const pixelRadius = Math.sqrt(width * width + height * height) / 2
  // circumference of earth = 40075016.686m
  const metersPerPixel =
    (40075016.686 * Math.abs(Math.cos((lat * Math.PI) / 180))) /
    Math.pow(2, zoom + 8)
  return {lon, lat, radius: (pixelRadius * metersPerPixel) / 1000}
}
