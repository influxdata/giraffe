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

  // break up into itervals while adding to table
  let xMinData = []
  let xMaxData = []
  let fillData = []
  let seriesData = []
  let tableLength = 0

  // find all series in the data set
  let valueStrings = []

  const valueType2 = fillColumnMap.columnKeys[0]

  // so the indices for the lists and the actual input table will be offset
  // first add a new entry in all the lists except xMaxData
  // when a new value is encountered, we can add the time stamp to xMaxData and update the other lists
  const data_map = {}
  // {'cpu0': ['eenie', [], [], [], []]} prevValue, xMin, xMax, values, series
  for (let i = 0; i < inputTable.length; i++) {
    if (yInputCol[i] in data_map) {
      if (
        fillColumnMap.mappings[fillColumn[i]][valueType2] !=
        data_map[yInputCol[i]][0]
      ) {
        data_map[yInputCol[i]][0] =
          fillColumnMap.mappings[fillColumn[i]][valueType2] // prev Value
        data_map[yInputCol[i]][1].push(xInputCol[i]) // xMin
        data_map[yInputCol[i]][2].push(xInputCol[i]) // XMax
        data_map[yInputCol[i]][3].push(
          fillColumnMap.mappings[fillColumn[i]][valueType2]
        ) // value
        data_map[yInputCol[i]][4].push(yInputCol[i]) //series
        tableLength += 1
      }
    } else {
      data_map[yInputCol[i]] = []
      data_map[yInputCol[i]].push(
        fillColumnMap.mappings[fillColumn[i]][valueType2]
      ) // prev Value
      data_map[yInputCol[i]].push([xInputCol[i]]) //xMin
      data_map[yInputCol[i]].push([]) //xMax
      data_map[yInputCol[i]].push([
        fillColumnMap.mappings[fillColumn[i]][valueType2],
      ]) //value
      data_map[yInputCol[i]].push([]) //series
    }
  }
  //close the last interval
  for (const key in data_map) {
    data_map[key][2].push(xInputCol[inputTable.length - 1])
    data_map[key][4].push(key) //series
    xMinData = xMinData.concat(data_map[key][1])
    xMaxData = xMaxData.concat(data_map[key][2])
    fillData = fillData.concat(data_map[key][3])
    seriesData = seriesData.concat(data_map[key][4])
    tableLength += 1
    valueStrings = valueStrings.concat(key)
  }
  /*
    xMin (start time) | xMax (end time) | Value Category | host | cpu
    -------------------------------------------------------------------
        1554308748000  |   1554308758000 |     'eenie'    | "a"  |  1
        1554308748000  |   1554308758000 |       'mo'     | "b"  |  2
  */
  const table = newTable(tableLength)
    .addColumn(X_MIN, 'number', xMinData) //startTimes
    .addColumn(X_MAX, 'number', xMaxData) //endTimes
    .addColumn(FILL, 'string', fillData) //values
    .addColumn(SERIES, 'string', seriesData) //cpus

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
