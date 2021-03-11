// Libraries

// import {S2LatLng} from '@raha.group/s2-geometry'
// This library is much more efficient, but it won't pass storybook->webpack->babel transpilation now
// because it is using BigInt literals
// we use the one below, it is 84KB in size
import {S2} from 's2-geometry'

// Constants
import {
  LAT_COLUMN,
  LON_COLUMN,
  START_COLUMN,
  STOP_COLUMN,
  TIME_COLUMN,
} from './tableProcessing'

// Types
import {GeoTable, LatLon, Track, getMinAndMax, MinAndMax} from './GeoTable'

export enum CoordinateEncoding {
  GEO_HASH,
  FIELDS,
}

export abstract class AbstractGeoTable implements GeoTable {
  coordinateEncoding: CoordinateEncoding

  protected constructor(coordinateEncoding: CoordinateEncoding) {
    this.coordinateEncoding = coordinateEncoding
  }

  abstract getRowCount()

  abstract getValue(index: number, field: string): number

  abstract getS2CellID(index: number): string

  abstract isTruncated(): boolean

  mapTracks<T, U>(
    _mapper: (track: Track, options: U, index: number) => T,
    _options: U
  ): T[] {
    return []
  }

  getLatLon(index: number): LatLon {
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

  getTimeString(index: number): string {
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

  crossesDateLine(
    centerPoint: LatLon = null,
    lonMinMax: MinAndMax = null
  ): boolean {
    lonMinMax = lonMinMax ? lonMinMax : getMinAndMax(this, LON_COLUMN)
    centerPoint = centerPoint ? centerPoint : this.getCenterPoint()

    const dif2Max = Math.abs(lonMinMax.max - centerPoint.lon)
    const dif2Min = Math.abs(centerPoint.lon - lonMinMax.min)
    const opDif2Max = Math.abs(lonMinMax.max - (centerPoint.lon + 180))
    const opDif2Min = Math.abs(centerPoint.lon - 180 - lonMinMax.min)

    return opDif2Max < dif2Max && opDif2Min < dif2Min
  }

  getCenterPoint(): LatLon {
    let lonMinMax
    let latMinMax
    if (this.coordinateEncoding === CoordinateEncoding.FIELDS) {
      lonMinMax = getMinAndMax(this, LON_COLUMN)
      latMinMax = getMinAndMax(this, LAT_COLUMN)
    } else if (this.coordinateEncoding === CoordinateEncoding.GEO_HASH) {
      lonMinMax = {max: -180, min: 180}
      latMinMax = {max: -90, min: 90}
      for (let i = 0; i < this.getRowCount(); i++) {
        const latLon = this.getLatLon(i)
        lonMinMax.max = latLon.lon > lonMinMax.max ? latLon.lon : lonMinMax.max
        lonMinMax.min = latLon.lon < lonMinMax.min ? latLon.lon : lonMinMax.min
        latMinMax.max = latLon.lat > latMinMax.max ? latLon.lat : latMinMax.max
        latMinMax.min = latLon.lat < latMinMax.min ? latLon.lat : latMinMax.min
      }
    } else {
      throw `Unknown coordinateEncoding ${this.coordinateEncoding} center cannot be calculated`
    }
    const result = {
      lat: (latMinMax.max + latMinMax.min) / 2,
      lon: (lonMinMax.max + lonMinMax.min) / 2,
    }
    result.lon = this.crossesDateLine(result, lonMinMax)
      ? result.lon + 180
      : result.lon
    return result
  }
}

const timestampToString = timeValue => new Date(timeValue).toLocaleString()

const PRECISION_TRIMMING_TABLE = [BigInt(1)]
for (let i = 1; i < 17; i++) {
  PRECISION_TRIMMING_TABLE[i] = PRECISION_TRIMMING_TABLE[i - 1] * BigInt(16)
}
