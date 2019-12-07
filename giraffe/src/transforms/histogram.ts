import {range, thresholdSturges} from 'd3-array'

import {FILL, X_MIN, X_MAX, Y_MIN, Y_MAX, COUNT} from '../constants/columnKeys'
import {createGroupIDColumn, getNominalColorScale} from './'
import {newTable} from '../utils/newTable'
import {extentOfExtents} from '../utils/extrema'
import {resolveDomain} from '../utils/resolveDomain'
import {Table, RectLayerSpec, HistogramPosition} from '../types'

export const histogramTransform = (
  inputTable: Table,
  xColumnKey: string,
  xDomain: number[],
  colors: string[],
  fillColKeys: string[],
  binCount: number,
  position: HistogramPosition
): RectLayerSpec => {
  const [fillColumn, fillColumnMap] = createGroupIDColumn(
    inputTable,
    fillColKeys
  )

  const resolvedXDomain = resolveDomain(
    inputTable.getColumn(xColumnKey, 'number'),
    xDomain
  )

  const table = bin(
    inputTable.addColumn(FILL, 'number', fillColumn),
    xColumnKey,
    resolvedXDomain,
    binCount,
    position
  )

  const fillScale = getNominalColorScale(fillColumnMap, colors)

  const yDomain = extentOfExtents(
    table.getColumn(Y_MIN) as number[],
    table.getColumn(Y_MAX) as number[]
  )

  return {
    type: 'rect',
    inputTable,
    table,
    binDimension: 'x',
    xColumnKey,
    yColumnKey: COUNT,
    xDomain: resolvedXDomain,
    yDomain,
    xColumnType: inputTable.getColumnType(xColumnKey),
    yColumnType: 'number',
    scales: {fill: fillScale},
    columnGroupMaps: {fill: fillColumnMap},
  }
}

/*
  Compute the data of a histogram visualization.

  The column specified by the `xColName` will be divided into `binCount` evenly
  spaced bins, and the number of rows in each bin will be counted.

  If the `groupKeyCols` option is passed, rows in each bin are further grouped
  by the set of values for the `groupKeyCols` for the row.

  The returned result is a table where each row represents a bar in a
  (potentially stacked) histogram. For example, a histogram with two bins and
  two groups in each bin (four bars total) might have a table that looks like
  this:

      xMin | xMax | yMin | yMax | host | cpu
      --------------------------------------
         0 |   10 |    0 |   21 |  "a" |   1
         0 |   10 |   21 |   30 |  "b" |   1
        10 |   20 |    0 |    4 |  "a" |   1
        10 |   20 |    4 |    6 |  "b" |   1

  If `binCount` is not provided, a default value will be provided using
  [Sturges' formula][0].

  [0]: https://en.wikipedia.org/wiki/Histogram#Sturges'_formula
*/
export const bin = (
  table: Table,
  xColKey: string,
  xDomain: number[],
  binCount: number,
  position: HistogramPosition
): Table => {
  const xColData = table.getColumn(xColKey, 'number')
  const xColType = table.getColumnType(xColKey) as 'number'
  const groupColData = table.getColumn(FILL, 'number')

  if (!binCount) {
    binCount = thresholdSturges(xColData)
  }

  const bins = createBins(xDomain, binCount)

  // Count x values by bin and group
  for (let i = 0; i < xColData.length; i++) {
    const x = xColData[i]

    const shouldSkipPoint =
      x === undefined ||
      x === null ||
      isNaN(x) ||
      x < xDomain[0] ||
      x > xDomain[1]

    if (shouldSkipPoint) {
      continue
    }

    const xPercentage = (x - xDomain[0]) / (xDomain[1] - xDomain[0])

    let binIndex = Math.floor(xPercentage * binCount)

    if (binIndex === bins.length) {
      // Special case: the maximum value should be clamped to the last bin
      binIndex = bins.length - 1
    }

    const bin = bins[binIndex]
    const groupID = groupColData[i]

    if (!bin.values[groupID]) {
      bin.values[groupID] = 1
    } else {
      bin.values[groupID] += 1
    }
  }

  // Next, build up a tabular representation of each of these bins by group
  const groupIDs = Array.from(new Set(groupColData))

  const xMinData: number[] = []
  const xMaxData: number[] = []
  const yMinData: number[] = []
  const yMaxData: number[] = []
  const countData: number[] = []
  const fillData: number[] = []

  for (let i = 0; i < groupIDs.length; i++) {
    const groupID = groupIDs[i]

    for (const bin of bins) {
      const count = bin.values[groupID] || 0

      let yMin = 0

      if (position === 'stacked') {
        yMin = groupIDs
          .slice(0, i)
          .reduce((sum, k) => sum + (bin.values[k] || 0), 0)
      }

      xMinData.push(bin.min)
      xMaxData.push(bin.max)
      yMinData.push(yMin)
      yMaxData.push(yMin + count)
      countData.push(count)
      fillData.push(groupID)
    }
  }

  const binTable = newTable(binCount * groupIDs.length)
    .addColumn(X_MIN, xColType, xMinData)
    .addColumn(X_MAX, xColType, xMaxData)
    .addColumn(Y_MIN, 'number', yMinData)
    .addColumn(Y_MAX, 'number', yMaxData)
    .addColumn(COUNT, 'number', countData)
    .addColumn(FILL, 'number', fillData)

  return binTable
}

const createBins = (
  xDomain: number[],
  binCount: number
): Array<{max: number; min: number; values: {}}> => {
  const domainWidth = xDomain[1] - xDomain[0]
  const binWidth = domainWidth / binCount

  let binMinimums = range(xDomain[0], xDomain[1], binWidth)

  // Work around [an issue in d3-array][0] where the `stop` value for `range`
  // is inclusive due to floating point inaccuracies, even though it is
  // expected to be exclusive. Note that we don't use the recommended
  // workaround, since we wish to handle the case where the `domainWidth` is
  // less than 0.
  //
  // [0]: https://github.com/d3/d3-array/issues/5#issuecomment-132788501
  binMinimums = binMinimums.slice(0, binCount)

  const bins = binMinimums.map((min, i) => {
    const isLastBin = i === binMinimums.length - 1
    const max = isLastBin ? xDomain[1] : binMinimums[i + 1]

    return {min, max, values: {}}
  })

  return bins
}
