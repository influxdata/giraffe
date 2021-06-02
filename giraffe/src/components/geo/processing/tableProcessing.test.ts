import {geoCSV} from '../../../../../stories/src/data/geo'
import {fromFlux} from '../../../'
// import {preprocessData} from './tableProcessing'

describe('preprocessData', () => {
  it('can return NativeGeoTable when s2 is present', () => {
    const table = fromFlux(geoCSV).table
    // const rowLimit = 2000
    // const isS2Present = true
    // const latLonColumns = {
    //   lat: {key: '', column: ''},
    //   lon: {key: '', column: ''},
    // }
    // const s2Column = `s2_cell_id`
    // const result = preprocessData(
    //   table,
    //   rowLimit,
    //   isS2Present,
    //   latLonColumns,
    //   s2Column
    // )
    // console.log(result)
  })
})
