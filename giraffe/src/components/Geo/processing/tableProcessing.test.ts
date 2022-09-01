import {geoCSV} from '../../../../../stories/src/data/geo'
import {fromFlux} from '../../../utils/fromFlux'
import {NativeGeoTable} from './NativeGeoTable'
import {PivotedGeoTable} from './PivotedGeoTable'
import {preprocessData} from './tableProcessing'

describe('preprocessData', () => {
  it('can return NativeGeoTable when s2 is present', () => {
    const table = fromFlux(geoCSV).table
    const rowLimit = 2000
    const isS2Present = true
    const latLonColumns = {
      lat: {key: '', column: ''},
      lon: {key: '', column: ''},
    }
    const s2Column = 's2_cell_id'

    const result = preprocessData(
      table,
      rowLimit,
      isS2Present,
      latLonColumns,
      s2Column
    )

    expect(result).toBeInstanceOf(NativeGeoTable)
  })

  it('can return NativeGeoTable when lat lon are provided as tags', () => {
    const table = fromFlux(geoCSV).table
    const rowLimit = 2000
    const isS2Present = false
    const latLonColumns = {
      lat: {key: 'tag', column: 'lat'},
      lon: {key: 'tag', column: 'lon'},
    }
    const s2Column = ''

    const result = preprocessData(
      table,
      rowLimit,
      isS2Present,
      latLonColumns,
      s2Column
    )

    expect(result).toBeInstanceOf(NativeGeoTable)
  })

  it('can return PivotedGeoTable when lat lon are provided fields', () => {
    const table = fromFlux(geoCSV).table
    const rowLimit = 2000
    const isS2Present = false
    const latLonColumns = {
      lat: {key: 'field', column: 'lat'},
      lon: {key: 'field', column: 'lon'},
    }
    const s2Column = ''

    const result = preprocessData(
      table,
      rowLimit,
      isS2Present,
      latLonColumns,
      s2Column
    )

    expect(result).toBeInstanceOf(PivotedGeoTable)
  })
})
