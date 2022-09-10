// Libraries
import React, {FC, useContext} from 'react'
import {PaginationContext} from './pagination'

// Components
import {PaginationNav} from './PaginationNav'

// Styles
import styles from './SimpleTableGraph.scss'

const PageControl: FC = () => {
  const {paginationOffset, numberOfRowsOnCurrentPage, totalNumberOfRows, totalPages, setCurrentPage} = useContext(
    PaginationContext
  )
  return (
    <div className={`${styles['visualization--simple-table--paging']}`}>
      {totalNumberOfRows && numberOfRowsOnCurrentPage > 0 && (
        <PaginationNav.PaginationNav
          totalPages={totalPages}
          currentPage={Math.min(Math.floor(paginationOffset / numberOfRowsOnCurrentPage) + 1, totalPages)}
          pageRangeOffset={1}
          onChange={setCurrentPage}
        />
      )}
    </div>
  )
}

export default PageControl
