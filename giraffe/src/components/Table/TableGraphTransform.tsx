// Libraries
import {FunctionComponent} from 'react'
import memoizeOne from 'memoize-one'

// Utils
import {transformTableData} from '../../utils/tableGraph'
import {isEqual} from '../../utils/isEqual'

// Types
import {
  TableViewProperties,
  SortOptions,
  TransformTableDataReturnType,
} from '../../types'

interface Props {
  data: string[][]
  dataTypes: {[x: string]: string}
  properties: TableViewProperties
  sortOptions: SortOptions
  children: (transformedDataBundle: TransformTableDataReturnType) => JSX.Element
}

const memoizedTableTransform = memoizeOne(transformTableData, isEqual)

export const TableGraphTransform: FunctionComponent<Props> = (props: Props) => {
  const {properties, data, dataTypes, sortOptions} = props
  const {tableOptions, timeFormat, decimalPlaces, fieldOptions} = properties
  const fo =
    fieldOptions &&
    fieldOptions.map(opts => ({
      ...opts,
      dataType: dataTypes[opts.internalName],
    }))

  const transformedDataBundle = memoizedTableTransform(
    data,
    sortOptions,
    fo,
    tableOptions,
    timeFormat,
    decimalPlaces
  )
  return props.children(transformedDataBundle)
}
