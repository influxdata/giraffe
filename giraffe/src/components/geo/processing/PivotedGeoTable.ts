// Types
import {
  FIELD_COLUMN,
  filterMetaColumns,
  GEO_HASH_COLUMN,
  VALUE_COLUMN,
} from './tableProcessing'
import {Table} from '../../../types'
import {getLatLonMixin, getTimeStringMixin} from './mixins'
import {CoordinateEncoding, GeoTable, Track} from './GeoTable'
import {LatLonColumns} from '../../../types/geo'

interface GeoRow {
  [key: string]: number | string
}

export const isPivotSensible = table => {
  const fieldColumn = table.getColumn(FIELD_COLUMN, 'string')
  const valueColumn = table.getColumn(VALUE_COLUMN)
  return fieldColumn && valueColumn
}

export class PivotedGeoTable implements GeoTable {
  coordinateEncoding: CoordinateEncoding
  data: GeoRow[]
  truncated: boolean
  maxRows: number
  latLonColumns: LatLonColumns

  constructor(table: Table, maxRows, latLonColumns) {
    const seriesKeyNames = filterMetaColumns(table.columnKeys)
    const seriesKeyColumns = seriesKeyNames.map(key => table.getColumn(key))
    const fieldColumn = table.getColumn(FIELD_COLUMN, 'string')
    const valueColumn = table.getColumn(VALUE_COLUMN)
    let lonFound = false,
      latFound = false
    if (!fieldColumn || !valueColumn) {
      this.coordinateEncoding = CoordinateEncoding.GEO_HASH
      this.data = []
      return
    }
    const entriesCount = fieldColumn.length
    const mapData: {[seriesKey: string]: GeoRow} = {}
    for (let i = 0; i < entriesCount; i++) {
      const seriesKey = seriesKeyColumns.map(column => column[i]).join()
      const fieldName = fieldColumn[i]
      if (!lonFound && fieldName === latLonColumns.lon.column) {
        lonFound = true
      }
      if (!latFound && fieldName === latLonColumns.lat.column) {
        latFound = true
      }
      const point = mapData[seriesKey]
      const value = valueColumn[i]
      if (
        typeof value === 'number' ||
        (typeof value === 'string' && fieldName === GEO_HASH_COLUMN)
      ) {
        if (point) {
          point[fieldName] = value
        } else {
          mapData[seriesKey] = {
            [fieldName]: value,
          }
        }
      }
    }
    this.coordinateEncoding =
      lonFound && latFound
        ? CoordinateEncoding.FIELDS
        : CoordinateEncoding.GEO_HASH
    this.maxRows = maxRows
    const rows = Object.values(mapData)
    if (rows.length > maxRows) {
      this.data = rows.slice(0, maxRows)
      this.truncated = true
    } else {
      this.data = rows
      this.truncated = false
    }
  }
  mapTracks<T, U>(
    _mapper: (track: Track, options: U, index: number) => T,
    _options: U
  ): T[] {
    return []
  }

  getRowCount(): number {
    return Math.min(this.data.length, this.maxRows)
  }

  getValue(index: number, field: string): number {
    return this.data[index][field] as number
  }

  getS2CellID(index: number): string {
    return this.data[index][GEO_HASH_COLUMN] as string
  }

  isTruncated(): boolean {
    return this.data.length <= this.maxRows
  }

  getLatLon = getLatLonMixin.bind(this)

  getTimeString = getTimeStringMixin.bind(this)
}
