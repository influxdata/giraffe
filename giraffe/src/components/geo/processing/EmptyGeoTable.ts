// Types
import {AbstractGeoTable, CoordinateEncoding} from './AbstractGeoTable'

export class EmptyGeoTable extends AbstractGeoTable {
  constructor() {
    super(CoordinateEncoding.FIELDS)
  }

  getRowCount() {
    return 0
  }

  getValue(): number {
    throw new Error('assertion failed')
  }

  getS2CellID(): string {
    throw new Error('assertion failed')
  }

  isTruncated(): boolean {
    return false
  }
}
