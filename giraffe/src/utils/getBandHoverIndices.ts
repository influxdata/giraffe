import {NumericColumnData, BandIndexMap, LineData} from '../types'
import {isDefined} from './isDefined'

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
  bandLineIndexMap: object
): BandIndexMap => {
  const bandHoverIndices = {
    rowIndices: [],
    lowerIndices: [],
    upperIndices: [],
  }
  const hoverGroupBoundaries = {}

  if (Array.isArray(hoverGroupData)) {
    hoverGroupData.forEach((lineIndex, position) => {
      if (!hoverGroupBoundaries[lineIndex]) {
        hoverGroupBoundaries[lineIndex] = {
          length: lineLengths[lineIndex].length,
          startIndex: position,
        }
      }
    })
  }

  const bands = bandLineIndexMap ? Object.values(bandLineIndexMap) : []
  bands.forEach(band => {
    if (hoverGroupBoundaries[band.row]) {
      hoverGroupBoundaries[band.row].upper = band.upper
      hoverGroupBoundaries[band.row].lower = band.lower
    }
  })

  if (Array.isArray(hoverRowIndices)) {
    hoverRowIndices.forEach(index => {
      const columnId = hoverGroupData[index]
      const hoveredBandId = Object.keys(hoverGroupBoundaries).find(
        bandId => Number(bandId) === Number(columnId)
      )

      if (hoverGroupBoundaries[hoveredBandId]) {
        const rowBase = lineLengths[hoveredBandId].startIndex
        const offset = index - hoverGroupBoundaries[hoveredBandId].startIndex

        bandHoverIndices.rowIndices.push(rowBase + offset)

        if (isDefined(hoverGroupBoundaries[hoveredBandId].upper)) {
          const upperBase =
            lineLengths[hoverGroupBoundaries[hoveredBandId].upper].startIndex
          bandHoverIndices.upperIndices.push(upperBase + offset)
        }

        if (isDefined(hoverGroupBoundaries[hoveredBandId].lower)) {
          const lowerBase =
            lineLengths[hoverGroupBoundaries[hoveredBandId].lower].startIndex
          bandHoverIndices.lowerIndices.push(lowerBase + offset)
        }
      }
    })
  }

  return bandHoverIndices
}
