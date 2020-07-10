import {newTable} from '../utils/newTable'
import {MosaicLayerSpec, Table} from '../types'
import {X_MIN, X_MAX, FILL, SYMBOL, SERIES} from '../constants/columnKeys'
import {createGroupIDColumn} from './'
import {resolveDomain} from '../utils/resolveDomain'
import {getNominalColorScale} from './'

export const mosaicTransform = (
  inputTable: Table,
  xColumnKey: string,
  yColumnKey: string,
  xDomain: number[],
  fillColKeys: string[],
  symbolColKeys: string[],
  colors: string[]
): MosaicLayerSpec => {
  const [fillColumn, fillColumnMap] = createGroupIDColumn(
    inputTable,
    fillColKeys
  )

  const [symbolColumn, symbolColumnMap] = createGroupIDColumn(
    inputTable,
    symbolColKeys
  )

  // break up into itervals while adding to table
  const xMinData = []
  const xMaxData = []
  const fillData = []
  const seriesData = []
  const symbolData = []
  let prevValue = ''
  let tableLength = 0
  let prevSeries = inputTable.getColumn(yColumnKey, 'string')[0]

  // find all series in the data set
  const valueStrings = [inputTable.getColumn(yColumnKey, 'string')[0]]

  const valueType1 = symbolColumnMap.columnKeys[0]
  const valueType2 = fillColumnMap.columnKeys[0]

  // so the indices for the lists and the actual input table will be offset
  // first add a new entry in all the lists except xMaxData
  // when a new value is encountered, we can add the time stamp to xMaxData and update the other lists
  xMinData.push(inputTable.getColumn(xColumnKey, 'number')[0])
  fillData.push(fillColumnMap.mappings[fillColumn[0]][valueType2])
  seriesData.push(inputTable.getColumn(yColumnKey, 'string')[0])
  symbolData.push(symbolColumnMap.mappings[symbolColumn[0]][valueType1])
  prevValue = fillColumnMap.mappings[fillColumn[0]][valueType2]

  for (let i = 1; i < inputTable.length; i++) {
    // check if the value has changed or if you've reached the end of the table
    // if so, add a new value to all the lists
    if (inputTable.getColumn(yColumnKey, 'string')[i] != prevSeries) {
      xMaxData.push(inputTable.getColumn(xColumnKey, 'number')[i - 1])
      xMinData.push(inputTable.getColumn(xColumnKey, 'number')[i])
      fillData.push(fillColumnMap.mappings[fillColumn[i]][valueType2])
      seriesData.push(inputTable.getColumn(yColumnKey, 'string')[i])
      symbolData.push(symbolColumnMap.mappings[symbolColumn[i]][valueType1])
      prevSeries = inputTable.getColumn(yColumnKey, 'string')[i]
      tableLength += 1
    } else if (fillColumnMap.mappings[fillColumn[i]][valueType2] != prevValue) {
      xMaxData.push(inputTable.getColumn(xColumnKey, 'number')[i])
      xMinData.push(inputTable.getColumn(xColumnKey, 'number')[i])
      fillData.push(fillColumnMap.mappings[fillColumn[i]][valueType2])
      seriesData.push(inputTable.getColumn(yColumnKey, 'string')[i])
      symbolData.push(symbolColumnMap.mappings[symbolColumn[i]][valueType1])
      tableLength += 1
    }
    // if a series isn't already in valueStrings, add it
    if (!valueStrings.includes(inputTable.getColumn(yColumnKey, 'string')[i]))
      valueStrings.push(inputTable.getColumn(yColumnKey, 'string')[i])
    prevValue = fillColumnMap.mappings[fillColumn[i]][valueType2]
  }
  //close the last interval
  xMaxData.push(
    inputTable.getColumn(xColumnKey, 'number')[inputTable.length - 1]
  )
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
    .addColumn(SYMBOL, 'string', symbolData) //hosts

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
