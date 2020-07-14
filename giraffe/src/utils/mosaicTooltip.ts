import {range} from 'd3-array'

import {getRangeLabel} from './tooltip'
import {X_MIN, X_MAX, FILL, SERIES} from '../constants/columnKeys'
import {
  Table,
  Scale,
  TooltipData,
  TooltipColumn,
  ColumnGroupMap,
} from '../types'

export const findHoveredBoxes = (
  boxTable: Table,
  hoverX: number | null,
  hoverY: number | null,
  xScale: Scale<number, number>,
  yScale: Scale<number, number>,
  yDomain: number[]
): number[] => {
  if (!hoverX || !hoverY) {
    return []
  }
  const xMinData = boxTable.getColumn(X_MIN, 'number')
  const xMaxData = boxTable.getColumn(X_MAX, 'number')
  //const valData = boxTable.getColumn(FILL, 'string')
  const dataX = xScale.invert(hoverX)
  const dataY = yScale.invert(hoverY)
  // Find all bins whose x extent contain the mouse x position
  const xIndices = range(0, xMinData.length).filter(
    i => xMinData[i] <= dataX && xMaxData[i] > dataX
  )

  const yValMap = new Map()
  //if cpu isn't in map yet, add it & increment number
  for (let i = 0; i < yDomain[1]; i++) {
    const yMin = yScale(i + 1)
    const yMax = yScale(i)
    yValMap.set(i, [yMin, yMax])
  }

  let finalXIndex
  for (const index of yValMap.keys()) {
    if (
      yValMap.get(index)[0] < yScale(dataY) &&
      yValMap.get(index)[1] >= yScale(dataY)
    ) {
      finalXIndex = index
      break
    }
  }
  let xyIndices

  if (xIndices) {
    xyIndices = [xIndices[finalXIndex]]
  } else {
    xyIndices = []
  }

  return xyIndices
}

export const getMosaicTooltipData = (
  hoveredBoxRows: number[],
  boxTable: Table,
  inputTable: Table,
  xColKey: string,
  fillGroupMap: ColumnGroupMap,
  fillScale: Scale<number, string>,
  columnFormatter: (colKey: string) => (x: any) => string
): TooltipData => {
  const xMinCol = boxTable.getColumn(X_MIN, 'number')
  const xMaxCol = boxTable.getColumn(X_MAX, 'number')
  const valCol = boxTable.getColumn(FILL, 'string')
  const cpuCol = boxTable.getColumn(SERIES, 'string')
  const xFormatter = columnFormatter(xColKey)
  const cpuFormatter = columnFormatter(SERIES)
  const colors = hoveredBoxRows.map(i =>
    fillScale((valCol[i] as unknown) as number)
  )

  const xTooltipColumn: TooltipColumn = {
    key: xColKey,
    name: inputTable.getColumnName(xColKey),
    type: inputTable.getColumnType(xColKey),
    colors,
    values: hoveredBoxRows.map(i =>
      getRangeLabel(xMinCol[i], xMaxCol[i], xFormatter)
    ),
  }

  const cpuTooltipColumn: TooltipColumn = {
    key: SERIES,
    name: 'cpu',
    type: 'string',
    colors,
    values: hoveredBoxRows.map(i => cpuFormatter(cpuCol[i])),
  }

  console.log('columnKeys', fillGroupMap.columnKeys)

  // const groupTooltipColumns = fillGroupMap.columnKeys.map(key => ({
  //   key,
  //   name: inputTable.getColumnName(key),
  //   type: inputTable.getColumnType(key),
  //   colors,
  //   values: hoveredBoxRows.map(i =>
  //     columnFormatter(key)(fillGroupMap.mappings[valCol[i]][key])
  //   ),
  // }))

  const tooltipColumns = [
    xTooltipColumn,
    cpuTooltipColumn,
    //...groupTooltipColumns,
  ]

  return tooltipColumns
}
