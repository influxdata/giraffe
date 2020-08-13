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
  lineLength: number,
  hoverRowIndices: number[],
  hoverGroupData: NumericColumnData,
  bandLineIndexMap: object
): BandIndexMap => {
  const bandHoverIndices = {
    rowIndices: [],
    minIndices: [],
    maxIndices: [],
  }

  if (Array.isArray(hoverRowIndices)) {
    const bands = Object.values(bandLineIndexMap)

    hoverRowIndices.forEach(index => {
      const columnId = hoverGroupData[index]
      const offset = index % lineLength
      const hoveredBand = bands.find(band => band.row === columnId)
      bandHoverIndices.maxIndices.push(hoveredBand.max * lineLength + offset)
      bandHoverIndices.minIndices.push(hoveredBand.min * lineLength + offset)
      bandHoverIndices.rowIndices.push(hoveredBand.row * lineLength + offset)
    })
  }

  return bandHoverIndices
}
