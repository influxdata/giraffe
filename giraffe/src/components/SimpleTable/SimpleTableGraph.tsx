import React, {FC} from 'react'
import {FluxDataType} from '../../index'

import PageControl from './PageControl'
import PagedTable from './PagedTable'
import {FluxResult} from './flows'
import {PaginationProvider} from './pagination'

import styles from './SimpleTableGraph.scss'

interface SubsetTableColumn {
  name: string
  type: string
  fluxDataType: FluxDataType
  data: Array<any>
  group: boolean
}

export interface SubsetTable {
  idx: number
  yield: string
  start: number
  end: number
  signature: string
  cols: SubsetTableColumn[]
}

interface Props {
  result: FluxResult['parsed']
  showAll: boolean
}

export const SimpleTable: FC<Props> = ({result, showAll}) => {
  return (
    <div className={`${styles['visualization--simple-table']}`}>
      <PaginationProvider totalNumberOfRows={result?.table?.length || 0}>
        <PagedTable showAll={showAll} result={result} />
        <PageControl />
      </PaginationProvider>
    </div>
  )
}
