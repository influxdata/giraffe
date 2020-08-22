import {
  BandLayerSpec,
  Band,
  ColumnGroupMap,
  LineData,
  Table,
  BandIndexMap,
} from '../types'
import {FILL, RESULT, MAX, MIN} from '../constants/columnKeys'
import {isDefined} from '../utils/isDefined'
import {createGroupIDColumn, getNominalColorScale} from './'

export const getBands = (
  fill: ColumnGroupMap,
  lineData: LineData,
  bandFillColors: string[]
): Band[] => {
  const minMaxMap = {}
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
    if (!minMaxMap[lineName]) {
      minMaxMap[lineName] = {}
    }
    if (map[RESULT] === MAX) {
      if (!minMaxMap[lineName][MAX]) {
        minMaxMap[lineName][MAX] = lineData[index]
      }
    } else if (map[RESULT] === MIN) {
      if (!minMaxMap[lineName][MIN]) {
        minMaxMap[lineName][MIN] = lineData[index]
      }
    } else {
      bandLines.push({
        ...lineData[index],
        lineName,
        fill: bandFillColors[bandLines.length],
      })
    }
    return bandLines
  }, [])

  bands.forEach(band => {
    if (minMaxMap[band.lineName][MIN]) {
      band[MIN] = {...minMaxMap[band.lineName][MIN], fill: band.fill}
    }
    if (minMaxMap[band.lineName][MAX]) {
      band[MAX] = {...minMaxMap[band.lineName][MAX], fill: band.fill}
    }
  })
  return bands as Band[]
}

export const getBandIndexMap = (
  fillColumnMap: ColumnGroupMap
): BandIndexMap => {
  const bandIndices = {
    rowIndices: [],
    minIndices: [],
    maxIndices: [],
  }

  const bands = Object.values(groupLineIndicesIntoBands(fillColumnMap))

  if (Array.isArray(bands)) {
    bands.forEach(band => {
      bandIndices.rowIndices.push(isDefined(band.row) ? band.row : null)
      bandIndices.minIndices.push(isDefined(band.min) ? band.min : null)
      bandIndices.maxIndices.push(isDefined(band.max) ? band.max : null)
    })
  }

  return bandIndices
}

export const groupLineIndicesIntoBands = (fill: ColumnGroupMap) => {
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
          min: null,
          max: null,
          row: null,
        }
      }
      if (line[RESULT] === MAX || line[RESULT] === MIN) {
        bandLineIndexMap[lineName][line[RESULT]] = index
      } else {
        bandLineIndexMap[lineName].row = index
      }
    })
  }

  return bandLineIndexMap
}

export const getBandName = (fillColumnMap: ColumnGroupMap): string => {
  if (!Array.isArray(fillColumnMap.mappings)) {
    return ''
  }
  return fillColumnMap.mappings.reduce((name, line) => {
    if (!name && line[RESULT] !== MAX && line[RESULT] !== MIN) {
      name = line[RESULT]
    }
    return name
  }, '')
}

export const alignMinMaxWithBand = (
  lineData: LineData,
  bandIndexMap: BandIndexMap
): LineData => {
  const {rowIndices, maxIndices, minIndices} = bandIndexMap

  const alignedData = {}

  let bandXs = []
  let bandYs = []
  let maxXs = []
  let maxYs = []
  let minXs = []
  let minYs = []

  for (let i = 0; i < rowIndices.length; i += 1) {
    const bandId = rowIndices[i]
    const maxId = maxIndices[i]
    const minId = minIndices[i]

    if (lineData[maxId]) {
      alignedData[maxId] = {
        fill: lineData[maxId].fill,
        xs: [],
        ys: [],
      }
      maxXs = lineData[maxId].xs
      maxYs = lineData[maxId].ys
    }

    if (lineData[minId]) {
      alignedData[minId] = {
        fill: lineData[minId].fill,
        xs: [],
        ys: [],
      }
      minXs = lineData[minId].xs
      minYs = lineData[minId].ys
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
      let maxIterator = 0
      let minIterator = 0

      while (
        bandIterator < bandXs.length ||
        maxIterator < maxXs.length ||
        minIterator < minXs.length
      ) {
        const bandTime = bandXs[bandIterator]
        const bandValue = bandYs[bandIterator]
        const maxTime = maxXs[maxIterator]
        const maxValue = maxYs[maxIterator]
        const minTime = minXs[minIterator]
        const minValue = minYs[minIterator]

        // 1. All three are equal
        if (bandTime === maxTime && bandTime === minTime) {
          if (isDefined(bandTime)) {
            alignedData[bandId].xs.push(bandTime)
            alignedData[bandId].ys.push(bandValue)
            bandIterator += 1
          }
          if (isDefined(maxTime)) {
            alignedData[maxId].xs.push(maxTime)
            alignedData[maxId].ys.push(maxValue)
            maxIterator += 1
          }
          if (isDefined(minTime)) {
            alignedData[minId].xs.push(minTime)
            alignedData[minId].ys.push(minValue)
            minIterator += 1
          }
        }
        // 2. Min is not equal to the other two
        else if (bandTime === maxTime) {
          if (bandTime > minTime || !isDefined(bandTime)) {
            alignedData[bandId].xs.push(minTime)
            alignedData[bandId].ys.push(minValue)
            alignedData[maxId].xs.push(minTime)
            alignedData[maxId].ys.push(minValue)
            alignedData[minId].xs.push(minTime)
            alignedData[minId].ys.push(minValue)
            minIterator += 1
          } else if (bandTime < minTime || !isDefined(minTime)) {
            alignedData[bandId].xs.push(bandTime)
            alignedData[bandId].ys.push(bandValue)
            alignedData[maxId].xs.push(maxTime)
            alignedData[maxId].ys.push(maxValue)
            alignedData[minId].xs.push(bandTime)
            alignedData[minId].ys.push(bandValue)
            bandIterator += 1
            maxIterator += 1
          }
        }
        // 3. Max is not equal to the other two
        else if (bandTime === minTime) {
          if (bandTime > maxTime || !isDefined(bandTime)) {
            alignedData[bandId].xs.push(maxTime)
            alignedData[bandId].ys.push(maxValue)
            alignedData[minId].xs.push(maxTime)
            alignedData[minId].ys.push(maxValue)
            alignedData[maxId].xs.push(maxTime)
            alignedData[maxId].ys.push(maxValue)
            maxIterator += 1
          } else if (bandTime < maxTime || !isDefined(maxTime)) {
            alignedData[bandId].xs.push(bandTime)
            alignedData[bandId].ys.push(bandValue)
            alignedData[maxId].xs.push(bandTime)
            alignedData[maxId].ys.push(bandValue)
            alignedData[minId].xs.push(minTime)
            alignedData[minId].ys.push(minValue)
            bandIterator += 1
            minIterator += 1
          }
        }
        // 4. Band is not equal to the other two
        else if (maxTime === minTime) {
          if (maxTime > bandTime || !isDefined(maxTime)) {
            alignedData[bandId].xs.push(bandTime)
            alignedData[bandId].ys.push(bandValue)
            alignedData[maxId].xs.push(bandTime)
            alignedData[maxId].ys.push(bandValue)
            alignedData[minId].xs.push(bandTime)
            alignedData[minId].ys.push(bandValue)
            bandIterator += 1
          } else if (maxTime < bandTime || !isDefined(bandTime)) {
            alignedData[bandId].xs.push(maxTime)
            alignedData[bandId].ys.push(maxValue)
            alignedData[maxId].xs.push(maxTime)
            alignedData[maxId].ys.push(maxValue)
            alignedData[minId].xs.push(minTime)
            alignedData[minId].ys.push(minValue)
            maxIterator += 1
            minIterator += 1
          }
        }
        // 5. They are all different
        else {
          if (!isDefined(bandTime)) {
            if (maxTime > minTime) {
              alignedData[bandId].xs.push(minTime)
              alignedData[bandId].ys.push(minValue)
              alignedData[maxId].xs.push(minTime)
              alignedData[maxId].ys.push(minValue)
              alignedData[minId].xs.push(minTime)
              alignedData[minId].ys.push(minValue)
              minIterator += 1
            } else {
              alignedData[bandId].xs.push(maxTime)
              alignedData[bandId].ys.push(maxValue)
              alignedData[maxId].xs.push(maxTime)
              alignedData[maxId].ys.push(maxValue)
              alignedData[minId].xs.push(maxTime)
              alignedData[minId].ys.push(maxValue)
              maxIterator += 1
            }
          } else if (!isDefined(maxTime)) {
            if (bandTime > minTime) {
              alignedData[bandId].xs.push(minTime)
              alignedData[bandId].ys.push(minValue)
              alignedData[maxId].xs.push(minTime)
              alignedData[maxId].ys.push(minValue)
              alignedData[minId].xs.push(minTime)
              alignedData[minId].ys.push(minValue)
              minIterator += 1
            } else {
              alignedData[bandId].xs.push(bandTime)
              alignedData[bandId].ys.push(bandValue)
              alignedData[maxId].xs.push(bandTime)
              alignedData[maxId].ys.push(bandValue)
              alignedData[minId].xs.push(bandTime)
              alignedData[minId].ys.push(bandValue)
              bandIterator += 1
            }
          } else if (!isDefined(minTime)) {
            if (bandTime > maxTime) {
              alignedData[bandId].xs.push(maxTime)
              alignedData[bandId].ys.push(maxValue)
              alignedData[maxId].xs.push(maxTime)
              alignedData[maxId].ys.push(maxValue)
              alignedData[minId].xs.push(maxTime)
              alignedData[minId].ys.push(maxValue)
              maxIterator += 1
            } else {
              alignedData[bandId].xs.push(bandTime)
              alignedData[bandId].ys.push(bandValue)
              alignedData[maxId].xs.push(bandTime)
              alignedData[maxId].ys.push(bandValue)
              alignedData[minId].xs.push(bandTime)
              alignedData[minId].ys.push(bandValue)
              bandIterator += 1
            }
          } else {
            const lowest = Math.min(bandTime, maxTime, minTime)

            if (lowest === minTime) {
              alignedData[bandId].xs.push(minTime)
              alignedData[bandId].ys.push(minValue)
              alignedData[maxId].xs.push(minTime)
              alignedData[maxId].ys.push(minValue)
              alignedData[minId].xs.push(minTime)
              alignedData[minId].ys.push(minValue)
              minIterator += 1
            } else if (lowest === maxTime) {
              alignedData[bandId].xs.push(maxTime)
              alignedData[bandId].ys.push(maxValue)
              alignedData[maxId].xs.push(maxTime)
              alignedData[maxId].ys.push(maxValue)
              alignedData[minId].xs.push(maxTime)
              alignedData[minId].ys.push(maxValue)
              maxIterator += 1
            } else {
              alignedData[bandId].xs.push(bandTime)
              alignedData[bandId].ys.push(bandValue)
              alignedData[maxId].xs.push(bandTime)
              alignedData[maxId].ys.push(bandValue)
              alignedData[minId].xs.push(bandTime)
              alignedData[minId].ys.push(bandValue)
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
  colors: string[]
): BandLayerSpec => {
  const [fillColumn, fillColumnMap] = createGroupIDColumn(
    inputTable,
    fillColKeys
  )

  const table = inputTable.addColumn(FILL, 'number', fillColumn)
  const xCol = table.getColumn(xColumnKey, 'number')
  const yCol = table.getColumn(yColumnKey, 'number')
  const fillScale = getNominalColorScale(fillColumnMap, colors)
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
    bandFillColors,
    bandIndexMap: getBandIndexMap(fillColumnMap),
    bandName: getBandName(fillColumnMap),
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
