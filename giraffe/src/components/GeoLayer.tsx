// Libraries
import React, {Component} from 'react'
import {AutoSizer} from 'react-virtualized'

// Components
import Geo from './Geo'

// Types
import {Config, Table} from '../types'
import {GeoLayerConfig, GeoQueryVariables} from '../types/geo'

interface OwnProps {
  table: Table
  config: GeoLayerConfig
  plotConfig: Config
}

class GeoLayer extends Component<OwnProps> {
  private widthOnLastRender = null
  private heightOnLastRender = null
  private latOnLastRender = null
  private lonOnLastRender = null
  private zoomOnLastRender = null
  private skipNextRender = false

  shouldComponentUpdate(): boolean {
    const {skipNextRender} = this
    if (skipNextRender) {
      this.skipNextRender = false
      return false
    }
    return true
  }

  private onViewportChange = (lat, lon, zoom) => {
    const {config} = this.props
    const {allowPanAndZoom, onUpdateViewport} = config
    if (allowPanAndZoom && onUpdateViewport) {
      onUpdateViewport(lat, lon, zoom)
    }
    this.updateQuery(
      this.widthOnLastRender,
      this.heightOnLastRender,
      lat,
      lon,
      zoom
    )
  }

  private static calculateVariableAssignment(
    width: number,
    height: number,
    lon: number,
    lat: number,
    zoom: number
  ): GeoQueryVariables {
    const pixelRadius = Math.sqrt(width * width + height * height) / 2
    // circumference of earth = 40075016.686m
    const metersPerPixel =
      (40075016.686 * Math.abs(Math.cos((lat * Math.PI) / 180))) /
      Math.pow(2, zoom + 8)
    return {lon, lat, radius: (pixelRadius * metersPerPixel) / 1000}
  }

  private updateQuery = (width, height, lat, lon, zoom) => {
    const {onUpdateQuery = () => {}} = this.props.config
    const {
      widthOnLastRender,
      heightOnLastRender,
      latOnLastRender,
      lonOnLastRender,
      zoomOnLastRender,
    } = this
    if (
      width &&
      height &&
      (widthOnLastRender !== width ||
        heightOnLastRender !== height ||
        latOnLastRender !== lat ||
        lonOnLastRender !== lon ||
        zoomOnLastRender !== zoom)
    ) {
      const variableAssignment = GeoLayer.calculateVariableAssignment(
        width,
        height,
        lon,
        lat,
        zoom
      )
      onUpdateQuery(variableAssignment)
      this.latOnLastRender = lat
      this.lonOnLastRender = lon
      this.zoomOnLastRender = zoom
      this.widthOnLastRender = width
      this.heightOnLastRender = height
    }
  }

  private onAutoResize = ({width, height}) => {
    const {config, plotConfig, table} = this.props
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
      onViewportChange,
    } = this

    this.updateQuery(
      width,
      height,
      latOnLastRender === null ? lat : latOnLastRender,
      this.lonOnLastRender === null ? lon : lonOnLastRender,
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
          onViewportChange={onViewportChange}
          allowPanAndZoom={allowPanAndZoom}
          tileServerConfiguration={config.tileServerConfiguration}
        />
      </div>
    )
  }

  public render() {
    if (this.props.config.tileServerConfiguration) {
      return <AutoSizer>{this.onAutoResize.bind(this)}</AutoSizer>
    }
    return null
  }
}

export default GeoLayer
