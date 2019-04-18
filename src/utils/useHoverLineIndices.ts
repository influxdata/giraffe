import {range} from 'd3-array'

import {Table, Scale} from '../types'
import {getNumericColumn} from './getNumericColumn'
import {getGroupColumn} from './getGroupColumn'
import {useLazyMemo} from './useLazyMemo'
import {isDefined} from './isDefined'

export const useHoverLineIndices = (
  table: Table,
  hoverX: number,
  xColKey: string,
  xScale: Scale<number, number>,
  width: number
): number[] => {
  const isActive =
    hoverX !== undefined && hoverX !== null && hoverX >= 0 && hoverX < width

  const {data: xColData} = getNumericColumn(table, xColKey)
  const {data: groupColData} = getGroupColumn(table)

  const index = useLazyMemo(
    () => buildIndex(xColData, xScale, width),
    [xColData, xScale, width],
    isActive
  )

  if (!isActive) {
    return null
  }

  const hoveredRowIndices = lookupIndex(
    index,
    hoverX,
    width,
    xScale.invert(hoverX),
    xColData,
    groupColData
  )

  return hoveredRowIndices
}

const INDEX_BIN_WIDTH = 10

const getBinIndex = (x: number, width: number): number => {
  const binCount = Math.ceil(width / INDEX_BIN_WIDTH)
  const binIndex = Math.floor((x / width) * binCount)

  return binIndex
}

interface IndexTable {
  xMins: number[]
  xMaxes: number[]
  indices: number[][]
}

/*
  When a user hovers over a line graph, we need to show the points on each line
  closest to the mouse position. Since we don't want to look through the entire
  table to find the closest points on every hover event, we build an index on
  the first hover event that makes subsequent lookups fast.

  The index works by dividing the horizontal aspect of the graph into discrete
  bins, each of them `INDEX_BIN_WIDTH` wide. For each bin we store the indices
  of rows in the original user-supplied table whose x column value lies within
  that bin.
  
  Then on every hover event, we can use some quick math to decide which bin the
  current hover corresponds to. Then we perform a linear search within each bin
  to find the point on each line closest to the mouse position.  This limits
  the amount of work we have to do, since we only need to scan through a single
  bin, rather than through the entire table.
*/
const buildIndex = (
  xColData: number[],
  xScale: Scale<number, number>,
  width: number
): IndexTable => {
  const binCount = Math.ceil(width / INDEX_BIN_WIDTH)
  const xMins = range(binCount).map(i => INDEX_BIN_WIDTH * i)
  const xMaxes = range(binCount).map(i => INDEX_BIN_WIDTH * (i + 1))
  const indices = range(binCount).map(_ => [])

  for (let i = 0; i < xColData.length; i++) {
    const x = xScale(xColData[i])

    if (!isDefined(x)) {
      continue
    }

    const binIndex = getBinIndex(x, width)

    if (binIndex < 0 || binIndex >= binCount) {
      continue
    }

    indices[binIndex].push(i)
  }

  return {xMins, xMaxes, indices}
}

interface NearestIndexByGroup {
  [groupKey: string]: {i: number; distance: number}
}

const lookupIndex = (
  indexTable: IndexTable,
  hoverX: number,
  width: number,
  dataX: number,
  xColData: number[],
  groupColData: string[]
) => {
  const initialBinIndex = getBinIndex(hoverX, width)
  const maxBinIndex = indexTable.indices.length - 1

  let leftBinIndex = Math.max(0, initialBinIndex - 1)
  let rightBinIndex = Math.min(initialBinIndex, maxBinIndex)
  let leftRowIndices = indexTable.indices[leftBinIndex]
  let rightRowIndices = indexTable.indices[rightBinIndex]

  // If no points are within the current left and right bins, expand the search
  // outward to the next nearest bins
  while (
    !leftRowIndices.length &&
    !rightRowIndices.length &&
    (leftBinIndex !== 0 || rightBinIndex !== indexTable.indices.length)
  ) {
    leftBinIndex = Math.max(0, leftBinIndex - 1)
    rightBinIndex = Math.min(rightBinIndex + 1, maxBinIndex)
    leftRowIndices = indexTable.indices[leftBinIndex]
    rightRowIndices = indexTable.indices[rightBinIndex]
  }

  let nearestIndexByGroup: NearestIndexByGroup = {}

  collectNearestIndices(
    nearestIndexByGroup,
    leftRowIndices,
    dataX,
    xColData,
    groupColData
  )

  collectNearestIndices(
    nearestIndexByGroup,
    rightRowIndices,
    dataX,
    xColData,
    groupColData
  )

  return Object.values(nearestIndexByGroup).map(d => d.i)
}

const collectNearestIndices = (
  acc: NearestIndexByGroup,
  rowIndices: number[],
  dataX: number,
  xColData: number[],
  groupColData: string[]
): void => {
  for (const i of rowIndices) {
    const group = groupColData[i]
    const distance = Math.abs(dataX - xColData[i])

    if (!acc[group] || distance < acc[group].distance) {
      acc[group] = {i, distance}
    }
  }
}
