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
  const [fillColumn, fillColumnMap] = createGroupIDColumn(
    inputTable,
    fillColKeys
  )

  const xInputCol = inputTable.getColumn(xColumnKey, 'number')
  const yInputCol = inputTable.getColumn(yColumnKey, 'string')

  // break up into itervals while adding to table
  const xMinData = []
  const xMaxData = []
  const fillData = []
  const seriesData = []
  let prevValue = ''
  let tableLength = 0
  let prevSeries = yInputCol[0]

  // find all series in the data set
  const valueStrings = [yInputCol[0]]

  const valueType2 = fillColumnMap.columnKeys[0]

  // so the indices for the lists and the actual input table will be offset
  // first add a new entry in all the lists except xMaxData
  // when a new value is encountered, we can add the time stamp to xMaxData and update the other lists
  xMinData.push(xInputCol[0])
  fillData.push(fillColumnMap.mappings[fillColumn[0]][valueType2])
  seriesData.push(yInputCol[0])
  prevValue = fillColumnMap.mappings[fillColumn[0]][valueType2]

  for (let i = 1; i < inputTable.length; i++) {
    // if there is overlapping data, stop collecting data
    if (
      xInputCol[i - 1] > xInputCol[i] &&
      valueStrings.includes(yInputCol[i])
    ) {
      break
    }
    // check if the value has changed or if you've reached the end of the table
    // if so, add a new value to all the lists
    if (yInputCol[i] != prevSeries) {
      xMaxData.push(xInputCol[i - 1])
      xMinData.push(xInputCol[i])
      fillData.push(fillColumnMap.mappings[fillColumn[i]][valueType2])
      seriesData.push(yInputCol[i])
      prevSeries = yInputCol[i]
      tableLength += 1
    } else if (fillColumnMap.mappings[fillColumn[i]][valueType2] != prevValue) {
      xMaxData.push(xInputCol[i])
      xMinData.push(xInputCol[i])
      fillData.push(fillColumnMap.mappings[fillColumn[i]][valueType2])
      seriesData.push(yInputCol[i])
      tableLength += 1
    }
    // if a series isn't already in valueStrings, add it
    if (!valueStrings.includes(yInputCol[i])) valueStrings.push(yInputCol[i])
    prevValue = fillColumnMap.mappings[fillColumn[i]][valueType2]
  }
  //close the last interval
  xMaxData.push(xInputCol[inputTable.length - 1])
  tableLength += 1

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

  const resolvedXDomain = resolveDomain(
    inputTable.getColumn(xColumnKey, 'number'),
    xDomain
  )

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
