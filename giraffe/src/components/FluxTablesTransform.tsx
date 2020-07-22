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

export const FluxTablesTransform: FunctionComponent<Props> = ({
  files,
  children,
}) => {
  const tables = useMemo(() => flatMap(files, parseResponse), [files])
  return children(tables)
}
