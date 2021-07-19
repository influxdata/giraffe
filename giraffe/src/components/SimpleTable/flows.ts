import {FromFluxResult, FluxDataType, Table} from '../../index'

export type Column =
  | {
      name: string
      type: 'number'
      fluxDataType: FluxDataType
      data: Array<number | null>
    } //  parses empty numeric values as null
  | {name: string; type: 'time'; fluxDataType: FluxDataType; data: number[]}
  | {name: string; type: 'boolean'; fluxDataType: FluxDataType; data: boolean[]}
  | {name: string; type: 'string'; fluxDataType: FluxDataType; data: string[]}

interface Columns {
  [columnKey: string]: Column
}

// This isn't actually optional, it just makes the type system work
interface InternalTable extends Table {
  columns?: Columns
}

export interface InternalFromFluxResult extends FromFluxResult {
  table: InternalTable
}

export interface FluxResult {
  source: string // the query that was used to generate the flux
  parsed: InternalFromFluxResult // the parsed result
  error?: string // any error that might have happend while fetching
}
