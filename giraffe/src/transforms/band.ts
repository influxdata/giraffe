import {
  BandLayerSpec,
  Band,
  ColumnGroupMap,
  LineData,
  Table,
  BandIndexMap,
} from '../types'
import {FILL, LOWER, RESULT, UPPER} from '../constants/columnKeys'
import {isDefined} from '../utils/isDefined'
import {createGroupIDColumn, getBandColorScale} from './'

import {BAND_COLOR_SCALE_CONSTANT} from '../constants'

export const getBands = (
  fill: ColumnGroupMap,
  lineData: LineData,
  fillScale: Function,
  lowerColumnName: string,
  rowColumnName: string,
  upperColumnName: string
): Band[] => {
  const lowerUpperMap = {}
  const {columnKeys, mappings} = fill
  const columnKeysWithoutResult = Array.isArray(columnKeys)
    ? columnKeys.filter(key => key !== RESULT)
    : []

  if (!Array.isArray(mappings)) {
    return []
  }

  const bands = mappings.reduce((bandLines, map, index) => {
    const lineName = columnKeysWithoutResult.reduce((accum, current) => {
      return `${accum}${mappings[index][current]}`
    }, '')
    if (!lowerUpperMap[lineName]) {
      lowerUpperMap[lineName] = {}
    }
    if (map[RESULT] === upperColumnName) {
      if (!lowerUpperMap[lineName][upperColumnName]) {
        lowerUpperMap[lineName][upperColumnName] = lineData[index]
      }
    } else if (map[RESULT] === lowerColumnName) {
      if (!lowerUpperMap[lineName][lowerColumnName]) {
        lowerUpperMap[lineName][lowerColumnName] = lineData[index]
      }
    } else if (map[RESULT] === rowColumnName) {
      bandLines.push({
        ...lineData[index],
        lineName,
        fill: fillScale(bandLines.length),
      })
    }
    return bandLines
  }, [])

  bands.forEach(band => {
    if (band.lineName) {
      if (lowerUpperMap[band.lineName][lowerColumnName]) {
        band[LOWER] = {
          ...lowerUpperMap[band.lineName][lowerColumnName],
          fill: band.fill,
        }
      }
      if (lowerUpperMap[band.lineName][upperColumnName]) {
        band[UPPER] = {
          ...lowerUpperMap[band.lineName][upperColumnName],
          fill: band.fill,
        }
      }
    }
  })
  return bands as Band[]
}

export const getBandIndexMap = (
  fillColumnMap: ColumnGroupMap,
  lowerColumnName: string,
  rowColumnName: string,
  upperColumnName: string
): BandIndexMap => {
  const bandIndices = {
    rowIndices: [],
    lowerIndices: [],
    upperIndices: [],
  }

  const bands = Object.values(
    groupLineIndicesIntoBands(
      fillColumnMap,
      lowerColumnName,
      rowColumnName,
      upperColumnName
    )
  )

  if (Array.isArray(bands)) {
    bands.forEach(band => {
      bandIndices.rowIndices.push(isDefined(band.row) ? band.row : null)
      bandIndices.lowerIndices.push(isDefined(band.lower) ? band.lower : null)
      bandIndices.upperIndices.push(isDefined(band.upper) ? band.upper : null)
    })
  }

  return bandIndices
}

export const groupLineIndicesIntoBands = (
  fill: ColumnGroupMap,
  lowerColumnName: string,
  rowColumnName: string,
  upperColumnName: string
) => {
  const {columnKeys, mappings} = fill
  const columnKeysWithoutResult = Array.isArray(columnKeys)
    ? columnKeys.filter(key => key !== RESULT)
    : []
  const bandLineIndexMap = {}

  if (Array.isArray(mappings)) {
    mappings.forEach((line, index) => {
      const lineName = columnKeysWithoutResult.reduce((accum, current) => {
        return `${accum}${line[current]}`
      }, '')
      if (!bandLineIndexMap[lineName]) {
        bandLineIndexMap[lineName] = {
          lower: null,
          upper: null,
          row: null,
        }
      }
      if (line[RESULT] === lowerColumnName) {
        bandLineIndexMap[lineName][LOWER] = index
      } else if (line[RESULT] === upperColumnName) {
        bandLineIndexMap[lineName][UPPER] = index
      } else if (line[RESULT] === rowColumnName) {
        bandLineIndexMap[lineName].row = index
      }
    })
  }

  return bandLineIndexMap
}

export const alignMinMaxWithBand = (
  lineData: LineData,
  bandIndexMap: BandIndexMap
): LineData => {
  const {rowIndices, upperIndices, lowerIndices} = bandIndexMap

  const alignedData = {}

  let bandXs = []
  let bandYs = []
  let upperXs = []
  let upperYs = []
  let lowerXs = []
  let lowerYs = []

  for (let i = 0; i < rowIndices.length; i += 1) {
    const bandId = rowIndices[i]
    const upperId = upperIndices[i]
    const lowerId = lowerIndices[i]

    if (lineData[upperId]) {
      alignedData[upperId] = {
        fill: lineData[upperId].fill,
        xs: [],
        ys: [],
      }
      upperXs = lineData[upperId].xs
      upperYs = lineData[upperId].ys
    }

    if (lineData[lowerId]) {
      alignedData[lowerId] = {
        fill: lineData[lowerId].fill,
        xs: [],
        ys: [],
      }
      lowerXs = lineData[lowerId].xs
      lowerYs = lineData[lowerId].ys
    }

    if (lineData[bandId]) {
      alignedData[bandId] = {
        fill: lineData[bandId].fill,
        xs: [],
        ys: [],
      }
      bandXs = lineData[bandId].xs
      bandYs = lineData[bandId].ys

      let bandIterator = 0
      let upperIterator = 0
      let lowerIterator = 0

      while (
        bandIterator < bandXs.length ||
        upperIterator < upperXs.length ||
        lowerIterator < lowerXs.length
      ) {
        const bandTime = bandXs[bandIterator]
        const bandValue = bandYs[bandIterator]
        const upperTime = upperXs[upperIterator]
        const upperValue = upperYs[upperIterator]
        const lowerTime = lowerXs[lowerIterator]
        const lowerValue = lowerYs[lowerIterator]

        // 1. All three are equal
        if (bandTime === upperTime && bandTime === lowerTime) {
          if (isDefined(bandTime)) {
            alignedData[bandId].xs.push(bandTime)
            alignedData[bandId].ys.push(bandValue)
            bandIterator += 1
          }
          if (isDefined(upperTime)) {
            alignedData[upperId].xs.push(upperTime)
            alignedData[upperId].ys.push(upperValue)
            upperIterator += 1
          }
          if (isDefined(lowerTime)) {
            alignedData[lowerId].xs.push(lowerTime)
            alignedData[lowerId].ys.push(lowerValue)
            lowerIterator += 1
          }
        }
        // 2. Min is not equal to the other two
        else if (bandTime === upperTime) {
          if (bandTime > lowerTime || !isDefined(bandTime)) {
            if (isDefined(bandId)) {
              alignedData[bandId].xs.push(lowerTime)
              alignedData[bandId].ys.push(lowerValue)
            }
            if (isDefined(upperId)) {
              alignedData[upperId].xs.push(lowerTime)
              alignedData[upperId].ys.push(lowerValue)
            }
            alignedData[lowerId].xs.push(lowerTime)
            alignedData[lowerId].ys.push(lowerValue)
            lowerIterator += 1
          } else if (bandTime < lowerTime || !isDefined(lowerTime)) {
            alignedData[bandId].xs.push(bandTime)
            alignedData[bandId].ys.push(bandValue)
            alignedData[upperId].xs.push(upperTime)
            alignedData[upperId].ys.push(upperValue)
            if (isDefined(lowerId)) {
              alignedData[lowerId].xs.push(bandTime)
              alignedData[lowerId].ys.push(bandValue)
            }
            bandIterator += 1
            upperIterator += 1
          }
        }
        // 3. Max is not equal to the other two
        else if (bandTime === lowerTime) {
          if (bandTime > upperTime || !isDefined(bandTime)) {
            if (isDefined(bandId)) {
              alignedData[bandId].xs.push(upperTime)
              alignedData[bandId].ys.push(upperValue)
            }
            if (isDefined(lowerId)) {
              alignedData[lowerId].xs.push(upperTime)
              alignedData[lowerId].ys.push(upperValue)
            }
            alignedData[upperId].xs.push(upperTime)
            alignedData[upperId].ys.push(upperValue)
            upperIterator += 1
          } else if (bandTime < upperTime || !isDefined(upperTime)) {
            alignedData[bandId].xs.push(bandTime)
            alignedData[bandId].ys.push(bandValue)
            if (isDefined(upperId)) {
              alignedData[upperId].xs.push(bandTime)
              alignedData[upperId].ys.push(bandValue)
            }
            alignedData[lowerId].xs.push(lowerTime)
            alignedData[lowerId].ys.push(lowerValue)
            bandIterator += 1
            lowerIterator += 1
          }
        }
        // 4. Band is not equal to the other two
        else if (upperTime === lowerTime) {
          if (upperTime > bandTime || !isDefined(upperTime)) {
            alignedData[bandId].xs.push(bandTime)
            alignedData[bandId].ys.push(bandValue)
            if (isDefined(upperId)) {
              alignedData[upperId].xs.push(bandTime)
              alignedData[upperId].ys.push(bandValue)
            }
            if (isDefined(lowerId)) {
              alignedData[lowerId].xs.push(bandTime)
              alignedData[lowerId].ys.push(bandValue)
            }
            bandIterator += 1
          } else if (upperTime < bandTime || !isDefined(bandTime)) {
            if (isDefined(bandId)) {
              alignedData[bandId].xs.push(upperTime)
              alignedData[bandId].ys.push(upperValue)
            }
            alignedData[upperId].xs.push(upperTime)
            alignedData[upperId].ys.push(upperValue)
            alignedData[lowerId].xs.push(lowerTime)
            alignedData[lowerId].ys.push(lowerValue)
            upperIterator += 1
            lowerIterator += 1
          }
        }
        // 5. They are all different
        else {
          if (!isDefined(bandTime)) {
            if (upperTime > lowerTime) {
              if (isDefined(bandId)) {
                alignedData[bandId].xs.push(lowerTime)
                alignedData[bandId].ys.push(lowerValue)
              }
              alignedData[upperId].xs.push(lowerTime)
              alignedData[upperId].ys.push(lowerValue)
              alignedData[lowerId].xs.push(lowerTime)
              alignedData[lowerId].ys.push(lowerValue)
              lowerIterator += 1
            } else {
              if (isDefined(bandId)) {
                alignedData[bandId].xs.push(upperTime)
                alignedData[bandId].ys.push(upperValue)
              }
              alignedData[upperId].xs.push(upperTime)
              alignedData[upperId].ys.push(upperValue)
              alignedData[lowerId].xs.push(upperTime)
              alignedData[lowerId].ys.push(upperValue)
              upperIterator += 1
            }
          } else if (!isDefined(upperTime)) {
            if (bandTime > lowerTime) {
              alignedData[bandId].xs.push(lowerTime)
              alignedData[bandId].ys.push(lowerValue)
              if (isDefined(upperId)) {
                alignedData[upperId].xs.push(lowerTime)
                alignedData[upperId].ys.push(lowerValue)
              }
              alignedData[lowerId].xs.push(lowerTime)
              alignedData[lowerId].ys.push(lowerValue)
              lowerIterator += 1
            } else {
              alignedData[bandId].xs.push(bandTime)
              alignedData[bandId].ys.push(bandValue)
              if (isDefined(upperId)) {
                alignedData[upperId].xs.push(bandTime)
                alignedData[upperId].ys.push(bandValue)
              }
              alignedData[lowerId].xs.push(bandTime)
              alignedData[lowerId].ys.push(bandValue)
              bandIterator += 1
            }
          } else if (!isDefined(lowerTime)) {
            if (bandTime > upperTime) {
              alignedData[bandId].xs.push(upperTime)
              alignedData[bandId].ys.push(upperValue)
              alignedData[upperId].xs.push(upperTime)
              alignedData[upperId].ys.push(upperValue)
              if (isDefined(lowerId)) {
                alignedData[lowerId].xs.push(upperTime)
                alignedData[lowerId].ys.push(upperValue)
              }
              upperIterator += 1
            } else {
              alignedData[bandId].xs.push(bandTime)
              alignedData[bandId].ys.push(bandValue)
              alignedData[upperId].xs.push(bandTime)
              alignedData[upperId].ys.push(bandValue)
              if (isDefined(lowerId)) {
                alignedData[lowerId].xs.push(bandTime)
                alignedData[lowerId].ys.push(bandValue)
              }
              bandIterator += 1
            }
          } else {
            const lowest = Math.min(bandTime, upperTime, lowerTime)

            if (lowest === lowerTime) {
              alignedData[bandId].xs.push(lowerTime)
              alignedData[bandId].ys.push(lowerValue)
              alignedData[upperId].xs.push(lowerTime)
              alignedData[upperId].ys.push(lowerValue)
              alignedData[lowerId].xs.push(lowerTime)
              alignedData[lowerId].ys.push(lowerValue)
              lowerIterator += 1
            } else if (lowest === upperTime) {
              alignedData[bandId].xs.push(upperTime)
              alignedData[bandId].ys.push(upperValue)
              alignedData[upperId].xs.push(upperTime)
              alignedData[upperId].ys.push(upperValue)
              alignedData[lowerId].xs.push(upperTime)
              alignedData[lowerId].ys.push(upperValue)
              upperIterator += 1
            } else {
              alignedData[bandId].xs.push(bandTime)
              alignedData[bandId].ys.push(bandValue)
              alignedData[upperId].xs.push(bandTime)
              alignedData[upperId].ys.push(bandValue)
              alignedData[lowerId].xs.push(bandTime)
              alignedData[lowerId].ys.push(bandValue)
              bandIterator += 1
            }
          }
        }
      }
    }
  }

  return alignedData
}

export const bandTransform = (
  inputTable: Table,
  xColumnKey: string,
  yColumnKey: string,
  fillColKeys: string[],
  colors: string[],
  lowerColumnName: string,
  rowColumnName: string,
  upperColumnName: string
): BandLayerSpec => {
  const [fillColumn, fillColumnMap] = createGroupIDColumn(
    inputTable,
    fillColKeys
  )

  const table = inputTable.addColumn(FILL, 'number', fillColumn)
  const xCol = table.getColumn(xColumnKey, 'number')
  const yCol = table.getColumn(yColumnKey, 'number')
  const bandIndexMap = getBandIndexMap(
    fillColumnMap,
    lowerColumnName || '',
    rowColumnName,
    upperColumnName || ''
  )
  const fillScale = range =>
    getBandColorScale(bandIndexMap, colors)(range * BAND_COLOR_SCALE_CONSTANT)

  const bandFillColors = []
  const lineData: LineData = {}

  let xMin = Infinity
  let xMax = -Infinity
  let yMin = Infinity
  let yMax = -Infinity

  for (let i = 0; i < table.length; i++) {
    const groupID = fillColumn[i]
    const x = xCol[i]
    const y = yCol[i]

    if (!lineData[groupID]) {
      lineData[groupID] = {xs: [], ys: [], fill: fillScale(groupID)}
      bandFillColors.push(fillScale(groupID))
    }

    lineData[groupID].xs.push(x)
    lineData[groupID].ys.push(y)

    xMin = Math.min(x, xMin)
    xMax = Math.max(x, xMax)
    yMin = Math.min(y, yMin)
    yMax = Math.max(y, yMax)
  }

  return {
    type: 'band',
    bandIndexMap,
    bandName: rowColumnName,
    inputTable,
    table,
    lineData,
    xDomain: [xMin, xMax],
    yDomain: [yMin, yMax],
    xColumnKey,
    yColumnKey,
    xColumnType: table.getColumnType(xColumnKey),
    yColumnType: table.getColumnType(yColumnKey),
    scales: {fill: fillScale},
    columnGroupMaps: {fill: fillColumnMap},
  }
}
