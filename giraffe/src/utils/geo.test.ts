import {InfluxColors} from '../constants/colorSchemes'
import {
  GeoCircleViewLayer,
  GeoPointMapViewLayer,
  GeoQueryVariables,
} from '../types/geo'
import {
  calculateVariableAssignment,
  formatCircleMarkerRowInfo,
  formatPointLayerRowInfo,
  getMinZoom,
  getRowLimit,
} from './geo'
import {preprocessData} from '../components/geo/processing/tableProcessing'
import {fromFlux} from './fromFlux'
import {geoCSV} from '../../../stories/src/data/geo'

const pointMapLayer: GeoPointMapViewLayer = {
  type: 'pointMap',
  colorDimension: {label: 'Value'},
  colorField: '_value',
  colors: [
    {type: 'min', hex: InfluxColors.Star},
    {value: 50, hex: InfluxColors.Star},
    {type: 'max', hex: InfluxColors.Star},
  ],
  isClustered: false,
}

const circleMapLayer: GeoCircleViewLayer = {
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
}

describe('getMinZoom', () => {
  it('can return minimum zoom for viewing maps', () => {
    const width = 500
    const minimumZoom = getMinZoom(width)
    expect(minimumZoom).toBe(1)
  })
})

describe('getRowLimit', () => {
  it('will return the layer limit based on layer type', () => {
    const layerLimit = getRowLimit([pointMapLayer])
    expect(layerLimit).toBe(2000)
  })
})

describe('calculateVariableAssignment', () => {
  it('can return the object with lat, lon and calculated radius', () => {
    const width = 500
    const height = 500
    const lon = 36
    const lat = 76
    const zoom = 6

    const variableAssignment = calculateVariableAssignment(
      width,
      height,
      lon,
      lat,
      zoom
    )

    const expectedVariableAssignment: GeoQueryVariables = {
      lon,
      lat,
      radius: 209.21073047462457,
    }

    expect(variableAssignment).toStrictEqual(expectedVariableAssignment)
  })
})

describe('formatCircleMarkerRowInfo', () => {
  it('can return an array with result containing radius and color fields', () => {
    const properties = circleMapLayer
    const table = fromFlux(geoCSV).table
    const latLonColumns = {
      lat: {key: '', column: ''},
      lon: {key: '', column: ''},
    }
    const geotable = preprocessData(table, 5000, false, latLonColumns, '')
    const index = 1

    const result = formatCircleMarkerRowInfo(properties, geotable, index)

    const expectedResult = [
      {
        key: '_time',
        name: 'Time',
        type: 'string',
        values: ['3/20/2019, 12:00:00 AM'],
      },
    ]
    expect(result).toEqual(expectedResult)
  })
})

describe('formatPointLayerRowInfo', () => {
  it('can return an array with result containing radius and color fields', () => {
    const properties = pointMapLayer
    const table = fromFlux(geoCSV).table
    const latLonColumns = {
      lat: {key: '', column: ''},
      lon: {key: '', column: ''},
    }
    const geotable = preprocessData(table, 5000, false, latLonColumns, '')
    const index = 1

    const result = formatPointLayerRowInfo(properties, geotable, index)

    const expectedResult = [
      {
        key: '_time',
        name: 'Time',
        type: 'string',
        values: ['3/20/2019, 12:00:00 AM'],
      },
      {key: '_value', name: 'Value', type: 'string', values: ['7.883']},
    ]
    expect(result).toEqual(expectedResult)
  })
})
