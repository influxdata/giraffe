import {transform} from 'ol/proj.js'
import {defaults as defaultControls} from 'ol/control.js'
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style'
import Feature from 'ol/Feature'
import Map from 'ol/Map'
import View from 'ol/View'
import Point from 'ol/geom/Point'
import VectorLayer from 'ol/layer/Vector'
import HeatmapLayer from 'ol/layer/Heatmap'
import VectorSource from 'ol/source/Vector'
import TileLayer from 'ol/layer/Tile'
import XYZ from 'ol/source/XYZ'
// @ts-ignore
import {OSM} from 'ol/source'

// giraffe imports
import {DivRenderingContext} from './useDiv'
import {NumericColumnData, Scale, SymbolType} from '../types'

export interface MapControl {
  getPoints: () => VectorSource
  getSelectedFeature: () => Feature
  setMapTarget: (t: any) => void
  setHeatmapBlur: (n: number) => void
  setHeatmapRadius: (n: number) => void
}

interface InitMapOptions {
  variant: string
  zoom: number
  center: number[]
  blur: number
  radius: number
}

const style = {
  Point: new Style({
    image: new CircleStyle({
      fill: new Fill({
        color: 'rgba(255,0,0,0.75)',
      }),
      radius: 5,
      stroke: new Stroke({
        color: '#f00',
        width: 1,
      }),
    }),
  }),
  LineString: new Style({
    stroke: new Stroke({
      color: '#ff0',
      width: 3,
    }),
  }),
  MultiLineString: new Style({
    stroke: new Stroke({
      color: '#ff0',
      width: 3,
    }),
  }),
}

export const initMap = ({
  variant,
  zoom,
  center,
  blur,
  radius,
}: InitMapOptions): MapControl => {
  const points = new VectorSource()

  let featuresLayer = undefined

  if (variant == 'pointmap') {
    featuresLayer = new VectorLayer({
      source: points,
      style: function(feature) {
        let s = style[feature.getGeometry().getType() || 'Point']
        const w = feature.get('weight') // weight: 0.0 ... 1.0
        if (w != undefined) {
          s = new Style({
            image: new CircleStyle({
              fill: new Fill({
                color: 'rgba(255,0,0,0.50)',
              }),
              radius: 5 + Math.trunc(w * 50), // base radius + weight
              stroke: new Stroke({
                color: '#f00',
                width: 1,
              }),
            }),
          })
        }
        return s
      },
    })
  } else if (variant == 'heatmap') {
    featuresLayer = new HeatmapLayer({
      source: points,
      blur: blur,
      radius: radius,
      weight: function(feature) {
        return feature.get('weight')
      },
    })
  }

  // TODO configurable sources
  const tileLayer = new TileLayer({
    source: new XYZ({
      url:
        'https://api.tiles.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw',
      attributions:
        '<a href="ttps://openlayers.org/">OpenLayers</a> | © <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/about/">OpenStreetMap</a>',
    }),
    // or
    // source: new OSM(),
    // etc
  })

  const map = new Map({
    layers: [tileLayer, featuresLayer],
    controls: defaultControls({attributionOptions: {collapsible: false}}),
    view: new View({
      center: transform(center, 'EPSG:4326', 'EPSG:3857'),
      zoom: zoom,
    }),
  })

  // @ts-ignore
  map.on('moveend', function(evt) {
    // TODO get new data from InfluxDB on map moved/zoomed
  })

  let selectedFeature = null

  map.on('pointermove', function(e) {
    if (selectedFeature !== null) {
      selectedFeature = null
    }

    map.forEachFeatureAtPixel(e.pixel, function(f) {
      selectedFeature = f
      return true
    })
  })

  return {
    getPoints: () => {
      return points
    },
    getSelectedFeature: () => {
      return selectedFeature
    },
    setMapTarget: t => {
      map.setTarget(t)
    },
    setHeatmapBlur: n => {
      if (featuresLayer instanceof HeatmapLayer) {
        if (featuresLayer.getBlur() != n) {
          featuresLayer.setBlur(n)
        }
      }
    },
    setHeatmapRadius: n => {
      if (featuresLayer instanceof HeatmapLayer) {
        if (featuresLayer.getRadius() != n) {
          featuresLayer.setRadius(n)
        }
      }
    },
  }
}

interface DrawFeaturesOptions {
  context: DivRenderingContext
  xColData: NumericColumnData
  yColData: NumericColumnData
  fillColData: NumericColumnData
  symbolColData: NumericColumnData
  yScale: Scale<number, number>
  xScale: Scale<number, number>
  fillScale: Scale<number, string>
  symbolScale: Scale<number, SymbolType>
  rowIndices?: number[]
  points: VectorSource
  weightColData: NumericColumnData
  normalizeWeight: boolean
}

export const drawFeatures = ({
  // @ts-ignore
  context,
  xColData,
  yColData,
  // @ts-ignore
  fillColData,
  // @ts-ignore
  symbolColData,
  // @ts-ignore
  yScale,
  // @ts-ignore
  xScale,
  // @ts-ignore
  fillScale,
  // @ts-ignore
  symbolScale,
  rowIndices,
  points,
  weightColData,
  normalizeWeight,
}: DrawFeaturesOptions): void => {
  const n = rowIndices ? rowIndices.length : xColData.length
  const maxWeight = normalizeWeight
    ? findMaxValue(weightColData, n, rowIndices)
    : 1

  points.clear()

  for (let i = 0; i < n; i++) {
    const rowIndex = rowIndices ? rowIndices[i] : i

    const lon = xColData[rowIndex]
    const lat = yColData[rowIndex]

    const point = new Point(transform([lon, lat], 'EPSG:4326', 'EPSG:3857'))
    const feature = new Feature(point)

    const weight = weightColData[rowIndex] / maxWeight
    feature.set('weight', weight)
    feature.set('_rowIndex', rowIndex)

    points.addFeature(feature)
  }
}

function findMaxValue(
  colData: NumericColumnData,
  n: number,
  rowIndices?: number[]
): number {
  let max = 0
  for (let i = 0; i < n; i++) {
    const rowIndex = rowIndices ? rowIndices[i] : i
    const value = colData[rowIndex]
    if (value > max) {
      max = value
    }
  }
  return max
}
