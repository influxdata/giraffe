import React, {FC, Ref} from 'react'
import {Table} from './Table'
import {SubsetTable} from '../SimpleTableGraph'
import {ComponentSize, VerticalAlignment} from '../../types'
import styles from './SimpleTableGraph.scss'

interface InnerProps {
  table: SubsetTable
  pagedTableRefs: {
    pagedTableHeaderRef: Ref<HTMLTableSectionElement>
    pagedTableBodyRef: Ref<HTMLTableSectionElement>
  }
}

const InnerTable: FC<InnerProps> = ({
  pagedTableRefs: {pagedTableHeaderRef, pagedTableBodyRef},
  table,
}) => {
  const headers = Object.values(table.cols).map(c => {
    if (c.name === 'table') {
      return (
        <Table.HeaderCell
          key="htable"
          className={`${styles['cf-table--header-cell']}`}
          verticalAlignment={VerticalAlignment.Top}
          style={{textTransform: 'none'}}
        >
          table
          <label>{table.yield}</label>
        </Table.HeaderCell>
      )
    }
    return (
      <Table.HeaderCell
        className={`${styles['cf-table--header-cell']}`}
        key={`h${c.name}`}
        style={{textTransform: 'none'}}
      >
        {c.name}
        <label>{c.group ? 'group' : 'no group'}</label>
        <label>{c.fluxDataType}</label>
      </Table.HeaderCell>
    )
  })
  const rows = Array(table.end - table.start)
    .fill(null)
    .map((_, idx) => {
      const cells = Object.values(table.cols).map(c => {
        let val = c.data[idx]

        if (val && c.type === 'time') {
          val = new Date(val).toISOString()
        }
        if (val && c.type === 'boolean') {
          val = val ? 'true' : 'false'
        }

        return (
          <Table.Cell
            key={`h${c.name}:r${idx}`}
            testID={`table-cell ${c.data[idx]}`}
          >
            {val?.toString()}
          </Table.Cell>
        )
      })

      return <Table.Row key={`r${idx}`}>{cells}</Table.Row>
    })

  return (
    <Table
      className={`${styles['cf-table']}`}
      fontSize={ComponentSize.Small}
      striped
      highlight
      testID="simple-table"
    >
      <Table.Header ref={pagedTableHeaderRef}>
        <Table.Row>{headers}</Table.Row>
      </Table.Header>
      <Table.Body ref={pagedTableBodyRef}>{rows}</Table.Body>
    </Table>
  )
}

export default InnerTable
