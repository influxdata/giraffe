// Libraries
import React, {forwardRef, useState, useEffect, useLayoutEffect} from 'react'

// Components
import {PaginationItem} from './PaginationItem'
import {PaginationTruncationItem} from './paginationTruncationItem'
import {PaginationDirectionItem} from './PaginationDirectionItem'

// Styles
import styles from './Pagination.scss'

// Types
import {Direction} from '../../../types/input'
import {StandardFunctionProps} from '../../../types'

export interface PaginationNavProps extends StandardFunctionProps {
  /** Total nuber of pages there exists */
  totalPages: number
  /** currently active page */
  currentPage: number
  /** Function to be called on page change */
  onChange: (page: number) => void
  /** Determines how many pages are displayed within the nav.
   * For Example, pageRangeOffset =1 will result in 7 items -> {1,...,(4),5,(6),...20},
   * pageRangeOffset = 2 will result in 9 items ->  {1,...,(4,5),6,(7,8)...20},
   * pageRangeOffset = 3 will result in 11 items -> {1,...,(4,5,6),7,(8,9,10)...20} and so on
   * The compute functions will need to be refactored to provide more flexible range*/
  pageRangeOffset: number
}

export type PaginationNavRef = HTMLElement

export const Pagination = forwardRef<PaginationNavRef, PaginationNavProps>(
  (
    {
      testID = 'pagination-nav',
      totalPages,
      currentPage = 1,
      pageRangeOffset = 1,
      onChange,
    },
    ref
  ) => {
    const innerRef = React.useRef<HTMLUListElement>(null)

    const [activePage, setActivePage] = useState(currentPage)

    const computePageSpread = (page: number, pageOffset: number) => {
      const itemsToShow = 5 + 2 * (pageOffset >= 1 ? pageOffset : 1)
      if (totalPages > itemsToShow) {
        const firstItem = Math.max(2, page - pageOffset)
        const lastItem = Math.min(totalPages - 1, page + pageOffset)

        const isLeftTruncated = firstItem > 2
        const isRightTruncated = totalPages - lastItem > 1

        const overflowOffset = itemsToShow - 4 - (lastItem - firstItem)

        if (isLeftTruncated && !isRightTruncated) {
          //if left is truncated but right isn't, take off the overflow from left
          return {
            firstBreakpoint: firstItem - overflowOffset,
            secondBreakpoint: lastItem,
          }
        }

        if (!isLeftTruncated && isRightTruncated) {
          //if right is truncated but left isn't, add the overflow to right
          return {
            firstBreakpoint: firstItem,
            secondBreakpoint: lastItem + overflowOffset,
          }
        }
        return {
          firstBreakpoint: firstItem,
          secondBreakpoint: lastItem,
        }
      } else {
        return {
          // if we don't need truncation
          firstBreakpoint: 2,
          secondBreakpoint: totalPages - 1,
        }
      }
    }

    const resizeBasedOnParentSize = (pageRangeOffset: number) => {
      if (!innerRef.current) {
        return pageRangeOffset
      }
      const {width} = innerRef.current.getBoundingClientRect() as DOMRect
      const itemSize = 38
      const maxItemCount = Math.floor(width / itemSize)
      const directionButtonCount = 2
      const maxRangeOffset = Math.floor(
        (maxItemCount - 5 - directionButtonCount) / 2
      )
      if (pageRangeOffset > maxRangeOffset) {
        return maxRangeOffset
      } else {
        return pageRangeOffset
      }
    }

    const [breakpoints, setBreakpoints] = useState(
      computePageSpread(activePage, pageRangeOffset)
    )

    const moveToPage = (page: number) => {
      //not out of bound
      const notOutOfBound = page >= 1 && page <= totalPages

      if (page !== activePage && notOutOfBound) {
        setActivePage(page)
        onChange(page)
      }
    }

    useLayoutEffect(() => {
      setBreakpoints(
        computePageSpread(activePage, resizeBasedOnParentSize(pageRangeOffset))
      )
    }, [totalPages, pageRangeOffset])

    useEffect(() => {
      setActivePage(currentPage)
    }, [currentPage])

    useEffect(() => {
      setActivePage(activePage)
      if (activePage > breakpoints.secondBreakpoint) {
        setBreakpoints(
          computePageSpread(
            activePage,
            resizeBasedOnParentSize(pageRangeOffset)
          )
        )
      } else if (activePage < breakpoints.firstBreakpoint) {
        setBreakpoints(
          computePageSpread(
            activePage,
            resizeBasedOnParentSize(pageRangeOffset)
          )
        )
      }
    }, [activePage])

    const checkActive = (page: number) => {
      return activePage === page ? true : false
    }

    return (
      <nav
        className={`${styles['cf-pagination']}`}
        data-testid={testID}
        ref={ref}
      >
        <ul className={`${styles['cf-pagination--container']}`} ref={innerRef}>
          <PaginationDirectionItem
            direction={Direction.Left}
            onClick={() => moveToPage(activePage - 1)}
            key={'pagination--item-left'}
            isActive={activePage > 1}
          />
          <PaginationItem
            page={'1'}
            isActive={checkActive(1)}
            onClick={() => moveToPage(1)}
            key={'pagination--item-1'}
          />
          {breakpoints.firstBreakpoint > 2 && (
            // compute whether it should be an ellipse or a number
            <PaginationTruncationItem />
          )}
          {[...Array(totalPages)]
            .map((_, i) => i)
            .slice(
              breakpoints.firstBreakpoint,
              breakpoints.secondBreakpoint + 1
            )
            .map(item => (
              <PaginationItem
                page={item.toString()}
                isActive={checkActive(item)}
                onClick={() => moveToPage(item)}
                key={'pagination--item-' + item}
              />
            ))}
          {// compute whether it should be an ellipse or a number
          breakpoints.secondBreakpoint !== totalPages - 1 && (
            <PaginationTruncationItem />
          )}
          {//compute last number
          totalPages !== 1 && (
            <PaginationItem
              page={totalPages.toString()}
              isActive={checkActive(totalPages)}
              onClick={() => moveToPage(totalPages)}
            />
          )}
          <PaginationDirectionItem
            key={'pagination--item-right'}
            direction={Direction.Right}
            onClick={() => moveToPage(activePage + 1)}
            isActive={activePage < totalPages}
          />
        </ul>
      </nav>
    )
  }
)

Pagination.displayName = 'PaginationNav'
