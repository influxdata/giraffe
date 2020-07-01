// Libraries
import {useState, FunctionComponent} from 'react'
import memoizeOne from 'memoize-one'

// Utils
import {transformTableData} from '../utils/tableGraph'
import {isEqual} from '../utils/isEqual'

// Types
import {
  TableViewProperties,
  SortOptions,
  TransformTableDataReturnType,
} from '../types'

interface Props {
  data: string[][]
  dataTypes: {[x: string]: string}
  properties: TableViewProperties
  sortOptions: SortOptions
  children: (transformedDataBundle: TransformTableDataReturnType) => JSX.Element
}

const areFormatPropertiesEqual = (
  prevProperties: Props,
  newProperties: Props
) => {
  const formatProps = ['tableOptions', 'fieldOptions', 'timeFormat', 'sort']
  if (!prevProperties.properties) {
    return false
  }
  const propsEqual = formatProps.every(k =>
    isEqual(prevProperties.properties[k], newProperties.properties[k])
  )

  return propsEqual
}

export const TableGraphTransform: FunctionComponent<Props> = (props: Props) => {
  const [memoizedTableTransform] = useState<Function>(
    memoizeOne(transformTableData, areFormatPropertiesEqual)
  )
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
