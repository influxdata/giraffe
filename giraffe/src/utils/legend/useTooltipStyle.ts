import {useLayoutStyle} from '../useLayoutStyle'
import {useRefMousePos} from '../useMousePos'
import {
  ANNOTATION_DEFAULT_MAX_WIDTH,
  CLOCKFACE_Z_INDEX,
  LEAFLET_Z_INDEX,
} from '../../constants'
import {AnnotationTooltipOptions} from '../../types'

const MARGIN_X = 30

export const useTooltipStyle = (el: HTMLDivElement) => {
  const {x, y} = useRefMousePos(document.body)

  // Position the tooltip next to the mouse cursor, like this:
  //
  //                   ┌─────────────┐
  //                   │             │
  //          (mouse)  │   tooltip   │
  //                   │             │
  //                   └─────────────┘
  //
  // The positioning is subject to the following restrictions:
  //
  // - If the tooltip overflows the right side of the screen, position it on
  //   the left side of the cursor instead
  //
  // - If the tooltip overflows the top or bottom of the screen (with a bit of
  //   margin), shift it just enough so that it is fully back inside the screen
  //
  useLayoutStyle(
    el,
    ({offsetWidth: tooltipWidth, offsetHeight: tooltipHeight}) => {
      if (x === null || y === null) {
        return {
          display: 'none',
        }
      }

      let dx = MARGIN_X
      let dy = 0 - tooltipHeight / 2

      if (x + dx + tooltipWidth > window.innerWidth) {
        dx = 0 - MARGIN_X - tooltipWidth
      }

      if (y + dy + tooltipHeight > window.innerHeight) {
        dy -= y + dy + tooltipHeight - window.innerHeight
      }

      if (y + dy < 0) {
        dy += 0 - (y + dy)
      }

      const clampedX = Math.max(x + dx, 8)
      const clampedY = Math.max(y + dy, 8)

      /* Geo widget maps are rendered with z-index: 399, we have to set it above
       that so that tooltips are not rendered/are hidden below the map, */
      return {
        display: 'inline',
        position: 'fixed',
        left: `${clampedX}px`,
        top: `${clampedY}px`,
        zIndex: CLOCKFACE_Z_INDEX + LEAFLET_Z_INDEX + 1,
      }
    }
  )
}

export const useAnnotationStyle = (
  el: HTMLDivElement,
  options: AnnotationTooltipOptions
) => {
  const {dimension, position, xOffset, yOffset} = options || {}
  const {x, y} = position || {x: null, y: null}

  // Position the tooltip above the annotation for vertical annotations, like this:
  //
  //          ┌─────────────┐
  //          │             │
  //          │   tooltip   │
  //          │             │
  //          └─────────────┘
  //                 |
  //                 |
  //                 |
  //                 |
  //
  // Position the tooltip to the right of the annotation for horizontal annotations, like this:
  //
  //             ┌─────────────┐
  //             │             │
  //    ---------│   tooltip   │
  //             │             │
  //             └─────────────┘
  //
  // The positioning is subject to the following restrictions:
  //
  // - If the tooltip does not fit above a vertical annotation due to screen size,
  //   shift it to overlay the top part of the annotation
  //
  // - If the tooltip does not fit to the right of a horizontal annotation due to screen size,
  //   shift it to overlay the right part of the annotation
  //
  useLayoutStyle(
    el,
    ({offsetWidth: tooltipWidth, offsetHeight: tooltipHeight}) => {
      if (x === null || y === null) {
        return {
          display: 'none',
        }
      }
      // xOffset : start x-coordinate value of the plot layer
      // yOffset : start y-coordinate value of the plot layer
      // (xOffset, yOffset) is the origin of this plot
      // dx      : the distance to the middle of the tooltip from the parent plot container left edge
      let dx = xOffset - tooltipWidth / 2
      if (dx + tooltipWidth > window.innerWidth) {
        dx = 0 - tooltipWidth / 2 + window.innerWidth - (x + xOffset)
      }
      let dy = Math.max(yOffset - tooltipHeight, 0)

      if (dimension === 'y') {
        dx = xOffset
        if (dx + x + tooltipWidth > window.innerWidth) {
          dx = 0 - tooltipWidth + window.innerWidth - (dx + x)
        }
        dy = yOffset - tooltipHeight / 2
        if (dy + y + tooltipHeight > window.innerHeight) {
          dy = 0 - tooltipHeight + window.innerHeight - (dy + y)
        }
      }

      let clampedX = Math.round(x + dx)
      const clampedY = Math.round(dy + y)

      // When the annotation is in the far edge of the screen, the position.left value
      // overrides the width of the tooltip and makes its width smaller than its max-width.
      // Fix the left value so that the tooltip is at its max width.
      if (window.innerWidth - clampedX < ANNOTATION_DEFAULT_MAX_WIDTH) {
        clampedX = window.innerWidth - ANNOTATION_DEFAULT_MAX_WIDTH
      }

      /* Geo widget maps are rendered with z-index: 399, we have to set it above
       that so that tooltips are not rendered/are hidden below the map, */
      return {
        display: 'inline-block',
        position: 'fixed',
        top: `${clampedY}px`,
        left: `${clampedX}px`,
        zIndex: CLOCKFACE_Z_INDEX + LEAFLET_Z_INDEX + 1,
      }
    }
  )
}
