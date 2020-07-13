import {range} from 'd3-array'

import {getRangeLabel} from './tooltip'
import {
  X_MIN,
  X_MAX,
  //Y_MIN,
  //Y_MAX,
  FILL,
  //COUNT,
  SERIES,
} from '../constants/columnKeys'
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
  console.log('YDOMAIN', yDomain)
  // console.log('yScale', yScale)
  console.log('entered findHoveredRects')
  if (!hoverX || !hoverY) {
    console.log('no hovers')
    return []
  }
  const xMinData = boxTable.getColumn(X_MIN, 'number')
  const xMaxData = boxTable.getColumn(X_MAX, 'number')
  //const valData = boxTable.getColumn(FILL, 'string')
  //const seriesData = boxTable.getColumn(SERIES, 'string')
  const dataX = xScale.invert(hoverX)
  const dataY = yScale.invert(hoverY)
  // Find all bins whose x extent contain the mouse x position
  const xIndices = range(0, xMinData.length).filter(
    i => xMinData[i] <= dataX && xMaxData[i] > dataX
  )

  /////////////////////////////////////////////////////
  const yValMap = new Map()
  //if cpu isn't in map yet, add it & increment number
  for (const cpu of yDomain) {
    //if (!yValMap.has(cpu)) {
    const index = yDomain.indexOf(cpu)
    const yMin = yScale(index)
    const yMax = yScale(index + 1)
    yValMap.set(cpu, [yMin, yMax])
    //}
  }
  console.log('yValMap', yValMap)
  // const yVal = yValMap.get(seriesData[i])
  //console.log('y', y)

  /////////////////////////////////////////////////////

  const xyIndices = xIndices.filter(
    i => yValMap[yDomain[i]][0] <= dataY && yValMap[yDomain[i]][1] >= dataY
    // for (const val of yDomain){
    //   if ((yValMap[val][0] <= dataY) && (yValMap[val][1] >= dataY)) {
    //     return
    //   }
    // }
  )
  console.log('XYINDICES', xyIndices)
  return xyIndices

  //   if (!xIndices.some(i => yMaxData[i] >= dataY)) {
  //     return []
  //   } else if (binDimension === 'x') {
  //     return xIndices
  //   }

  //   const xyIndices = xIndices.filter(
  //     i => yMinData[i] <= dataY && yMaxData[i] > dataY
  //   )
  //   console.log('xyIndices', xyIndices)
  //   return xyIndices
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

  // const colorMap = new Map()
  // //if value isn't in map yet, add it & increment number
  // let i = 0
  // for (const val of valCol) {
  //   if (!colorMap.has(val)) {
  //     colorMap.set(val, i)
  //     i++
  //   }
  // }
  // const colorVal = new Map()
  // for (let i = 0; i < valCol.length; i++) {
  //   colorVal.set(colorMap.get(valCol[i]), i)
  // }
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
