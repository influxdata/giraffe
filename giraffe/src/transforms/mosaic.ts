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
  const xInputCol = inputTable.getColumn(xColumnKey, 'number')
  const yInputCol = inputTable.getColumn(yColumnKey, 'string')
  const [fillColumn, fillColumnMap] = createGroupIDColumn(
    inputTable,
    fillColKeys
  )
  const valueKey = fillColumnMap.columnKeys[0]

  let tableLength = 0
  /*
    This is the structure used to create and update the data map below:

    dataMap[series] = [
      prevValue: string,
      xMin: NumericColumnData,
      xMax: NumericColumnData,
      values: NumericColumnData,
      series: string[]
    ]
  */
  const dataMap = {}

  for (let i = 0; i < inputTable.length; i++) {
    const isOverlappingTimestamp =
      xInputCol[i - 1] > xInputCol[i] && dataMap[yInputCol[i]]
    if (isOverlappingTimestamp) {
      break
    }
    const seriesExistsInDataMap = yInputCol[i] in dataMap
    if (!seriesExistsInDataMap) {
      //create series entry in dataMap
      dataMap[yInputCol[i]] = [
        fillColumnMap.mappings[fillColumn[i]][valueKey],
        [xInputCol[i]],
        [],
        [fillColumnMap.mappings[fillColumn[i]][valueKey]],
        [],
      ]
      continue
    }
    const valueIntervalEnds =
      fillColumnMap.mappings[fillColumn[i]][valueKey] !=
      dataMap[yInputCol[i]][0]
    if (valueIntervalEnds) {
      //update series entry in dataMap
      dataMap[yInputCol[i]][0] = fillColumnMap.mappings[fillColumn[i]][valueKey]
      dataMap[yInputCol[i]][1].push(xInputCol[i])
      dataMap[yInputCol[i]][2].push(xInputCol[i])
      dataMap[yInputCol[i]][3].push(
        fillColumnMap.mappings[fillColumn[i]][valueKey]
      )
      dataMap[yInputCol[i]][4].push(yInputCol[i])

      tableLength += 1
    }
  }

  let xMinData = []
  let xMaxData = []
  let fillData = []
  let seriesData = []
  let valueStrings = []

  //the last piece of data is a special case of updating a series entry in dataMap (see above)
  for (const key in dataMap) {
    dataMap[key][2].push(xInputCol[inputTable.length - 1])
    dataMap[key][4].push(key)
    tableLength += 1

    //combine all series into the proper shape
    xMinData = xMinData.concat(dataMap[key][1])
    xMaxData = xMaxData.concat(dataMap[key][2])
    fillData = fillData.concat(dataMap[key][3])
    seriesData = seriesData.concat(dataMap[key][4])
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
