import React, {FC, createContext, useState, useCallback} from 'react'
import {
  calcOffset,
  calcNextPageOffset,
  calcPrevPageOffset,
} from '../../utils/paginationUtils'
interface PaginationContextType {
  paginationOffset: number // this is the start index of the first row of the current page

  // if the table has 100 rows and the available space is 10 rows, then the number of rows on current page is 10
  // on the other hand, if the table has 2 rows and the available space is 10 rows, then the number of rows on current page is 2
  numberOfRowsOnCurrentPage: number

  maxNumberOfRowsOnAnyPage: number
  totalNumberOfRows: number // the total number of rows/entries in the table
  totalPages: number // the total number of pages

  next: () => void
  previous: () => void

  // setters
  setNumberOfRowsOnCurrentPage: (size: number) => void
  setMaxNumberOfRowsOnAnyPage: (page: number) => void
  setCurrentPage: (page: number) => void
  setTotalPages: (totalPages: number) => void
}

const DEFAULT_CONTEXT: PaginationContextType = {
  paginationOffset: 0,
  numberOfRowsOnCurrentPage: 0,
  maxNumberOfRowsOnAnyPage: 0,
  totalNumberOfRows: 0,
  totalPages: 0,

  next: () => {},
  previous: () => {},

  setNumberOfRowsOnCurrentPage: (_size: number) => {},
  setMaxNumberOfRowsOnAnyPage: (_maxSize: number) => {},
  setCurrentPage: (_page: number) => {},
  setTotalPages: (_totalPages: number) => {},
}

export const PaginationContext = createContext<PaginationContextType>(
  DEFAULT_CONTEXT
)

interface PaginationProviderProps {
  totalNumberOfRows?: number
}

export const PaginationProvider: FC<PaginationProviderProps> = ({
  totalNumberOfRows,
  children,
}) => {
  const [paginationOffset, setPaginationOffset] = useState(
    DEFAULT_CONTEXT.paginationOffset
  )
  const [numberOfRowsOnCurrentPage, setNumberOfRowsOnCurrentPage] = useState(
    DEFAULT_CONTEXT.numberOfRowsOnCurrentPage
  )
  const [maxNumberOfRowsOnAnyPage, setMaxNumberOfRowsOnAnyPage] = useState(
    DEFAULT_CONTEXT.maxNumberOfRowsOnAnyPage
  )
  const [totalPages, setTotalPages] = useState(DEFAULT_CONTEXT.totalPages)

  const next = useCallback(() => {
    if (totalNumberOfRows) {
      setPaginationOffset(
        calcNextPageOffset(
          paginationOffset,
          numberOfRowsOnCurrentPage,
          totalNumberOfRows
        )
      )
    } else {
      setPaginationOffset(paginationOffset + numberOfRowsOnCurrentPage)
    }
  }, [
    paginationOffset,
    numberOfRowsOnCurrentPage,
    setPaginationOffset,
    totalNumberOfRows,
  ])

  const previous = useCallback(() => {
    setPaginationOffset(
      calcPrevPageOffset(paginationOffset, numberOfRowsOnCurrentPage)
    )
  }, [paginationOffset, numberOfRowsOnCurrentPage, setPaginationOffset])

  const setPage = useCallback(
    (page: number) => {
      setPaginationOffset(
        calcOffset(page, maxNumberOfRowsOnAnyPage, totalNumberOfRows)
      )
    },
    [maxNumberOfRowsOnAnyPage, setPaginationOffset, totalNumberOfRows]
  )

  return (
    <PaginationContext.Provider
      value={{
        paginationOffset,
        numberOfRowsOnCurrentPage,
        maxNumberOfRowsOnAnyPage,
        totalNumberOfRows,
        totalPages,
        next,
        previous,
        setNumberOfRowsOnCurrentPage: setNumberOfRowsOnCurrentPage,
        setMaxNumberOfRowsOnAnyPage: setMaxNumberOfRowsOnAnyPage,
        setCurrentPage: setPage,
        setTotalPages,
      }}
    >
      {children}
    </PaginationContext.Provider>
  )
}
