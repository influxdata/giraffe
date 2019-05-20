import {Table as ArrowTable} from 'apache-arrow'
import {Table as VisTable, ColumnType, ColumnData} from '../types'

const TO_COLUMN_TYPE = {
  Int32: 'number',
}

class ArrowTableWrapper implements VisTable {
  private table: ArrowTable

  constructor(table: ArrowTable) {
    this.table = table
  }

  get columnKeys(): string[] {
    return this.table.schema.fields.map(f => f.name)
  }

  get length(): number {
    return this.table.length
  }

  getColumn(columnKey: string): any[] {
    // TODO: Better checks / errors
    // TODO: Memoize
    // TODO: Date? .asEpochMilliseconds().toArray()
    return this.table.getColumn(columnKey).toArray()
  }

  getColumnName(columnKey: string): string {
    // Arrow doesn't distinguish column keys and names, so we just return the
    // column key
    return columnKey
  }

  getColumnType(columnKey: string): ColumnType {
    const field = this.table.schema.fields.find(f => f.name === columnKey)

    if (!field) {
      throw new Error('column not found')
    }

    const arrowColumnType = field.type.toString()

    const visColumnType = TO_COLUMN_TYPE[arrowColumnType]

    if (!visColumnType) {
      throw new Error(
        `no conversion defined for arrow column type ${arrowColumnType}`
      )
    }

    return visColumnType
  }

  addColumn(
    columnKey: string,
    type: ColumnType,
    data: ColumnData,
    name?: string
  ): VisTable {
    // TODO: Make a field
    const field: any = null

    const field = {
      name: columnKey,
      type: {},
      nullable: false,
    }

    // {
    //   name: 'precipitation',
    //     type: { name: 'floatingpoint', precision: 'SINGLE'},
    //     nullable: false, children: []
    // },
    // {
    //   name: 'date',
    //   type: { name: 'date', unit: 'MILLISECOND' },
    //   nullable: false, children: []
    // }
    //
    // rainfall = arrow.Table.from({
    //   schema: { fields: fields },
    //   batches: [{
    //     count: LENGTH,
    //     columns: [
    //       {name: "precipitation", count: LENGTH, VALIDITY: [], DATA: rainAmounts },
    //       {name: "date",          count: LENGTH, VALIDITY: [], DATA: rainDates }
    //     ]
    //   }]
    // })

    const table = ArrowTable.from({
      schema: {fields: {...this.table.schema.fields, field}},
      // batches:
    })

    return new ArrowTableWrapper(table)
  }
}

export const fromArrow = (arrowTable: ArrowTable): VisTable => {
  return new ArrowTableWrapper(arrowTable)
}
