import {newTable} from '../utils/newTable'
import {MosaicLayerSpec, Table} from '../types'
import {X_MIN, X_MAX, FILL, SERIES} from '../constants/columnKeys'
import {createGroupIDColumn} from './'
import {resolveDomain} from '../utils/resolveDomain'
import {getNominalColorScale} from './'

export const mosaicTransform = (
  inputTable: Table,
  xColumnKey: string,
  yColumnKey: string,
  xDomain: number[],
  fillColKeys: string[],
  colors: string[]
): MosaicLayerSpec => {
  const xInputCol = inputTable.getColumn(xColumnKey, 'number') || []
  const yInputCol = inputTable.getColumn(yColumnKey, 'string') || []
  const [fillColumn, fillColumnMap] = createGroupIDColumn(
    inputTable,
    fillColKeys
  )

  const valueKey = fillColumnMap.columnKeys[0] // _value

  let tableLength = 0
  /*
    This is the structure used to create and update the data map below:

    dataMap[series] = [
      xMin: NumericColumnData,
      xMax: NumericColumnData,
      values: NumericColumnData,
      series: string[]
    ]
  */

  const dataMap = {}
  let prevFillValue = fillColumnMap.mappings[fillColumn[0]][valueKey] // initialize to first value

  for (let i = 0; i < inputTable.length; i++) {
    const currentY = yInputCol[i]
    const currentX = xInputCol[i]
    const currentFillValue = fillColumnMap.mappings[fillColumn[i]][valueKey]

    const YValExistsInDataMap = currentY in dataMap

    const prevX = xInputCol[i - 1]
    const CurrentXColValueIsBackInTime = prevX > currentX // THis is definitely not the correct thing to check for

    const isOverlappingTimestamp =
      YValExistsInDataMap && CurrentXColValueIsBackInTime

    if (isOverlappingTimestamp) {
      continue // ignore this data point
    }

    if (!YValExistsInDataMap) {
      //create series entry in dataMap
      dataMap[currentY] = [[currentX], [], [currentFillValue], []]
      continue
    }

    const valueIntervalEnds = currentFillValue != prevFillValue
    if (valueIntervalEnds) {
      //update series entry in dataMap
      dataMap[currentY][0].push(currentX)
      dataMap[currentY][1].push(currentX)
      dataMap[currentY][2].push(currentFillValue)
      dataMap[currentY][3].push(currentY)
      prevFillValue = currentFillValue

      tableLength += 1
    }
  }

  let xMinData = []
  let xMaxData = []
  let fillData = []
  let seriesData = []
  let valueStrings = []

  // the last value in each series is a special case (see above)
  for (const key in dataMap) {
    dataMap[key][1].push(xInputCol[inputTable.length - 1])
    dataMap[key][3].push(key)
    tableLength += 1

    //combine all series into the proper shape
    xMinData = xMinData.concat(dataMap[key][0])
    xMaxData = xMaxData.concat(dataMap[key][1])
    fillData = fillData.concat(dataMap[key][2])
    seriesData = seriesData.concat(dataMap[key][3])
    valueStrings = valueStrings.concat(key)
  }
  /*
    xMin (start time) | xMax (end time) | Value Category | host | cpu
    -------------------------------------------------------------------
        1554308748000  |   1554308758000 |     'eenie'    | "a"  |  1
        1554308748000  |   1554308758000 |       'mo'     | "b"  |  2
  */
  const table = newTable(tableLength)
    .addColumn(X_MIN, 'system', 'number', xMinData) //startTimes
    .addColumn(X_MAX, 'system', 'number', xMaxData) //endTimes
    .addColumn(FILL, 'string', 'string', fillData) //values
    .addColumn(SERIES, 'string', 'string', seriesData) //cpus (see storybook)

  const resolvedXDomain = resolveDomain(xInputCol, xDomain)
  const resolvedYDomain = [0, valueStrings.length]
  const fillScale = getNominalColorScale(fillColumnMap, colors)

  return {
    type: 'mosaic',
    inputTable,
    table,
    xDomain: resolvedXDomain,
    yDomain: resolvedYDomain,
    xColumnKey,
    yColumnKey,
    xColumnType: inputTable.getColumnType(xColumnKey),
    yColumnType: inputTable.getColumnType(yColumnKey),
    scales: {fill: fillScale},
    columnGroupMaps: {fill: fillColumnMap},
    yTicks: valueStrings,
  }
}
