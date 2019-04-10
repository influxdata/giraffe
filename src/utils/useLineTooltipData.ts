import {useMemo} from 'react'
import {range} from 'd3-array'

import {TooltipData, Table, Scale} from '../types'

import {getNumericColumn} from './getNumericColumn'
import {getGroupColumn} from './getGroupColumn'

export const useLineTooltipData = (
  table: Table,
  hoverX: number,
  xColKey: string,
  yColKey: string,
  fillColKeys: string[],
  xScale: Scale<number, number>,
  fillScale: Scale<string, string>,
  width: number
): TooltipData => {
  const {data: xColData} = getNumericColumn(table, xColKey)
  const {data: groupColData} = getGroupColumn(table)

  // TODO: Make this happen on first hover, rather than first render
  const index = useMemo(() => buildIndex(xColData, xScale, width), [
    xColData,
    xScale,
    width,
  ])

  if (hoverX === undefined || hoverX === null || hoverX < 0 || hoverX > width) {
    return null
  }

  const hoveredRowIndices = lookupIndex(
    index,
    hoverX,
    xScale.invert(hoverX),
    xColData,
    groupColData
  )

  if (hoveredRowIndices.length === 0) {
    return null
  }

  const yCol = getNumericColumn(table, yColKey)

  const tooltipYCol = {
    name: yColKey,
    type: yCol.type,
    colors: [],
    values: hoveredRowIndices.map(i => yCol.data[i]),
  }

  const fillColumns = fillColKeys.map(name => ({
    name,
    type: table.columns[name].type,
    values: hoveredRowIndices.map(i => table.columns[name].data[i]),
    colors: hoveredRowIndices.map(i => fillScale(groupColData[i])),
  }))

  const x = xColData[hoveredRowIndices[0]]

  return {
    xMin: x,
    xMax: x,
    columns: [...fillColumns, tooltipYCol],
  }
}

interface IndexTable {
  xMins: number[]
  xMaxes: number[]
  indices: number[][]
}

const buildIndex = (
  xColData: number[],
  xScale: Scale<number, number>,
  width: number
): IndexTable => {
  const binWidth = 20
  const binCount = Math.ceil(width / binWidth)

  const xMins = range(binCount).map(i => binWidth * i)
  const xMaxes = range(binCount).map(i => binWidth * (i + 1))
  const indices = range(binCount).map(_ => [])

  for (let i = 0; i < xColData.length; i++) {
    const binIndex = Math.floor((xScale(xColData[i]) / width) * binCount)

    if (binIndex < 0 || binIndex >= binCount) {
      continue
    }

    indices[binIndex].push(i)
  }

  return {xMins, xMaxes, indices: indices.map(obj => Object.values(obj))}
}

const lookupIndex = (
  indexTable: IndexTable,
  hoverX: number,
  dataX: number,
  xColData: number[],
  groupColData: string[]
): number[] => {
  const binIndex = range(indexTable.xMins.length).find(
    i => indexTable.xMins[i] <= hoverX && indexTable.xMaxes[i] > hoverX
  )

  const rowIndices = indexTable.indices[binIndex]

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
