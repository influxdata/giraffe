import {NumericColumnData, BandLineMap, LineData, Scale, Table} from '../types'
// import {LineData, } from '../types'
import {isDefined} from './isDefined'

import {FILL} from '../constants/columnKeys'
import {isNumber} from './isNumber'

export const getBandHoverPoints = (
  table: Table,
  hoverRowIndices: number[],
  xColKey: string,
  yColKey: string,
  xScale: Scale<number, number>,
  yScale: Scale<number, number>,
  lineData: LineData
): Array<{x: number; y: number; fill: string}> => {
  const xColData = table.getColumn(xColKey, 'number')
  const yColData = table.getColumn(yColKey, 'number')
  const groupColData = table.getColumn(FILL, 'number')
  const lines = lineData || {}

  return hoverRowIndices.map(hoverIndex => {
    let color = ''
    const lineIndex = groupColData[hoverIndex]
    if (isNumber(lineIndex) && lines[lineIndex]) {
      color = lines[lineIndex].fill
    }
    return {
      x: xScale(xColData[hoverIndex]),
      y: yScale(yColData[hoverIndex]),
      fill: color,
    }
  })
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
): BandLineMap => {
  const bandHoverIndices = {
    rowLines: [],
    lowerLines: [],
    upperLines: [],
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

        bandHoverIndices.rowLines.push(rowBase + offset)

        if (isDefined(hoverGroupBoundaries[hoveredBandId].upper)) {
          const upperBase =
            lineLengths[hoverGroupBoundaries[hoveredBandId].upper].startIndex
          bandHoverIndices.upperLines.push(upperBase + offset)
        }

        if (isDefined(hoverGroupBoundaries[hoveredBandId].lower)) {
          const lowerBase =
            lineLengths[hoverGroupBoundaries[hoveredBandId].lower].startIndex
          bandHoverIndices.lowerLines.push(lowerBase + offset)
        }
      }
    })
  }

  return bandHoverIndices
}
