import {StaticLegend} from '../../types'
import {
  STATIC_LEGEND_DEFAULT_HEIGHT_RATIO,
  STATIC_LEGEND_DEFAULT_WIDTH_RATIO,
  STATIC_LEGEND_MAXIMUM_HEIGHT_RATIO,
  STATIC_LEGEND_MAXIMUM_WIDTH_RATIO,
  STATIC_LEGEND_MINIMUM_HEIGHT_RATIO,
  STATIC_LEGEND_MINIMUM_WIDTH_RATIO,
} from '../../constants'

interface ResizedPlotDimensions {
  height: number
  width: number
}

export const resizePlotWithStaticLegend = (
  height: number,
  width: number,
  staticLegendProperties?: StaticLegend
): ResizedPlotDimensions => {
  const resizedPlotDimensions = {
    height,
    width,
  } as ResizedPlotDimensions

  if (staticLegendProperties) {
    const {
      heightRatio = STATIC_LEGEND_DEFAULT_HEIGHT_RATIO,
      widthRatio = STATIC_LEGEND_DEFAULT_WIDTH_RATIO,
    } = staticLegendProperties

    if (
      heightRatio > STATIC_LEGEND_MINIMUM_HEIGHT_RATIO &&
      heightRatio < STATIC_LEGEND_MAXIMUM_HEIGHT_RATIO
    ) {
      resizedPlotDimensions.height = height - heightRatio * height
    }

    if (
      widthRatio > STATIC_LEGEND_MINIMUM_WIDTH_RATIO &&
      widthRatio < STATIC_LEGEND_MAXIMUM_WIDTH_RATIO
    ) {
      resizedPlotDimensions.width = width - widthRatio * width
    }
  }

  return resizedPlotDimensions
}
