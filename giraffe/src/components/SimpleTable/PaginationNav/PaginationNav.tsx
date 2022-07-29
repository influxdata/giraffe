// Libraries
import React, {
  ChangeEvent,
  forwardRef,
  useState,
  useEffect,
  useLayoutEffect,
} from 'react'
import classnames from 'classnames'

// Components
import {PaginationDirectionItem} from './PaginationDirectionItem'
import {PaginationInput} from './PaginationInput'
import {PaginationItem} from './PaginationItem'
import {PaginationTruncationItem} from './PaginationTruncationItem'

// Styles
import styles from './Pagination.scss'
import {styleReducer} from '../../../utils/styleReducer'

// Types
import {ComponentSize, Direction, StandardFunctionProps} from '../../../types'

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
  hideDirectionIcon?: boolean
  size?: ComponentSize
  enableArrowPaginate?: boolean
  enablePageInput?: boolean
}

export type PaginationNavRef = HTMLElement

export const Pagination = forwardRef<PaginationNavRef, PaginationNavProps>(
  (
    {
      id,
      style,
      testID = 'pagination-nav',
      className,
      totalPages,
      currentPage = 1,
      onChange,
      pageRangeOffset = 1,
      hideDirectionIcon = false,
      size = ComponentSize.Medium,
      enableArrowPaginate = false,
      enablePageInput = false,
    },
    ref
  ) => {
    const innerRef = React.useRef<HTMLUListElement>(null)
    const paginationNavClassName = classnames('cf-pagination', {
      [`${className}`]: className,
    })
      .split(' ')
      .reduce((accum, current) => styleReducer(styles, accum, current), '')

    const [activePage, setActivePage] = useState(currentPage)
    const [inputPage, setInputPage] = useState(currentPage)

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

    const resizeBasedOnParentSize = (
      size: ComponentSize,
      pageRangeOffset: number
    ) => {
      if (!innerRef.current) {
        return pageRangeOffset
      }
      const {width} = innerRef.current.getBoundingClientRect() as DOMRect

      let itemSize = 0
      if (size == ComponentSize.Medium) {
        itemSize = 38
      } else if (size == ComponentSize.ExtraSmall) {
        itemSize = 22
      } else if (size == ComponentSize.Small) {
        itemSize = 30
      } else if (size == ComponentSize.Large) {
        itemSize = 46
      }

      const maxItemCount = Math.floor(width / itemSize)
      const directionButtonCount = hideDirectionIcon ? 0 : 2
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
        setInputPage(page)
        onChange(page)
      }
    }

    const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
      let parsedValue = parseInt(event.target.value, 10)

      if (parsedValue > totalPages) {
        parsedValue = totalPages
      } else if (parsedValue === 0) {
        parsedValue++
      }
      setInputPage(parsedValue)
    }

    const onInputButtonClick = () => {
      setActivePage(inputPage)
    }

    const paginateArrow = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        moveToPage(activePage - 1)
      }

      if (event.key === 'ArrowRight') {
        moveToPage(activePage + 1)
      }
    }

    useEffect(() => {
      if (enableArrowPaginate) {
        document.addEventListener('keydown', paginateArrow)
      }

      return () => {
        if (enableArrowPaginate) {
          document.removeEventListener('keydown', paginateArrow)
        }
      }
    }, [activePage])

    useLayoutEffect(() => {
      setBreakpoints(
        computePageSpread(
          activePage,
          resizeBasedOnParentSize(size, pageRangeOffset)
        )
      )
    }, [totalPages, pageRangeOffset, size, hideDirectionIcon])

    useEffect(() => {
      setActivePage(currentPage)
    }, [currentPage])

    useEffect(() => {
      setActivePage(activePage)
      if (activePage > breakpoints.secondBreakpoint) {
        setBreakpoints(
          computePageSpread(
            activePage,
            resizeBasedOnParentSize(size, pageRangeOffset)
          )
        )
      } else if (activePage < breakpoints.firstBreakpoint) {
        setBreakpoints(
          computePageSpread(
            activePage,
            resizeBasedOnParentSize(size, pageRangeOffset)
          )
        )
      }
    }, [activePage])

    const checkActive = (page: number) => {
      return activePage === page ? true : false
    }

    return (
      <nav
        className={paginationNavClassName}
        data-testid={testID}
        id={id}
        style={style}
        ref={ref}
      >
        <ul className={`${styles['cf-pagination--container']}`} ref={innerRef}>
          {!hideDirectionIcon && (
            <PaginationDirectionItem
              direction={Direction.Left}
              onClick={() => moveToPage(activePage - 1)}
              key={'pagination--item-left'}
              size={size}
              isActive={activePage > 1}
            />
          )}
          {
            <PaginationItem
              page={'1'}
              isActive={checkActive(1)}
              onClick={() => moveToPage(1)}
              key={'pagination--item-1'}
              size={size}
            />
          }
          {breakpoints.firstBreakpoint > 2 && (
            // compute whether it should be an ellipse or a number
            <PaginationTruncationItem size={size}></PaginationTruncationItem>
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
                size={size}
              />
            ))}
          {// compute whether it should be an ellipse or a number
          breakpoints.secondBreakpoint !== totalPages - 1 && (
            <PaginationTruncationItem size={size}></PaginationTruncationItem>
          )}
          {//compute last number
          totalPages !== 1 && (
            <PaginationItem
              page={totalPages.toString()}
              isActive={checkActive(totalPages)}
              onClick={() => moveToPage(totalPages)}
              size={size}
            />
          )}
          {!hideDirectionIcon && (
            <PaginationDirectionItem
              direction={Direction.Right}
              onClick={() => moveToPage(activePage + 1)}
              key={'pagination--item-right'}
              size={size}
              isActive={activePage < totalPages}
            />
          )}
        </ul>
        {enablePageInput && (
          <PaginationInput
            currentPage={inputPage}
            onChange={onInputChange}
            onClick={onInputButtonClick}
            size={size}
          />
        )}
      </nav>
    )
  }
)

Pagination.displayName = 'PaginationNav'
