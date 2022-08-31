import React, {FunctionComponent} from 'react'

//components
import CircleMarkerLayer from './CircleMarkerLayer'
import HeatmapLayer from './HeatmapLayer'
import PointMapLayer from './PointMapLayer'
import TrackMapLayer from './TrackMapLayer'

//types
import {
  Config,
  GeoCircleViewLayer,
  GeoHeatMapViewLayer,
  GeoPointMapViewLayer,
  GeoTrackMapViewLayer,
  GeoVie../..,
} from '../../types'
import {GeoTable} from './processing/GeoTable'

interface Props {
  layer: GeoViewLayer
  preprocessedTable: GeoTable
  index: number
  stylingConfig: Partial<Config>
}

export const LayerSwitcher: FunctionComponent<Props> = ({
  layer,
  preprocessedTable,
  index,
  stylingConfig,
}) => {
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
    default:
      return null
  }
}
