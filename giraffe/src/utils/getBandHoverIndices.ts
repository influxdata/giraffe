import {NumericColumnData, BandIndexMap, LineData} from '../types'
import {isDefined} from './isDefined'

interface MinMaxOfBands {
  [index: string]: {
    maxCol: number
    minCol: number
    maxIndex: number
    minIndex: number
  }
}

interface LineLengths {
  [index: string]: {
    length: number
    startIndex: number
  }
}

export interface BandHoverIndices {
  rowIndices: number[]
  minIndices: number[]
  maxIndices: number[]
}

export const getMinMaxOfBands = (
  hoverRowIndices: number[],
  hoverGroupData: NumericColumnData,
  bandLineIndexMap: object
): MinMaxOfBands => {
  const minMaxOfBands = {}

  const hoverColumnToIndexMap = {}

  if (Array.isArray(hoverRowIndices)) {
    hoverRowIndices.forEach(index => {
      hoverColumnToIndexMap[hoverGroupData[index]] = index
    })
  }

  const bands = Object.values(bandLineIndexMap)

  bands.forEach(band => {
    minMaxOfBands[band.row] = {
      maxCol: null,
      minCol: null,
      maxIndex: null,
      minIndex: null,
    }
    if (isDefined(band.max)) {
      minMaxOfBands[band.row].maxCol = band.max
      if (isDefined(hoverColumnToIndexMap[band.max])) {
        minMaxOfBands[band.row].maxIndex = hoverColumnToIndexMap[band.max]
      }
    }
    if (isDefined(band.min)) {
      minMaxOfBands[band.row].minCol = band.min
      if (isDefined(hoverColumnToIndexMap[band.min])) {
        minMaxOfBands[band.row].minIndex = hoverColumnToIndexMap[band.min]
      }
    }
  })
  return minMaxOfBands
}

export const getLineLengths = (lineData: LineData): LineLengths => {
  const keys = Object.keys(lineData)

  const lineLengths = {}
  let total = 0
  if (Array.isArray(keys)) {
    keys.forEach(lineIndex => {
      const length = Math.min(
        lineData[lineIndex].xs.length,
        lineData[lineIndex].ys.length
      )
      if (!lineLengths[lineIndex]) {
        lineLengths[lineIndex] = {}
      }
      lineLengths[lineIndex].length = length
      lineLengths[lineIndex].startIndex = total
      total += length
    })
  }
  return lineLengths
}

export const getBandHoverIndices = (
  lineLengths: LineLengths,
  hoverRowIndices: number[],
  hoverGroupData: NumericColumnData,
  minMaxOfBands: MinMaxOfBands
): BandIndexMap => {
  const bandHoverIndices = {
    rowIndices: [],
    minIndices: [],
    maxIndices: [],
  }

  if (Array.isArray(hoverRowIndices)) {
    hoverRowIndices.forEach(index => {
      const columnId = hoverGroupData[index]
      const hoveredBandId = Object.keys(minMaxOfBands).find(
        bandId => Number(bandId) === Number(columnId)
      )

      if (minMaxOfBands[hoveredBandId]) {
        const offset = index % lineLengths[hoveredBandId].length
        const rowBase = lineLengths[hoveredBandId].startIndex

        bandHoverIndices.rowIndices.push(rowBase + offset)
        bandHoverIndices.maxIndices.push(minMaxOfBands[hoveredBandId].maxIndex)
        bandHoverIndices.minIndices.push(minMaxOfBands[hoveredBandId].minIndex)
      }
    })
  }

  return bandHoverIndices
}
