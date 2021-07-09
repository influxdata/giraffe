import React, {FC} from 'react'
import {Table} from './Table'
import {SubsetTable} from '../SimpleTableGraph'
import styles from './SimpleTableGraph.scss'

interface InnerProps {
  table: SubsetTable
}

const InnerTable: FC<InnerProps> = ({table}) => {
  const {} = table

  const headers = Object.values(table.cols).map(c => {
    if (c.name === 'table') {
      return (
        <Table.HeaderCell
          key="htable"
          className={`${styles['cf-table--header-cell']}`}
        >
          table
          <label>{table.yield}</label>
        </Table.HeaderCell>
      )
    }
    return (
      <Table.HeaderCell
        key={`h${c.name}`}
        className={`${styles['cf-table--header-cell']}`}
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

        if (c.type === 'time') {
          val = new Date(val).toISOString()
        }
        if (c.type === 'boolean') {
          val = val ? 'true' : 'false'
        }

        return (
          <Table.Cell
            className={`${styles['cf-table--cell']}`}
            key={`h${c.name}:r${idx}`}
            testID={`table-cell ${c.data[idx]}`}
          >
            {val}
          </Table.Cell>
        )
      })

      return <Table.Row key={`r${idx}`}>{cells}</Table.Row>
    })

  return (
    <Table
      className={`${styles['cf-table']}`}
      striped
      highlight
      testID="simple-table"
    >
      <Table.Header>
        <Table.Row>{headers}</Table.Row>
      </Table.Header>
      <Table.Body>{rows}</Table.Body>
    </Table>
  )
}

export default InnerTable
