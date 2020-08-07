import {NumericColumnData, BandIndexMap} from '../types'

export interface BandHoverIndices {
  rowIndices: number[]
  minIndices: number[]
  maxIndices: number[]
}

export const removeMinMaxHoverIndices = (
  hoverRowIndices: number[],
  groupColData: NumericColumnData,
  bandLineIndices: number[]
): number[] => {
  const updatedHoverIndices = []

  if (Array.isArray(hoverRowIndices)) {
    hoverRowIndices.forEach(index => {
      const columnId = groupColData[index]
      const isBandLine = bandLineIndices.includes(columnId)
      if (isBandLine) {
        updatedHoverIndices.push(index)
      }
    })
  }

  return updatedHoverIndices
}

export const getBandHoverIndices = (
  hoverRowIndices: number[],
  groupColData: NumericColumnData,
  bandIndexMap: BandIndexMap
): BandIndexMap => {
  const bandHoverIndices = {
    rowIndices: [],
    minIndices: [],
    maxIndices: [],
  }

  if (Array.isArray(hoverRowIndices)) {
    hoverRowIndices.forEach(index => {
      const columnId = groupColData[index]
      if (bandIndexMap.maxIndices.includes(columnId)) {
        bandHoverIndices.maxIndices.push(index)
      } else if (bandIndexMap.minIndices.includes(columnId)) {
        bandHoverIndices.minIndices.push(index)
      } else if (bandIndexMap.rowIndices.includes(columnId)) {
        bandHoverIndices.rowIndices.push(index)
      }
    })
  }

  return bandHoverIndices
}
