// Types
import {
  FIELD_COLUMN,
  filterMetaColumns,
  GEO_HASH_COLUMN,
  TIME_COLUMN,
  VALUE_COLUMN,
} from './tableProcessing'
import {Table} from '../../../types'
import {getLatLonMixin} from './mixins'
import {CoordinateEncoding, GeoTable, Track} from './GeoTable'
import {LatLonColumns} from '../../../types/geo'
import {timestampToString} from '../../../utils/geo'

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
  table: Table
  data: GeoRow[]
  truncated: boolean
  maxRows: number
  latLonColumns: LatLonColumns

  constructor(table: Table, maxRows, latLonColumns) {
    this.table = table
    const seriesKeyNames = filterMetaColumns(table.columnKeys)
    const seriesKeyColumns = seriesKeyNames.map(key => table.getColumn(key))
    const fieldColumn = table.getColumn(FIELD_COLUMN, 'string')
    const valueColumn = table.getColumn(VALUE_COLUMN)

    this.latLonColumns = latLonColumns
    if (!latLonColumns) {
      const latLonObj = {
        lat: {
          key: 'field',
          column: 'lat',
        },
        lon: {
          key: 'field',
          column: 'lon',
        },
      }
      this.latLonColumns = latLonObj
    }

    let lonFound = false,
      latFound = false
    // TODO: Palak: do we need this check here?
    // If user selects lat/lon as fields:
    // Should we move it out to UI and fail gracefully ?
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
      if (!lonFound && fieldName === this.latLonColumns?.lon?.column) {
        lonFound = true
      }
      if (!latFound && fieldName === this.latLonColumns?.lat?.column) {
        latFound = true
      }
      const point = mapData[seriesKey]
      const value = valueColumn[i]
      if (
        typeof value === 'number' ||
        (typeof value === 'string' && fieldName === GEO_HASH_COLUMN) // TODO: Palak: when s2 is provided as a field name
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
    if (
      field === this.latLonColumns?.lat?.column ||
      field === this.latLonColumns?.lon?.column
    ) {
      return this.data[index][field] as number
    }
    const column = this.table.getColumn(field)
    if (!column) {
      return null
    }
    return column[
      index * Math.max(1, Math.floor(this.table.length / this.maxRows))
    ] as number
  }

  getS2CellID(index: number): string {
    return this.data[index][GEO_HASH_COLUMN] as string
  }

  isTruncated(): boolean {
    return this.data.length <= this.maxRows
  }

  getLatLon = getLatLonMixin.bind(this)

  getTimeString(index: number): string {
    const timeValue = this.getValue(index, TIME_COLUMN)

    if (timeValue) {
      return timestampToString(timeValue)
    }
  }
}
