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

  for (let i = 0; i < rowIndices.length; i += 1) {
    const bandId = rowIndices[i]
    const minId = minIndices[i]
    const maxId = maxIndices[i]

    let bandXs = []
    let bandYs = []
    let maxXs = []
    let maxYs = []
    let minXs = []
    let minYs = []

    if (lineData[bandId]) {
      bandXs = Array.from(lineData[bandId].xs)
      bandYs = Array.from(lineData[bandId].ys)
    }

    if (lineData[maxId]) {
      maxXs = Array.from(lineData[maxId].xs)
      maxYs = Array.from(lineData[maxId].ys)
    }

    if (lineData[minId]) {
      minXs = Array.from(lineData[minId].xs)
      minYs = Array.from(lineData[minId].ys)
    }

    let position = 0

    while (position < bandXs.length && position < bandYs.length) {
      const bandTime = bandXs[position]
      const bandValue = bandYs[position]

      if (maxXs[position] < bandTime) {
        bandXs.splice(position, 0, maxXs[position])
        bandYs.splice(position, 0, maxYs[position])
      } else if (minXs[position] < bandTime) {
        bandXs.splice(position, 0, minXs[position])
        bandYs.splice(position, 0, minYs[position])
      }

      if (!isDefined(maxXs[position]) || bandTime < maxXs[position]) {
        maxXs.splice(position, 0, bandTime)
        maxYs.splice(position, 0, bandValue)
      }

      if (!isDefined(minXs[position]) || bandTime < minXs[position]) {
        minXs.splice(position, 0, bandTime)
        minYs.splice(position, 0, bandValue)
      }

      position += 1
    }

    lineData[bandId].xs = bandXs
    lineData[bandId].ys = bandYs
    lineData[maxId].xs = maxXs
    lineData[maxId].ys = maxYs
    lineData[minId].xs = minXs
    lineData[minId].ys = minYs
  }

  return lineData
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
