import {S2} from 's2-geometry'
import {CoordinateEncoding} from './GeoTable'
import {LatLon} from './GeoTable'
import {
  LAT_COLUMN,
  LON_COLUMN,
  START_COLUMN,
  STOP_COLUMN,
  TIME_COLUMN,
} from './tableProcessing'

export const getLatLonMixin = function(index: number): LatLon {
  if (this.coordinateEncoding === CoordinateEncoding.FIELDS) {
    return {
      lon: this.getValue(index, LON_COLUMN),
      lat: this.getValue(index, LAT_COLUMN),
    }
  } else {
    const cellId = this.getS2CellID(index)
    if (cellId === null || cellId.length > 16) {
      return null
    }
    const fixed =
      BigInt('0x' + cellId) * PRECISION_TRIMMING_TABLE[16 - cellId.length]
    const latLng = S2.idToLatLng(fixed.toString()) // S2LatLng.fromInteger(fixed)
    return {
      lon: latLng.lng,
      lat: latLng.lat,
    }
  }
}

export const getTimeStringMixin = function(index: number): string {
  const timeValue = this.getValue(index, TIME_COLUMN)
  if (timeValue) {
    return timestampToString(timeValue)
  } else {
    const startValue = this.getValue(index, START_COLUMN)
    const stopValue = this.getValue(index, STOP_COLUMN)
    if (startValue && stopValue) {
      return `${timestampToString(startValue)} - ${timestampToString(
        stopValue
      )}`
    }
    const value = startValue || stopValue
    if (value) {
      return timestampToString(value)
    }
  }
}

const timestampToString = timeValue => new Date(timeValue).toLocaleString()

const PRECISION_TRIMMING_TABLE = [BigInt(1)]
for (let i = 1; i < 17; i++) {
  PRECISION_TRIMMING_TABLE[i] = PRECISION_TRIMMING_TABLE[i - 1] * BigInt(16)
}
