import {InfluxColors} from '../constants/colorSchemes'
import {GeoQueryVariables, GeoViewLayer} from '../types/geo'
import {calculateVariableAssignment, getMinZoom, getRowLimit} from './geo'

const pointMapLayer: GeoViewLayer[] = [
  {
    type: 'pointMap',
    colorDimension: {label: 'Value'},
    colorField: '_value',
    colors: [
      {type: 'min', hex: InfluxColors.Star},
      {value: 50, hex: InfluxColors.Star},
      {type: 'max', hex: InfluxColors.Star},
    ],
    isClustered: false,
  },
]

describe('getMinZoom', () => {
  it('can return minimum zoom for viewing maps', () => {
    const width = 500
    const minimumZoom = getMinZoom(width)
    expect(minimumZoom).toBe(1)
  })
})

describe('getRowLimit', () => {
  it('will return the layer limit based on layer type', () => {
    const layerLimit = getRowLimit(pointMapLayer)
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
