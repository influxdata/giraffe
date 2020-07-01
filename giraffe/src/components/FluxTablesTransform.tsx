// Libraries
import {useMemo, FunctionComponent} from 'react'

// Utils
import {parseResponse} from '../utils/fluxParsing'
import {flatMap} from '../utils/flatMap'

// Types
import {FluxTable} from '../types'

interface Props {
  files: string[]
  children: (tables: FluxTable[]) => JSX.Element
}

const FluxTablesTransform: FunctionComponent<Props> = ({files, children}) => {
  console.log(
    'FluxTablesTransform: is an array',
    Array.isArray(files),
    'with length',
    files.length,
    'is',
    files
  )
  const tables = useMemo(() => flatMap(files, parseResponse), [files])
  console.log('~~~ became tables', tables)
  return children(tables)
}

export default FluxTablesTransform
