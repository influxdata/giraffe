// Libraries
import React, {FunctionComponent} from 'react'
import {AutoSizer} from 'react-virtualized'

// Components
import Geo from './Geo'

// Types
import {Config, Table} from '../types'
import {GeoLayerConfig} from '../types/geo'
import {calculateVariableAssignment} from '../utils/geo'

interface OwnProps {
  table: Table
  config: GeoLayerConfig
  plotConfig: Config
}

interface LastRenderProperties {
  latOnLastRender?: number
  lonOnLastRender?: number
  zoomOnLastRender?: number
  widthOnLastRender?: number
  heightOnLastRender?: number
}

const onViewportChange = (
  props: OwnProps,
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
  props: OwnProps,
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
  } = lastRenderProperties
  if (
    width &&
    height &&
    (widthOnLastRender !== width ||
      heightOnLastRender !== height ||
      latOnLastRender !== lat ||
      lonOnLastRender !== lon ||
      zoomOnLastRender !== zoom)
  ) {
    const variableAssignment = calculateVariableAssignment(
      width,
      height,
      lon,
      lat,
      zoom
    )
    onUpdateQuery(variableAssignment)
    lastRenderProperties.latOnLastRender = lat
    lastRenderProperties.lonOnLastRender = lon
    lastRenderProperties.zoomOnLastRender = zoom
    lastRenderProperties.widthOnLastRender = width
    lastRenderProperties.heightOnLastRender = height
  }
}

const onAutoResize = (
  props: OwnProps,
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
    latOnLastRender === null ? lat : latOnLastRender,
    lonOnLastRender === null ? lon : lonOnLastRender,
    zoomOnLastRender === null ? zoom : zoomOnLastRender
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
        useS2CellID={config.useS2CellID}
        s2Column={config.s2Column}
        latLonColumns={config.latLonColumns}
      />
    </div>
  )
}

const GeoLayer: FunctionComponent<OwnProps> = React.memo(props => {
  if (props.config.tileServerConfiguration) {
    return (
      <AutoSizer>
        {(() => {
          const lastRenderProperties: LastRenderProperties = {}
          return ({width, height}) =>
            onAutoResize(props, lastRenderProperties, width, height)
        })()}
      </AutoSizer>
    )
  }
  return null
})

export default GeoLayer
