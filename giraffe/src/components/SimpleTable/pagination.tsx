import React, {FC, createContext, useState, useCallback} from 'react'
import {
  calcOffset,
  calcNextPageOffset,
  calcPrevPageOffset,
} from '../../utils/paginationUtils'
interface PaginationContextType {
  paginationOffset: number // this is the start index of the first row of the current page
  numberOfRowsOnCurrentPage: number // the size of the page
  maxNumberOfRowsOnAnyPage: number // the max number of rows on any page
  totalNumberOfRows: number // the total number of rows in the table
  totalPages: number // the total number of pages

  next: () => void
  previous: () => void

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
  total?: number
}

export const PaginationProvider: FC<PaginationProviderProps> = ({
  total,
  children,
}) => {
  const [offset, setOffset] = useState(DEFAULT_CONTEXT.paginationOffset)
  const [size, setSize] = useState(DEFAULT_CONTEXT.numberOfRowsOnCurrentPage)
  const [maxSize, setMaxSize] = useState(DEFAULT_CONTEXT.maxNumberOfRowsOnAnyPage)
  const [totalPages, setTotalPages] = useState(DEFAULT_CONTEXT.totalPages)

  const next = useCallback(() => {
    if (total) {
      setOffset(calcNextPageOffset(offset, size, total))
    } else {
      setOffset(offset + size)
    }
  }, [offset, size, setOffset, total])

  const previous = useCallback(() => {
    setOffset(calcPrevPageOffset(offset, size))
  }, [offset, size, setOffset])

  const setPage = useCallback(
    (page: number) => {
      setOffset(calcOffset(page, maxSize, total))
    },
    [maxSize, setOffset, total]
  )

  return (
    <PaginationContext.Provider
      value={{
        paginationOffset: offset,
        numberOfRowsOnCurrentPage: size,
        maxNumberOfRowsOnAnyPage: maxSize,
        totalNumberOfRows: total,
        totalPages,
        next,
        previous,
        setNumberOfRowsOnCurrentPage: setSize,
        setMaxNumberOfRowsOnAnyPage: setMaxSize,
        setCurrentPage: setPage,
        setTotalPages,
      }}
    >
      {children}
    </PaginationContext.Provider>
  )
}
