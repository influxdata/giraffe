// Libraries
import React, {FunctionComponent, useEffect, useState} from 'react'
import {Map, TileLayer} from 'react-leaflet'
import Control from 'react-leaflet-control'
import 'leaflet/dist/leaflet.css'

// Components
import {BingMap} from './geo/bing-maps/BingMap'
import {LayerSwitcher} from './geo/LayerSwitcher'

// Utils
import {preprocessData} from './geo/processing/tableProcessing'
import {ZOOM_FRACTION, getMinZoom, getRowLimit} from '../utils/geo'

// Types
import {GeoLayerConfig} from '..'
import {Config, Table} from '../types'

interface Props extends Partial<GeoLayerConfig> {
  width: number
  height: number
  table: Table
  stylingConfig: Partial<Config>
}

const Geo: FunctionComponent<Props> = props => {
  const {width, height} = props
  if (width === 0 || height === 0) {
    return null
  }
  const {
    lat,
    lon,
    zoom,
    mapStyle,
    stylingConfig,
    allowPanAndZoom,
    useS2CellID,
    latLonColumns,
    s2Column,
  } = props
  const {layers, tileServerConfiguration} = props
  const {tileServerUrl, bingKey} = tileServerConfiguration
  const mapRef = React.createRef()

  useEffect(() => {
    ;(mapRef.current as any).leafletElement._onResize()
  }, [width, height])

  const {table, detectCoordinateFields} = props
  const [preprocessedTable, setPreprocessedTable] = useState(
    table
      ? preprocessData(
          table,
          getRowLimit(props.layers),
          useS2CellID,
          latLonColumns,
          s2Column
        )
      : null
  )

  useEffect(() => {
    const newTable = preprocessData(
      props.table,
      getRowLimit(props.layers),
      useS2CellID,
      latLonColumns,
      s2Column
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
        <BingMap bingKey={bingKey} mapStyle={mapStyle} />
      ) : (
        <TileLayer minNativeZoom={3} url={tileServerUrl} />
      )}

      {layers.map((layer, index) => {
        if (!preprocessedTable) {
          return
        }
        return (
          <LayerSwitcher
            key={index}
            layer={layer}
            preprocessedTable={preprocessedTable}
            stylingConfig={stylingConfig}
            index={index}
          />
        )
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
