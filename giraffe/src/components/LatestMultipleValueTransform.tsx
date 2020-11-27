// Libraries
import React, {useMemo, FunctionComponent} from 'react'
import {Table} from '../types'

// Utils
import {getLatestValues} from '../utils/getLatestValues'

interface Props {
  table: Table
  children: (latestValue: {[field: string]: number}) => JSX.Element
  allowString: boolean
  // If `quiet` is set and a latest value can't be found, this component will
  // display nothing instead of an empty graph error message
  quiet?: boolean
}

// todo: can return string ?
export const LatestMultipleValueTransform: FunctionComponent<Props> = ({
  table,
  quiet = false,
  children,
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

  const entries = {}

  for (let i = latestValues.length / 2; i--; ) {
    const value = latestValues[i * 2]
    const field = latestValues[i * 2 + 1]
    entries[field] = value
  }

  return children(entries)
}
