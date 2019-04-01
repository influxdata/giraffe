import {HistogramTooltipProps, Scale, HistogramTable} from '../types'

export const getHistogramTooltipProps = (
  hoveredRowIndices: number[],
  table: HistogramTable,
  fillColKeys: string[],
  fillScale: Scale<number, string>
): HistogramTooltipProps => {
  const xMinCol = table.columns.xMin.data
  const xMaxCol = table.columns.xMax.data
  const yMinCol = table.columns.yMin.data
  const yMaxCol = table.columns.yMax.data

  const counts = hoveredRowIndices.map(i => {
    const grouping = fillColKeys.reduce(
      (acc, colName) => ({
        ...acc,
        [colName]: table.columns[colName].data[i],
      }),
      {}
    )

    return {
      count: yMaxCol[i] - yMinCol[i],
      color: fillScale(i),
      grouping,
    }
  })

  const tooltipProps: HistogramTooltipProps = {
    xMin: xMinCol[hoveredRowIndices[0]],
    xMax: xMaxCol[hoveredRowIndices[0]],
    counts,
  }

  return tooltipProps
}
