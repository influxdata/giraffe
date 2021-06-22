import React, {FC} from 'react'
import {FluxDataType} from '../index'

import PageControl from './SimpleTable/PageControl'
import PagedTable from './SimpleTable/PagedTable'
import {FluxResult} from './SimpleTable/flows'
import {PaginationProvider} from './SimpleTable/pagination'

import styles from './SimpleTable/SimpleTableGraph.scss'

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
      <PaginationProvider total={result?.table?.length || 0}>
        <PagedTable properties={properties} result={result} />
        <PageControl />
      </PaginationProvider>
    </div>
  )
}
