import * as React from 'react'
import {storiesOf} from '@storybook/react'
import {
  boolean,
  color,
  number,
  select,
  withKnobs,
  text,
} from '@storybook/addon-knobs'

import {Config, Plot} from '../../giraffe/src'

import {
  PlotContainer,
  lattitudeKnob,
  longitudeKnob,
  s2GeoHashKnob,
} from './helpers'
import {geoTable, geoTracks} from './data/geoLayer'
import {ClusterAggregation} from '../../giraffe/src/types/geo'
import {fromFlux} from '../../giraffe/src'
import {geoCSV} from './data/geo'

const osmTileServerConfiguration = {
  tileServerUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
}

const bingTileServerConfiguration = {
  // The code here is for Giraffe demo purposes only, do not use it in your own
  // projects. To get a bing maps API key, go to:
  //
  // https://docs.microsoft.com/en-us/bingmaps/getting-started/bing-maps-dev-center-help/getting-a-bing-maps-key
  bingKey: 'AtqWbnKXzGMWSAsgWknAw2cgBKuGIm9XmSbaS4fSebC5U6BdDTUF3I__u5NAp_Zi',
}

const geo = storiesOf('Geo', module).addDecorator(withKnobs)

const genericKnobs = () => {
  const latitude = number('Latitude', 40, {
    range: true,
    min: -90,
    max: 90,
    step: 1,
  })
  const longitude = number('Longitude', -76, {
    range: true,
    min: -180,
    max: 180,
    step: 1,
  })
  const zoom = number('Zoom', 6, {
    range: true,
    min: 1,
    max: 20,
    step: 1,
  })
  const allowPanAndZoom = boolean('Allow pan and zoom', true)
  const useS2CellID = boolean('Use S2 Cell ID', true)

  return {allowPanAndZoom, latitude, longitude, zoom, useS2CellID}
}

const buildCircleMapStory = tileServerConfiguration => () => {
  const numberOfRecords = number('Circle count', 26, {
    range: true,
    min: 0,
    max: 200000,
    step: 1,
  })
  const {allowPanAndZoom, latitude, longitude, zoom} = genericKnobs()
  const config: Config = {
    table: geoTable(numberOfRecords),
    showAxes: false,
    layers: [
      {
        type: 'geo',
        lat: latitude,
        lon: longitude,
        zoom,
        allowPanAndZoom,
        detectCoordinateFields: false,
        layers: [
          {
            type: 'circleMap',
            radiusField: 'magnitude',
            radiusDimension: {label: 'Magnitude'},
            colorDimension: {label: 'Duration'},
            colorField: 'duration',
            colors: [
              {type: 'min', hex: '#ff00b3'},
              {value: 50, hex: '#343aeb'},
              {type: 'max', hex: '#343aeb'},
            ],
          },
        ],
        tileServerConfiguration,
      },
    ],
  }
  return (
    <PlotContainer>
      <Plot config={config} />
    </PlotContainer>
  )
}

geo.add('Circle Markers', buildCircleMapStory(osmTileServerConfiguration))

geo.add('Map Markers Static', () => {
  const numberOfRecords = number('Marker count', 20, {
    range: true,
    min: 0,
    max: 2000,
    step: 1,
  })
  const {allowPanAndZoom, latitude, longitude, zoom} = genericKnobs()
  const config: Config = {
    table: geoTable(numberOfRecords),
    showAxes: false,
    layers: [
      {
        type: 'geo',
        lat: latitude,
        lon: longitude,
        zoom,
        allowPanAndZoom,
        detectCoordinateFields: false,
        layers: [
          {
            type: 'pointMap',
            colorDimension: {label: 'Duration'},
            colorField: 'duration',
            colors: [
              {type: 'min', hex: '#ff0000'},
              {value: 50, hex: '#343aeb'},
              {type: 'max', hex: '#343aeb'},
            ],
            isClustered: false,
          },
        ],
        tileServerConfiguration: osmTileServerConfiguration,
      },
    ],
  }
  return (
    <PlotContainer>
      <Plot config={config} />
    </PlotContainer>
  )
})

geo.add('Map Markers Custom CSV', () => {
  // const csv = text('Paste CSV here:', '')
  let table = fromFlux(geoCSV).table

  const {
    allowPanAndZoom,
    latitude,
    longitude,
    zoom,
    useS2CellID,
  } = genericKnobs()

  let lattitudeSelection, longitudeSelection, s2GeoHash

  if (!useS2CellID) {
    lattitudeSelection = lattitudeKnob(table, {key: 'field', column: 'lat'})
    longitudeSelection = longitudeKnob(table, {key: 'field', column: 'lon'})
  } else {
    s2GeoHash = s2GeoHashKnob(table, 's2_cell_id')
  }

  const config: Config = {
    table: table,
    showAxes: false,
    layers: [
      {
        type: 'geo',
        lat: latitude,
        lon: longitude,
        zoom,
        allowPanAndZoom,
        detectCoordinateFields: false,
        useS2CellID,
        s2Column: s2GeoHash,
        latLonColumns: {lat: lattitudeSelection, lon: longitudeSelection},
        layers: [
          {
            type: 'pointMap',
            colorDimension: {label: 'Duration'},
            colorField: 'duration',
            colors: [
              {type: 'min', hex: '#ff0000'},
              {value: 50, hex: '#343aeb'},
              {type: 'max', hex: '#343aeb'},
            ],
            isClustered: false,
          },
        ],
        tileServerConfiguration: osmTileServerConfiguration,
      },
    ],
  }
  return (
    <PlotContainer>
      <Plot config={config} />
    </PlotContainer>
  )
})

geo.add('Marker Clustering', () => {
  const {allowPanAndZoom, latitude, longitude, zoom} = genericKnobs()
  const maxClusterRadius = number('Maximum Cluster Radius', 50, {
    range: true,
    min: 1,
    max: 1000,
    step: 1,
  })
  const areClustersColored = boolean('Color cluster marks', true)
  const clusterAggregationFunction = select(
    'Cluster aggregation function',
    {
      Mean: ClusterAggregation.mean,
      Median: ClusterAggregation.median,
      Min: ClusterAggregation.min,
      Max: ClusterAggregation.max,
    },
    ClusterAggregation.mean
  )
  const config: Config = {
    table: geoTable(200),
    showAxes: false,
    layers: [
      {
        type: 'geo',
        lat: latitude,
        lon: longitude,
        zoom,
        allowPanAndZoom,
        detectCoordinateFields: false,
        layers: [
          {
            type: 'pointMap',
            colorDimension: {label: 'Duration'},
            colorField: 'duration',
            colors: [
              {type: 'min', hex: '#00ff00'},
              {value: 50, hex: '#ffae42'},
              {value: 60, hex: '#ff0000'},
              {type: 'max', hex: '#ff0000'},
            ],
            isClustered: true,
            areClustersColored,
            clusterAggregationFunction,
            maxClusterRadius,
          },
        ],
        tileServerConfiguration: osmTileServerConfiguration,
      },
    ],
  }
  return (
    <PlotContainer>
      <Plot config={config} />
    </PlotContainer>
  )
})

const heatmapKnobs = () => {
  const radius = number('Radius', 20, {
    range: true,
    min: 0,
    max: 100,
    step: 1,
  })
  const blur = number('Blur', 10, {
    range: true,
    min: 0,
    max: 150,
    step: 1,
  })
  return {radius, blur}
}

geo.add('Heatmap', () => {
  const numberOfPoints = number('Data point count', 200, {
    range: true,
    min: 0,
    max: 500,
    step: 1,
  })
  const {allowPanAndZoom, latitude, longitude, zoom} = genericKnobs()
  const {radius, blur} = heatmapKnobs()
  const config: Config = {
    table: geoTable(numberOfPoints),
    showAxes: false,
    layers: [
      {
        type: 'geo',
        lat: latitude,
        lon: longitude,
        zoom,
        allowPanAndZoom,
        detectCoordinateFields: false,
        layers: [
          {
            type: 'heatmap',
            radius,
            blur,
            intensityDimension: {label: 'Magnitude'},
            intensityField: 'magnitude',
          },
        ],
        tileServerConfiguration: osmTileServerConfiguration,
      },
    ],
  }
  return (
    <PlotContainer>
      <Plot config={config} />
    </PlotContainer>
  )
})

const trackKnobs = () => {
  const speed = number('Speed', 200, {
    range: true,
    min: 1,
    max: 10000,
    step: 1,
  })

  const trackWidth = number('Track width', 4, {
    range: true,
    min: 1,
    max: 15,
    step: 1,
  })
  const color1 = color('Track color 1', '#0000ff')
  const color2 = color('Track color 2', '#f0f0ff')
  const randomColors = boolean('Random colors', true)

  const endStopMarkers = boolean('End stop markers', true)
  const endStopMarkerRadius = number('End stop marker radius', 4, {
    range: true,
    min: 1,
    max: 100,
    step: 1,
  })

  return {
    speed,
    trackWidth,
    randomColors,
    color1,
    color2,
    endStopMarkers,
    endStopMarkerRadius,
  }
}

geo.add('Tracks', () => {
  const numberOfTracks = number('Track count', 3, {
    range: true,
    min: 0,
    max: 100,
    step: 1,
  })
  const {allowPanAndZoom, latitude, longitude, zoom} = genericKnobs()
  const {
    speed,
    trackWidth,
    randomColors,
    color1,
    color2,
    endStopMarkers,
    endStopMarkerRadius,
  } = trackKnobs()
  const config: Config = {
    table: geoTracks(-74, 40, numberOfTracks),
    showAxes: false,
    layers: [
      {
        type: 'geo',
        lat: latitude,
        lon: longitude,
        zoom,
        allowPanAndZoom,
        detectCoordinateFields: false,
        layers: [
          {
            type: 'trackMap',
            speed,
            trackWidth,
            randomColors,
            endStopMarkers,
            endStopMarkerRadius,
            colors: randomColors
              ? undefined
              : [
                  {type: 'min', hex: color1},
                  {type: 'max', hex: color2},
                ],
          },
        ],
        tileServerConfiguration: osmTileServerConfiguration,
      },
    ],
  }
  return (
    <PlotContainer>
      <Plot config={config} />
    </PlotContainer>
  )
})

geo.add('Tracks with Custom CSV', () => {
  const csv = text('Paste CSV here:', '')
  let table = fromFlux(csv).table

  const {allowPanAndZoom, latitude, longitude, zoom} = genericKnobs()
  const {
    speed,
    trackWidth,
    randomColors,
    color1,
    color2,
    endStopMarkers,
    endStopMarkerRadius,
  } = trackKnobs()
  const config: Config = {
    table: table,
    showAxes: false,
    layers: [
      {
        type: 'geo',
        lat: latitude,
        lon: longitude,
        zoom,
        allowPanAndZoom,
        detectCoordinateFields: false,
        layers: [
          {
            type: 'trackMap',
            speed,
            trackWidth,
            randomColors,
            endStopMarkers,
            endStopMarkerRadius,
            colors: randomColors
              ? undefined
              : [
                  {type: 'min', hex: color1},
                  {type: 'max', hex: color2},
                ],
          },
        ],
        tileServerConfiguration: osmTileServerConfiguration,
      },
    ],
  }
  return (
    <PlotContainer>
      <Plot config={config} />
    </PlotContainer>
  )
})

geo.add('Layering visualizations', () => {
  const {allowPanAndZoom, latitude, longitude, zoom} = genericKnobs()
  const {
    speed,
    trackWidth,
    color1,
    color2,
    endStopMarkers,
    endStopMarkerRadius,
  } = trackKnobs()
  const config: Config = {
    table: geoTracks(-74, 40),
    showAxes: false,
    layers: [
      {
        type: 'geo',
        lat: latitude,
        lon: longitude,
        zoom,
        allowPanAndZoom,
        detectCoordinateFields: false,
        layers: [
          {
            type: 'trackMap',
            speed,
            trackWidth,
            endStopMarkers,
            endStopMarkerRadius,
            colors: [
              {type: 'min', hex: color1},
              {type: 'max', hex: color2},
            ],
          },
          {
            type: 'pointMap',
            isClustered: false,
            colorDimension: {label: 'Duration'},
            colors: [
              {type: 'min', hex: '#ff0000'},
              {type: 'max', hex: '#343aeb'},
            ],
          },
        ],
        tileServerConfiguration: osmTileServerConfiguration,
      },
    ],
  }
  return (
    <PlotContainer>
      <Plot config={config} />
    </PlotContainer>
  )
})

geo.add(
  'Bing Maps as tile server',
  buildCircleMapStory(bingTileServerConfiguration)
)
