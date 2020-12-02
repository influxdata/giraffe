// Libraries
import {indexOf} from 'lodash'

// Types
import {GeoTable} from './GeoTable'
import {isPivotSensible, PivotedGeoTable} from './PivotedGeoTable'
import {NativeGeoTable} from './NativeGeoTable'
import {Table} from '../../../types'

// Utils
import {EmptyGeoTable} from './EmptyGeoTable'

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
  autoPivoting: boolean,
  onFinalTable: (table: GeoTable) => void
): GeoTable => {
  if (autoPivoting && isPivotSensible(table)) {
    // don't delay rendering with data calculation
    setTimeout(() => {
      onFinalTable(new PivotedGeoTable(table, rowLimit))
    }, 0)
    return new EmptyGeoTable()
  }
  return new NativeGeoTable(table, rowLimit)
}

export const filterMetaColumns = (fieldNames: string[]) => {
  return fieldNames.filter(name => indexOf(QUERY_META_COLUMNS, name) < 0)
}
