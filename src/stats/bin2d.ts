import {extent, range} from 'd3-array'
import {interpolateRgbBasis} from 'd3-interpolate'
import {scaleSequential} from 'd3-scale'

import {
  Table,
  HeatmapLayerConfig,
  HeatmapTable,
  HeatmapScales,
  HeatmapMappings,
  SizedConfig,
  Scale,
} from '../types'

import {getNumericColumn} from '../utils/getNumericColumn'

const BIN_SIZE = 10

export const bin2dStat = (
  config: SizedConfig,
  layer: HeatmapLayerConfig
): {
  table: HeatmapTable
  mappings: HeatmapMappings
  scales: HeatmapScales
} => {
  const table = bin2d(
    config.table,
    layer.x,
    layer.y,
    config.xDomain,
    config.yDomain,
    config.width,
    config.height,
    BIN_SIZE
  )

  const mappings: HeatmapMappings = {
    xMin: 'xMin',
    xMax: 'xMax',
    yMin: 'yMin',
    yMax: 'yMax',
    fill: 'count',
  }

  const domain = extent(table.columns.count.data)
  const colorScheme = interpolateRgbBasis(layer.colors)
  const fillScale = scaleSequential(colorScheme).domain(domain)
  const scales = {fill: fillScale as Scale<number, string>}

  return {table, mappings, scales}
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
): HeatmapTable => {
  const {data: xColData, type: xColType} = getNumericColumn(table, xColKey)
  const {data: yColData, type: yColType} = getNumericColumn(table, yColKey)

  if (!xDomain) {
    xDomain = extent(xColData)
  }

  if (!yDomain) {
    yDomain = extent(yColData)
  }

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
  const statTable = {
    columns: {
      xMin: {
        data: [],
        type: xColType,
      },
      xMax: {
        data: [],
        type: xColType,
      },
      yMin: {
        data: [],
        type: yColType,
      },
      yMax: {
        data: [],
        type: yColType,
      },
      count: {
        data: [],
        type: 'int',
      },
    },
    length: 0,
  }
  const xBinWidth = (xDomain[1] - xDomain[0]) / xBinCount
  const yBinWidth = (yDomain[1] - yDomain[0]) / yBinCount

  for (let i = 0; i < xBinCount; i++) {
    for (let j = 0; j < yBinCount; j++) {
      statTable.columns.xMin.data.push(xDomain[0] + i * xBinWidth)
      statTable.columns.xMax.data.push(xDomain[0] + (i + 1) * xBinWidth)
      statTable.columns.yMin.data.push(yDomain[0] + j * yBinWidth)
      statTable.columns.yMax.data.push(yDomain[0] + (j + 1) * yBinWidth)
      statTable.columns.count.data.push(bins[i][j])
      statTable.length += 1
    }
  }

  return statTable as HeatmapTable
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
