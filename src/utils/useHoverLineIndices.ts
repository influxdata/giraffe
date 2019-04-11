import {range} from 'd3-array'

import {Table, Scale} from '../types'

import {getNumericColumn} from './getNumericColumn'
import {getGroupColumn} from './getGroupColumn'
import {useLazyMemo} from './useLazyMemo'

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

  // TODO: Make this happen on first hover, rather than first render
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
    xScale.invert(hoverX),
    xColData,
    groupColData,
    width
  )

  return hoveredRowIndices
}

const INDEX_BIN_WIDTH = 20

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
    const binIndex = getBinIndex(xScale(xColData[i]), width)

    if (binIndex < 0 || binIndex >= binCount) {
      continue
    }

    indices[binIndex].push(i)
  }

  return {xMins, xMaxes, indices}
}

const lookupIndex = (
  indexTable: IndexTable,
  hoverX: number,
  dataX: number,
  xColData: number[],
  groupColData: string[],
  width: number
): number[] => {
  const binIndex = getBinIndex(hoverX, width)

  const rowIndices =
    binIndex === 0
      ? indexTable.indices[binIndex]
      : [...indexTable.indices[binIndex - 1], ...indexTable.indices[binIndex]]

  interface IndicesByGroup {
    [groupKey: string]: {minIndex: number; dist: number}
  }

  const indicesByGroup: IndicesByGroup = {}

  for (const i of rowIndices) {
    const group = groupColData[i]

    if (!indicesByGroup[group]) {
      indicesByGroup[group] = {
        minIndex: i,
        dist: Math.abs(dataX - xColData[i]),
      }

      continue
    }

    const dist = Math.abs(dataX - xColData[i])

    if (dist < indicesByGroup[group].dist) {
      indicesByGroup[group] = {
        minIndex: i,
        dist: Math.abs(dataX - xColData[i]),
      }
    }
  }

  return Object.values(indicesByGroup).map(d => d.minIndex)
}
