// Libraries
import React, {FunctionComponent, useEffect, useState} from 'react'
import BingLayer from './geo/bing-maps/Bing'
import {Map, TileLayer, LayersControl} from 'react-leaflet'
import Control from 'react-leaflet-control'
import 'leaflet/dist/leaflet.css'

// Components
import CircleMarkerLayer from './geo/CircleMarkerLayer'
import HeatmapLayer from './geo/HeatmapLayer'
import PointMapLayer from './geo/PointMapLayer'
import TrackMapLayer from './geo/TrackMapLayer'

// Utils
import {preprocessData} from './geo/processing/tableProcessing'

// Types
import {
  GeoCircleViewLayer,
  GeoHeatMapViewLayer,
  GeoLayerConfig,
  GeoPointMapViewLayer,
  GeoTrackMapViewLayer,
  GeoViewLayer,
} from '..'
import {Config, Table} from '../types'

// Constants
const ZOOM_FRACTION = 8

interface Props extends Partial<GeoLayerConfig> {
  width: number
  height: number
  table: Table
  stylingConfig: Partial<Config>
}

const getRowLimit = (layers: GeoViewLayer[]) => {
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

const getMinZoom = (width: number): number => {
  // Math.max(Math.log2(width/256)),Math.log2(height/256))
  // while the formula above would be technically correct, problem is that
  // web map projection is square (as opposed to regular book based world maps).
  // The polar areas are extremely distorted and people don't
  // want to look at those - they usually want to see all the continents and
  // expect to see a rectangle, similar to book based maps.
  return Math.ceil(Math.log2(width / 256) * ZOOM_FRACTION) / ZOOM_FRACTION
}

const Geo: FunctionComponent<Props> = props => {
  const {width, height} = props
  if (width === 0 || height === 0) {
    return null
  }
  const {lat, lon, zoom, mapStyle, stylingConfig, allowPanAndZoom} = props
  const {layers, tileServerConfiguration} = props
  const {tileServerUrl, bingKey} = tileServerConfiguration
  const mapRef = React.createRef()

  useEffect(() => {
    ;(mapRef.current as any).leafletElement._onResize()
  }, [width, height])

  const {table, detectCoordinateFields} = props
  const [preprocessedTable, setPreprocessedTable] = useState(
    table
      ? preprocessData(table, getRowLimit(props.layers), detectCoordinateFields)
      : null
  )

  useEffect(() => {
    const newTable = preprocessData(
      props.table,
      getRowLimit(props.layers),
      props.detectCoordinateFields
    )
    setPreprocessedTable(newTable)
  }, [table, detectCoordinateFields])

  const onViewportChange = (viewport: {center?: number[]; zoom?: number}) => {
    const {onViewportChange} = props
    if (onViewportChange) {
      onViewportChange(viewport.center[0], viewport.center[1], viewport.zoom)
    }
  }

  const latLon = preprocessedTable.getLatLon(0)
  const mapCenter = {
    lat: latLon ? latLon.lat : lat,
    lon: latLon ? latLon.lon : lon,
  }

  return (
    <Map
      ref={mapRef}
      style={{
        width: `${width}px`,
        height: `${height}px`,
      }}
      center={mapCenter}
      zoom={zoom}
      minZoom={getMinZoom(width)}
      zoomDelta={1}
      zoomSnap={1 / ZOOM_FRACTION}
      onViewportChanged={onViewportChange}
      dragging={allowPanAndZoom}
      zoomControl={allowPanAndZoom}
      scrollWheelZoom={allowPanAndZoom}
      attributionControl={false}
    >
      {bingKey ? (
        <LayersControl position="topright">
          <LayersControl.BaseLayer
            checked={!mapStyle || mapStyle === 'Roads'}
            name="Roads"
          >
            <BingLayer minNativeZoom={3} bingkey={bingKey} type="Road" />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer
            checked={mapStyle === 'Satellite (plain)'}
            name="Satellite (Plain)"
          >
            <BingLayer minNativeZoom={3} bingkey={bingKey} />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer
            checked={mapStyle === 'Satellite'}
            name="Satellite (Labels)"
          >
            <BingLayer
              minNativeZoom={3}
              bingkey={bingKey}
              type="AerialWithLabels"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer
            checked={mapStyle === 'Dark'}
            name="Dark mode"
          >
            <BingLayer minNativeZoom={3} bingkey={bingKey} type="CanvasDark" />
          </LayersControl.BaseLayer>
        </LayersControl>
      ) : (
        <TileLayer minNativeZoom={3} url={tileServerUrl} />
      )}

      {layers.map((layer, index) => {
        if (!preprocessedTable) {
          return
        }
        switch (layer.type) {
          case 'circleMap':
            const circleLayer = layer as GeoCircleViewLayer
            return (
              <CircleMarkerLayer
                key={index}
                radiusFieldName={circleLayer.radiusField}
                colorFieldName={circleLayer.colorField}
                table={preprocessedTable}
                properties={circleLayer}
                stylingConfig={stylingConfig}
              />
            )
          case 'heatmap':
            const heatmapLayer = layer as GeoHeatMapViewLayer
            return (
              <HeatmapLayer
                key={index}
                intensityFieldName={heatmapLayer.intensityField}
                table={preprocessedTable}
                blur={heatmapLayer.blur}
                radius={heatmapLayer.radius}
                properties={heatmapLayer}
              />
            )
          case 'pointMap':
            const pointMapLayer = layer as GeoPointMapViewLayer
            return (
              <PointMapLayer
                key={index}
                colorFieldName={pointMapLayer.colorField}
                table={preprocessedTable}
                properties={pointMapLayer}
                stylingConfig={stylingConfig}
                isClustered={pointMapLayer.isClustered === true}
              />
            )
          case 'trackMap':
            const trackMapLayer = layer as GeoTrackMapViewLayer
            return (
              <TrackMapLayer
                key={index}
                table={preprocessedTable}
                properties={trackMapLayer}
                stylingConfig={stylingConfig}
              />
            )
        }
      })}
      {preprocessedTable && preprocessedTable.isTruncated() && (
        <Control position="bottomleft">
          <div
            style={{
              backgroundColor: 'white',
              padding: '5px',
              borderRadius: '4px',
              boxShadow: '0 1px 5px rgba(0, 0, 0, 0.65)',
              color: 'gray',
            }}
            className="truncatedResults"
          >
            Results are truncated.
            <a
              href="https://docs.influxdata.com/influxdb/cloud/visualize-data/visualization-types/map/"
              target="_blank"
            >
              More...
            </a>
          </div>
        </Control>
      )}
    </Map>
  )
}

export default Geo
