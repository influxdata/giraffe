// Libraries
import React, {Component} from 'react'

// Components
import {Pagination, PaginationNavProps} from './PaginationNav'

export class PaginationNav extends Component<PaginationNavProps> {
  public static readonly displayName = 'PaginationNav'

  public static PaginationNav = Pagination
  render() {
    return <PaginationNav {...this.props} />
  }
}

export {Pagination, PaginationNavRef} from './PaginationNav'
