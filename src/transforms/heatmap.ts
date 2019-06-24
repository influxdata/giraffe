import {range, extent} from 'd3-array'

import {getContinuousColorScale} from './'
import {newTable} from '../utils/newTable'
import {X_MIN, X_MAX, Y_MIN, Y_MAX, COUNT} from '../constants/columnKeys'
import {resolveDomain} from '../utils/resolveDomain'
import {Table, RectLayerSpec} from '../types'

export const heatmapTransform = (
  inputTable: Table,
  xColumnKey: string,
  yColumnKey: string,
  xDomain: number[] | null,
  yDomain: number[] | null,
  width: number,
  height: number,
  binSize: number,
  colors: string[]
): RectLayerSpec => {
  const resolvedXDomain = resolveDomain(
    inputTable.getColumn(xColumnKey, 'number'),
    xDomain
  )

  const resolvedYDomain = resolveDomain(
    inputTable.getColumn(yColumnKey, 'number'),
    yDomain
  )

  const table = bin2d(
    inputTable,
    xColumnKey,
    yColumnKey,
    resolvedXDomain,
    resolvedYDomain,
    width,
    height,
    binSize
  )

  const countDomain = extent(table.getColumn(COUNT, 'number'))
  const fillScale = getContinuousColorScale(countDomain, colors)

  return {
    type: 'rect',
    inputTable,
    table,
    binDimension: 'xy',
    xDomain: resolvedXDomain,
    yDomain: resolvedYDomain,
    xColumnKey,
    yColumnKey,
    xColumnType: inputTable.getColumnType(xColumnKey),
    yColumnType: 'number',
    scales: {fill: fillScale},
    columnGroupMaps: {},
  }
}

export const bin2d = (
  table: Table,
  xColKey: string,
  yColKey: string,
  xDomain: number[],
  yDomain: number[],
  width: number,
  height: number,
  binSize: number
): Table => {
  const xColData = table.getColumn(xColKey, 'number')
  const yColData = table.getColumn(yColKey, 'number')
  const xColType = table.getColumnType(xColKey) as 'time' | 'number'
  const yColType = table.getColumnType(yColKey) as 'time' | 'number'

  const xBinCount = Math.floor(width / binSize)
  const yBinCount = Math.floor(height / binSize)

  // Count occurences in each bin in a `xBinCount` by `yBinCount` matrix
  //
  //                 4th y bin
  //
  //                     │
  //                     │
  //                     v
  //       [
  //           [0, 1, 2, 0, 0],
  //           [0, 1, 0, 2, 0],  <──── 2nd x bin
  //           [1, 0, 5, 7, 3]
  //       ]
  //
  const bins = range(xBinCount).map(__ => new Array(yBinCount).fill(0))

  for (let i = 0; i < table.length; i++) {
    const x = xColData[i]
    const y = yColData[i]

    const shouldSkipPoint =
      !x ||
      !y ||
      x < xDomain[0] ||
      x > xDomain[1] ||
      y < yDomain[0] ||
      y > yDomain[1]

    if (shouldSkipPoint) {
      continue
    }

    const xBinIndex = getBinIndex(x, xDomain, xBinCount)
    const yBinIndex = getBinIndex(y, yDomain, yBinCount)

    bins[xBinIndex][yBinIndex] += 1
  }

  // Now build a `Table` from that matrix

  const xBinWidth = (xDomain[1] - xDomain[0]) / xBinCount
  const yBinWidth = (yDomain[1] - yDomain[0]) / yBinCount

  const xMinData: number[] = []
  const xMaxData: number[] = []
  const yMinData: number[] = []
  const yMaxData: number[] = []
  const countData: number[] = []

  for (let i = 0; i < xBinCount; i++) {
    for (let j = 0; j < yBinCount; j++) {
      xMinData.push(xDomain[0] + i * xBinWidth)
      xMaxData.push(xDomain[0] + (i + 1) * xBinWidth)
      yMinData.push(yDomain[0] + j * yBinWidth)
      yMaxData.push(yDomain[0] + (j + 1) * yBinWidth)
      countData.push(bins[i][j])
    }
  }

  const heatmapTable = newTable(xMinData.length)
    .addColumn(X_MIN, xColType, xMinData)
    .addColumn(X_MAX, xColType, xMaxData)
    .addColumn(Y_MIN, yColType, yMinData)
    .addColumn(Y_MAX, yColType, yMaxData)
    .addColumn(COUNT, 'number', countData)

  return heatmapTable
}

const getBinIndex = (val: number, domain: number[], binCount: number) => {
  const domainWidth = domain[1] - domain[0]
  const percentage = (val - domain[0]) / domainWidth

  let binIndex = Math.floor(percentage * binCount)

  if (binIndex === binCount) {
    // Special case: last bin is inclusive
    binIndex = binCount - 1
  }

  return binIndex
}
