// Types
import {CoordinateEncoding} from './GeoTable'
import {Table} from '../../../types'
import {GeoTable, Track} from './GeoTable'

// Constants
import {
  GEO_HASH_COLUMN,
  LAT_COLUMN,
  LON_COLUMN,
  START_COLUMN,
  STOP_COLUMN,
  TABLE_COLUMN,
  TIME_COLUMN,
} from './tableProcessing'
import {getLatLonMixin} from './mixins'
import {LatLonColumns} from '../../../types/geo'
import {timestampToString} from '../../../utils/geo'

export class NativeGeoTable implements GeoTable {
  coordinateEncoding: CoordinateEncoding
  table: Table
  maxRows: number
  s2Column: string
  latLonColumns: LatLonColumns

  constructor(
    table: Table,
    maxRows: number,
    latLonColumns: LatLonColumns,
    s2Column: string
  ) {
    this.coordinateEncoding = getDataEncoding(table, latLonColumns, s2Column)
    this.table = table
    this.maxRows = maxRows
    this.s2Column = s2Column
    this.latLonColumns = latLonColumns
  }

  getRowCount() {
    return Math.min(this.table.length, this.maxRows)
  }

  getValue(index: number, field: string): number {
    const column = this.table.getColumn(field)
    if (!column) {
      return null
    }
    return column[
      index * Math.max(1, Math.floor(this.table.length / this.maxRows))
    ] as number
  }

  getS2CellID(index: number): string {
    const column = this.table.getColumn(this.s2Column || GEO_HASH_COLUMN)
    if (!column) {
      return null
    }
    const value = column[index]
    if (typeof value !== 'string') {
      return null
    }
    // this happens for geo hash only
    return value as string
  }

  isTruncated(): boolean {
    return this.table.length > this.maxRows
  }

  mapTracks<T, U>(
    mapper: (track: Track, options: U, index: number) => T,
    options: U
  ): T[] {
    const {table, maxRows} = this
    const tableColumn = table.getColumn(TABLE_COLUMN)
    const lonColumn = table.getColumn(LON_COLUMN, 'number')
    const latColumn = table.getColumn(LAT_COLUMN, 'number')
    // TODO: Palak: remove the hardcoded columns for tracks

    const result = []
    let track: Track = []
    let index = 0
    let trackNumber = 0
    while (index < table.length && index < maxRows) {
      do {
        track.push([latColumn[index], lonColumn[index]])
        index++
      } while (
        index < maxRows &&
        index < table.length &&
        (!tableColumn ||
          tableColumn.length === index + 1 ||
          tableColumn[index - 1] === tableColumn[index])
      )
      result.push(mapper(track, options, trackNumber++))
      track = []
    }
    return result
  }

  getLatLon = getLatLonMixin.bind(this)

  getTimeString(index: number): string {
    const timeValue = this.getValue(index, TIME_COLUMN)
    if (timeValue) {
      return timestampToString(timeValue)
    }
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

const getDataEncoding = (
  table: Table,
  latLonColumns: LatLonColumns,
  s2Column: string
): CoordinateEncoding => {
  if (
    typeof latLonColumns?.lat !== 'undefined' &&
    typeof latLonColumns?.lon !== 'undefined' &&
    table.getColumn(latLonColumns.lat.column) !== null &&
    table.getColumn(latLonColumns.lon.column) !== null
  ) {
    return CoordinateEncoding.FIELDS
  }
  if (table.getColumn(s2Column) !== null) {
    return CoordinateEncoding.GEO_HASH
  }
  return CoordinateEncoding.GEO_HASH
}
