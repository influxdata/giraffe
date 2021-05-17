import {S2} from 's2-geometry'
import {HEX_DIGIT_NUM} from '../../../utils/geo'
import {CoordinateEncoding} from './GeoTable'
import {Coordinates} from './GeoTable'
import {
  LAT_COLUMN,
  LON_COLUMN,
  START_COLUMN,
  STOP_COLUMN,
  TIME_COLUMN,
} from './tableProcessing'

export const getLatLonMixin = function(index: number): Coordinates {
  if (this.coordinateEncoding === CoordinateEncoding.FIELDS) {
    return {
      lon: this.getValue(index, LON_COLUMN),
      lat: this.getValue(index, LAT_COLUMN),
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

export const getTimeStringMixin = function(index: number): string {
  const timeValue = this.getValue(index, TIME_COLUMN)
  if (timeValue) {
    return timestampToString(timeValue)
  }
  const startValue = this.getValue(index, START_COLUMN)
  const stopValue = this.getValue(index, STOP_COLUMN)
  if (startValue && stopValue) {
    return `${timestampToString(startValue)} - ${timestampToString(stopValue)}`
  }
  const value = startValue || stopValue
  if (value) {
    return timestampToString(value)
  }
}

const timestampToString = timeValue => new Date(timeValue).toLocaleString()

const precisionTrimming = precisionTrimmingTable => {
  for (let i = 1; i < 17; i++) {
    precisionTrimmingTable[i] = precisionTrimmingTable[i - 1] * BigInt(16)
  }
  return precisionTrimmingTable
}
