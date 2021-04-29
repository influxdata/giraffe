import {
  CumulativeValuesByTime,
  DomainLabel,
  LatestIndexMap,
  LineData,
  LineLayerSpec,
  LinePosition,
  NumericColumnData,
  Table,
} from '../types'
import {FILL, TIME, VALUE} from '../constants/columnKeys'
import {createGroupIDColumn, getNominalColorScale} from './'
import {getDomainDataFromLines} from '../utils/lineData'
import {isDefined} from '../utils/isDefined'

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

const getCumulativeValueAtTime = (
  cumulativeValues: CumulativeValuesByTime,
  time: number,
  groupID: number
): number => {
  if (
    !cumulativeValues ||
    !cumulativeValues[time] ||
    !cumulativeValues[time][groupID]
  ) {
    return 0
  }
  return cumulativeValues[time][groupID]
}

export const lineTransform = (
  inputTable: Table,
  xColumnKey: string,
  yColumnKey: string,
  fillColKeys: string[],
  colors: string[],
  position: LinePosition
): LineLayerSpec => {
  const [fillColumn, fillColumnMap] = createGroupIDColumn(
    inputTable,
    fillColKeys
  )

  const table = inputTable.addColumn(FILL, 'system', 'number', fillColumn)
  const xCol = table.getColumn(xColumnKey, 'number')
  const yCol = table.getColumn(yColumnKey, 'number')
  const fillScale = getNominalColorScale(fillColumnMap, colors)
  const lineData: LineData = {}
  let stackedValuesByTime: CumulativeValuesByTime = {}
  const latestIndices: LatestIndexMap = {}

  if (position === 'stacked') {
    if (yColumnKey === VALUE) {
      stackedValuesByTime = mapCumulativeValuesToTimeRange(
        xCol,
        yCol,
        fillColumn
      )
    } else if (xColumnKey === VALUE) {
      stackedValuesByTime = mapCumulativeValuesToTimeRange(
        yCol,
        xCol,
        fillColumn
      )
    }
  }

  let xMin = Infinity
  let xMax = -Infinity
  let yMin = Infinity
  let yMax = -Infinity

  for (let i = 0; i < table.length; i++) {
    const groupID = fillColumn[i]
    let x = xCol[i]
    let y = yCol[i]

    if (!lineData[groupID]) {
      lineData[groupID] = {xs: [], ys: [], fill: fillScale(groupID)}
    }

    if (position === 'stacked') {
      if (yColumnKey === VALUE) {
        y = getCumulativeValueAtTime(stackedValuesByTime, xCol[i], groupID)
      } else if (xColumnKey === VALUE) {
        x = getCumulativeValueAtTime(stackedValuesByTime, yCol[i], groupID)
      }
    }
    lineData[groupID].xs.push(x)
    lineData[groupID].ys.push(y)

    if (!isDefined(latestIndices[groupID])) {
      latestIndices[groupID] = i
    } else if (yColumnKey === TIME) {
      if (y > yCol[latestIndices[groupID]]) {
        latestIndices[groupID] = i
      }
    } else if (x > xCol[latestIndices[groupID]]) {
      latestIndices[groupID] = i
    }

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

  let stackedDomainValueColumn: NumericColumnData
  if (position === 'stacked') {
    stackedDomainValueColumn = getDomainDataFromLines(
      lineData,
      yColumnKey === VALUE ? DomainLabel.Y : DomainLabel.X
    )
  }

  return {
    type: 'line',
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
    columnGroupMaps: {fill: fillColumnMap, latestIndices},
    stackedDomainValueColumn,
  }
}
