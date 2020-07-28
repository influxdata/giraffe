// Libraries
import React, {useMemo, FunctionComponent} from 'react'
import {Table} from '../types'

// Utils
import {getLatestValues} from '../utils/getLatestValues'
import {isString} from '../utils/isString'

interface Props {
  table: Table
  children: (latestValue: number) => JSX.Element
  allowString: boolean
  // If `quiet` is set and a latest value can't be found, this component will
  // display nothing instead of an empty graph error message
  quiet?: boolean
}

export const LatestValueTransform: FunctionComponent<Props> = ({
  table,
  quiet = false,
  children,
  allowString,
}) => {
  const latestValues = useMemo(() => getLatestValues(table), [table])

  if (latestValues.length === 0 && quiet) {
    return null
  }

  if (latestValues.length === 0) {
    return (
      <div>
        <h4>No latest value found</h4>
      </div>
    )
  }

  const latestValue = latestValues[0]

  if (isString(latestValue) && !allowString && quiet) {
    return null
  }

  if (isString(latestValue) && !allowString) {
    return (
      <div>
        <h4>String value cannot be displayed in this graph type</h4>
      </div>
    )
  }

  return children(latestValue)
}
