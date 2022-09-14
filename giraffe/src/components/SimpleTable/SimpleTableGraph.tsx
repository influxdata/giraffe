import React, {FC} from 'react'
import {FluxDataType} from '../../index'

import PageControl from './PageControl'
import PagedTable from './PagedTable'
import {FluxResult} from './flows'
import {PaginationProvider} from './pagination'

import styles from './SimpleTableGraph.scss'

export interface SimpleTableViewProperties {
  type: 'simple-table'
  showAll: boolean
}

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
  properties: SimpleTableViewProperties
  result: FluxResult['parsed']
}

export const SimpleTable: FC<Props> = ({properties, result}) => {
  return (
    <div className={`${styles['visualization--simple-table']}`}>
      <PaginationProvider totalNumberOfRows={result?.table?.length || 0}>
        <PagedTable properties={properties} result={result} />
        <PageControl />
      </PaginationProvider>
    </div>
  )
}
