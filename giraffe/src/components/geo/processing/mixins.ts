import {S2} from 's2-geometry'
import {HEX_DIGIT_NUM} from '../../../utils/geo'
import {CoordinateEncoding} from './GeoTable'
import {Coordinates} from './GeoTable'
export const getLatLonMixin = function(index: number): Coordinates {
  if (this.coordinateEncoding === CoordinateEncoding.FIELDS) {
    return {
      lon: this.getValue(index, this.latLonColumns.lon.column),
      lat: this.getValue(index, this.latLonColumns.lat.column),
    }
  }
  const cellId = this.getS2CellID(index)
  if (cellId === null || cellId.length > HEX_DIGIT_NUM) {
    return null
  }
  const precisionTrimmingTable = [BigInt(1)]
  precisionTrimming(precisionTrimmingTable)
  const fixed =
    BigInt('0x' + cellId) *
    precisionTrimmingTable[HEX_DIGIT_NUM - cellId.length]
  const latLng = S2.idToLatLng(fixed.toString())
  return {
    lon: latLng.lng,
    lat: latLng.lat,
  }
}

const precisionTrimming = precisionTrimmingTable => {
  for (let i = 1; i < 17; i++) {
    precisionTrimmingTable[i] = precisionTrimmingTable[i - 1] * BigInt(16)
  }
  return precisionTrimmingTable
}
