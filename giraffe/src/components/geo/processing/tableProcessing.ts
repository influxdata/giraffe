// Types
import {GeoTable} from './GeoTable'
import {PivotedGeoTable} from './PivotedGeoTable'
import {NativeGeoTable} from './NativeGeoTable'
import {Table} from '../../../types'
import {LatLonColumns} from '../../../types/geo'

// Constants
export const FIELD_COLUMN = '_field'
export const VALUE_COLUMN = '_value'
export const TABLE_COLUMN = 'table'
export const QUERY_META_COLUMNS = [
  FIELD_COLUMN,
  VALUE_COLUMN,
  TABLE_COLUMN,
  '_start',
  '_stop',
]

export const TIME_COLUMN = '_time'
export const START_COLUMN = '_start'
export const STOP_COLUMN = '_stop'
export const LON_COLUMN = 'lon'
export const LAT_COLUMN = 'lat'
export const GEO_HASH_COLUMN = 's2_cell_id'

export const preprocessData = (
  table: Table,
  rowLimit: number,
  isS2Present: boolean,
  latLonColumns: LatLonColumns
): GeoTable => {
  const isLatLonAsTags = latLonAsTags(isS2Present, latLonColumns)
  if (isS2Present || isLatLonAsTags) {
    return new NativeGeoTable(table, rowLimit)
  }
  // don't delay rendering with data calculation
  return new PivotedGeoTable(table, rowLimit, latLonColumns)
}

const latLonAsTags = (useS2CellID, latLonColumns) => {
  if (typeof useS2CellID !== 'undefined' && useS2CellID === false) {
    if (latLonColumns.lat.key === 'tag' && latLonColumns.lon.key === 'tag') {
      return true
    }
    return false
  }
  return false
}

export const getColumnNames = (
  table: Table,
  autoPivoting: boolean
): string[] => {
  if (autoPivoting) {
    return getFieldColumnValues(table)
  }
  return getNumericColumns(table)
}

const getFieldColumnValues = (table: Table): string[] => {
  const fieldColumn = table.getColumn(FIELD_COLUMN, 'string')
  const valueColumn = table.getColumn(VALUE_COLUMN)
  if (!fieldColumn) {
    return []
  }
  const entriesCount = fieldColumn.length
  const fieldNames = {}
  for (let i = 0; i < entriesCount; i++) {
    const fieldName = fieldColumn[i]
    if (typeof valueColumn[i] === 'number') {
      fieldNames[fieldName] = true
    }
  }
  return filterMetaColumns(Object.keys(fieldNames))
}

export const filterMetaColumns = (fieldNames: string[]) => {
  return fieldNames.filter(name => QUERY_META_COLUMNS.indexOf(name) < 0)
}

const getNumericColumns = (table: Table): string[] => {
  return table.columnKeys.filter(k => {
    if (k === 'result' || k === 'table') {
      return false
    }

    const columnType = table.getColumnType(k)

    return columnType === 'time' || columnType === 'number'
  })
}
