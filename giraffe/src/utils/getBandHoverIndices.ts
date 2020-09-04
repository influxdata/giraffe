import {NumericColumnData, BandIndexMap, LineData} from '../types'
import {LOWER, UPPER} from '../constants/columnKeys'
import {isDefined} from './isDefined'

interface BandBoundaries {
  [index: string]: {
    upperCol: number
    lowerCol: number
    upperIndex: number
    lowerIndex: number
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
  lowerIndices: number[]
  upperIndices: number[]
}

export const getBandBoundaries = (
  hoverRowIndices: number[],
  hoverGroupData: NumericColumnData,
  bandLineIndexMap: object
): BandBoundaries => {
  const bandBoundaries = {}

  const hoverColumnToIndexMap = {}

  if (Array.isArray(hoverRowIndices)) {
    hoverRowIndices.forEach(index => {
      hoverColumnToIndexMap[hoverGroupData[index]] = index
    })
  }

  const bands = Object.values(bandLineIndexMap)

  bands.forEach(band => {
    bandBoundaries[band.row] = {
      upperCol: null,
      lowerCol: null,
      upperIndex: null,
      lowerIndex: null,
    }
    if (isDefined(band[UPPER])) {
      bandBoundaries[band.row].upperCol = band[UPPER]
      if (isDefined(hoverColumnToIndexMap[band[UPPER]])) {
        bandBoundaries[band.row].upperIndex = hoverColumnToIndexMap[band[UPPER]]
      }
    }
    if (isDefined(band[LOWER])) {
      bandBoundaries[band.row].lowerCol = band[LOWER]
      if (isDefined(hoverColumnToIndexMap[band[LOWER]])) {
        bandBoundaries[band.row].lowerIndex = hoverColumnToIndexMap[band[LOWER]]
      }
    }
  })
  return bandBoundaries
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
  bandBoundaries: BandBoundaries
): BandIndexMap => {
  const bandHoverIndices = {
    rowIndices: [],
    lowerIndices: [],
    upperIndices: [],
  }

  if (Array.isArray(hoverRowIndices)) {
    hoverRowIndices.forEach(index => {
      const columnId = hoverGroupData[index]
      const hoveredBandId = Object.keys(bandBoundaries).find(
        bandId => Number(bandId) === Number(columnId)
      )

      if (bandBoundaries[hoveredBandId]) {
        const offset = index % lineLengths[hoveredBandId].length
        const rowBase = lineLengths[hoveredBandId].startIndex

        bandHoverIndices.rowIndices.push(rowBase + offset)
        bandHoverIndices.upperIndices.push(
          bandBoundaries[hoveredBandId].upperIndex
        )
        bandHoverIndices.lowerIndices.push(
          bandBoundaries[hoveredBandId].lowerIndex
        )
      }
    })
  }

  return bandHoverIndices
}
