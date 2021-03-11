// Types
import {AbstractGeoTable, CoordinateEncoding} from './AbstractGeoTable'
import {Table} from '../../../types'
import {Track} from './GeoTable'

// Constants
import {
  GEO_HASH_COLUMN,
  LAT_COLUMN,
  LON_COLUMN,
  TABLE_COLUMN,
} from './tableProcessing'

export class NativeGeoTable extends AbstractGeoTable {
  table: Table
  maxRows: number

  constructor(table: Table, maxRows: number) {
    super(getDataEncoding(table))
    this.table = table
    this.maxRows = maxRows
    if (this.table.getColumn(LAT_COLUMN) && this.table.getColumn(LON_COLUMN)) {
      this.latLonToNumber()
    }
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

  colToNumber(colName: string) {
    const column = this.table.getColumn(colName)
    if (column && typeof column[0] !== 'number') {
      for (let i = 0; i < column.length; i++) {
        column[i] = parseFloat(column[i] as string)
      }
    }
  }

  latLonToNumber() {
    this.colToNumber(LAT_COLUMN)
    this.colToNumber(LON_COLUMN)
  }

  getS2CellID(index: number): string {
    const column = this.table.getColumn(GEO_HASH_COLUMN)
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
}

const getDataEncoding = (table: Table): CoordinateEncoding => {
  if (
    table.getColumn(LON_COLUMN) !== null &&
    table.getColumn(LAT_COLUMN) !== null
  ) {
    return CoordinateEncoding.FIELDS
  }
  if (table.getColumn(GEO_HASH_COLUMN) !== null) {
    return CoordinateEncoding.GEO_HASH
  }
  return CoordinateEncoding.GEO_HASH
}
