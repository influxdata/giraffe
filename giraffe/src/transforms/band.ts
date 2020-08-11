import {
  BandLayerSpec,
  Band,
  ColumnGroupMap,
  CumulativeValuesByTime,
  LineData,
  NumericColumnData,
  Table,
  BandIndexMap,
} from '../types'
import {FILL, RESULT, MAX, MIN} from '../constants/columnKeys'
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

  const bands = Array.isArray(mappings)
    ? mappings.reduce((bandLines, map, index) => {
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
    : []

  bands.forEach(line => {
    if (minMaxMap[line.lineName][MIN]) {
      line[MIN] = {...minMaxMap[line.lineName][MIN], fill: line.fill}
    }
    if (minMaxMap[line.lineName][MAX]) {
      line[MAX] = {...minMaxMap[line.lineName][MAX], fill: line.fill}
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

  if (Array.isArray(fillColumnMap.mappings)) {
    fillColumnMap.mappings.forEach((line, index) => {
      if (line[RESULT] === MAX) {
        bandIndices.maxIndices.push(index)
      } else if (line[RESULT] === MIN) {
        bandIndices.minIndices.push(index)
      } else {
        bandIndices.rowIndices.push(index)
      }
    })
  }

  return bandIndices
}

export const getBandLineIndices = (fillColumnMap: ColumnGroupMap): number[] => {
  const bandLineIndices = Array.isArray(fillColumnMap.mappings)
    ? fillColumnMap.mappings.reduce((indices, line, index) => {
        if (line[RESULT] && line[RESULT] !== MAX && line[RESULT] !== MIN) {
          indices.push(index)
        }
        return indices
      }, [])
    : []

  return bandLineIndices as number[]
}

export const getBandName = (fillColumnMap: ColumnGroupMap): string => {
  return Array.isArray(fillColumnMap.mappings)
    ? fillColumnMap.mappings.reduce((name, line) => {
        if (!name && line[RESULT] !== MAX && line[RESULT] !== MIN) {
          name = line[RESULT]
        }
        return name
      }, '')
    : ''
}

export const mapCumulativeValuesToTimeRange = (
  timesCol: NumericColumnData,
  valuesCol: NumericColumnData,
  fillCol: NumericColumnData
): CumulativeValuesByTime => {
  const cumulativeValues: CumulativeValuesByTime = {}

  timesCol.forEach((time, index) => {
    if (!cumulativeValues[time]) {
      cumulativeValues[time] = {}
    }
    const maxGroup = fillCol[index]

    if (!cumulativeValues[time][maxGroup - 1]) {
      for (let i = 0; i < maxGroup; i += 1) {
        if (!cumulativeValues[time][i]) {
          cumulativeValues[time][i] = 0
        }
      }
    }
    cumulativeValues[time][maxGroup] =
      maxGroup - 1 >= 0
        ? cumulativeValues[time][maxGroup - 1] + valuesCol[index]
        : valuesCol[index]
  })
  return cumulativeValues
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

    if (x < xMin) {
      xMin = x
    }

    if (x > xMax) {
      xMax = x
    }

    if (y < yMin) {
      yMin = y
    }

    if (y > yMax) {
      yMax = y
    }
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
