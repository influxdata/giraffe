// Libraries
import React, {Component} from 'react'

// Components
import {TableRoot, TableProps} from './Table'
import {TableBody} from './TableBody'
import {TableCell} from './TableCell'
import {TableHeader} from './TableHeader'
import {TableHeaderCell} from './TableHeaderCell'
import {TableRow} from './TableRow'

// Originally taken from Clockface and reduced
export class Table extends Component<TableProps> {
  public static readonly displayName = 'Table'

  public static Table = TableRoot
  public static Body = TableBody
  public static Cell = TableCell
  public static Header = TableHeader
  public static HeaderCell = TableHeaderCell
  public static Row = TableRow

  render() {
    return <TableRoot {...this.props} />
  }
}

export {TableProps, TableRef} from './Table'
export * from './TableBody'
export * from './TableCell'
export * from './TableHeader'
export * from './TableHeaderCell'
export * from './TableRow'
