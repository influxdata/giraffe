// Libraries
import React, {createRef, PureComponent} from 'react'
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
} from '../types/geo'
import {GeoTable} from './geo/processing/GeoTable'
import {Config, Table} from '../types'

// Constants
const ZOOM_FRACTION = 8

interface Props extends Partial<GeoLayerConfig> {
  width: number
  height: number
  table: Table
  stylingConfig: Partial<Config>
}

interface State {}

class Geo extends PureComponent<Props, State> {
  private mapRef = createRef<Map>()
  private preprocessedTable: GeoTable

  constructor(props: Props) {
    super(props)
    const {table, detectCoordinateFields} = this.props
    this.preprocessedTable = table
      ? preprocessData(
          table,
          Geo.getRowLimit(props.layers),
          detectCoordinateFields,
          preprocessedTable => {
            this.preprocessedTable = preprocessedTable
            this.forceUpdate()
          }
        )
      : null
  }

  private static getRowLimit(layers: GeoViewLayer[]) {
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

  public componentDidUpdate(prevProps: Props) {
    const {width, height} = this.props
    if (prevProps.width !== width || prevProps.height !== height)
      this.mapRef.current.leafletElement._onResize()
  }

  public componentWillReceiveProps(nextProps: Props) {
    const {width, height} = nextProps
    if (width === 0 || height === 0) return
    const {table, detectCoordinateFields} = this.props
    if (
      nextProps.table !== table ||
      nextProps.detectCoordinateFields !== detectCoordinateFields
    ) {
      this.preprocessedTable = preprocessData(
        nextProps.table,
        Geo.getRowLimit(nextProps.layers),
        nextProps.detectCoordinateFields,
        preprocessedTable => {
          this.preprocessedTable = preprocessedTable
          this.forceUpdate()
        }
      )
    }
  }

  private onViewportChange = (viewport: {center?: number[]; zoom?: number}) => {
    const {onViewportChange} = this.props
    if (onViewportChange)
      onViewportChange(viewport.center[0], viewport.center[1], viewport.zoom)
  }

  private static getMinZoom(width: number): number {
    // Math.max(Math.log2(width/256)),Math.log2(height/256))
    // while the formula above would be technically correct, problem is that
    // web map projection is square (as opposed to regular book based world maps).
    // The polar areas are extremely distorted and people don't
    // want to look at those - they usually want to see all the continents and
    // expect to see a rectangle, similar to book based maps.
    return Math.ceil(Math.log2(width / 256) * ZOOM_FRACTION) / ZOOM_FRACTION
  }

  public render() {
    const {width, height} = this.props
    if (width === 0 || height === 0) return null
    const {lat, lon, zoom, mapStyle, stylingConfig} = this.props
    const {layers, tileServerConfiguration} = this.props
    const {tileServerUrl, bingKey} = tileServerConfiguration
    const {preprocessedTable} = this
    return (
      <Map
        ref={this.mapRef}
        style={{
          width: `${width}px`,
          height: `${height}px`,
        }}
        center={{lat, lon}}
        zoom={zoom}
        minZoom={Geo.getMinZoom(width)}
        zoomDelta={1}
        zoomSnap={1 / ZOOM_FRACTION}
        onViewportChanged={this.onViewportChange}
        dragging={this.props.allowPanAndZoom}
        zoomControl={this.props.allowPanAndZoom}
        scrollWheelZoom={this.props.allowPanAndZoom}
        attributionControl={false}
      >
        {bingKey ? (
          <LayersControl position="topright">
            <LayersControl.BaseLayer
              checked={mapStyle === 'Roads'}
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
              <BingLayer
                minNativeZoom={3}
                bingkey={bingKey}
                type="CanvasDark"
              />
            </LayersControl.BaseLayer>
          </LayersControl>
        ) : (
          <TileLayer minNativeZoom={3} url={tileServerUrl} />
        )}

        {layers.map((layer, index) => {
          if (!preprocessedTable) return
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
                href="https://docs.influxdata.com/chronograf/latest/guides/geo-widget#data-downsampling"
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
}

export default Geo
