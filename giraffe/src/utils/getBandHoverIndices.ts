import {NumericColumnData, BandIndexMap, LineData} from '../types'

export interface BandHoverIndices {
  rowIndices: number[]
  minIndices: number[]
  maxIndices: number[]
}

interface LineLengths {
  [index: string]: {
    length: number
    startIndex: number
  }
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
    minIndices: [],
    maxIndices: [],
  }

  if (Array.isArray(hoverRowIndices)) {
    const bands = Object.values(bandLineIndexMap)

    hoverRowIndices.forEach(index => {
      const columnId = hoverGroupData[index]
      const hoveredBand = bands.find(band => band.row === columnId)

      if (hoveredBand) {
        const offset = index % lineLengths[hoveredBand.row].length
        const maxBase = lineLengths[hoveredBand.max].startIndex
        const minBase = lineLengths[hoveredBand.min].startIndex
        const rowBase = lineLengths[hoveredBand.row].startIndex

        bandHoverIndices.maxIndices.push(maxBase + offset)
        bandHoverIndices.minIndices.push(minBase + offset)
        bandHoverIndices.rowIndices.push(rowBase + offset)
      }
    })
  }

  return bandHoverIndices
}
