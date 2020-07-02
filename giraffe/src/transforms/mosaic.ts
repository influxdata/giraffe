import {newTable} from '../utils/newTable'
import {MosaicLayerSpec, Table} from '../types'
import {FILL, X_MIN, X_MAX, VALUE, SYMBOL} from '../constants/columnKeys'
import {createGroupIDColumn} from './'
import {resolveDomain} from '../utils/resolveDomain'
import {getNominalColorScale} from './'

export const mosaicTransform = (
  inputTable: Table,
  xColumnKey: string,
  xDomain: number[],
  colors: string[],
  fillColKeys: string[]
): MosaicLayerSpec => {
  const resolvedXDomain = resolveDomain(
    inputTable.getColumn(xColumnKey, 'number'),
    xDomain
  )

  const [, fillColumnMap] = createGroupIDColumn(inputTable, fillColKeys)

  // break up into itervals while adding to table
  const startTimes = []
  const endTimes = []
  const values = []
  const cpus = []
  const hosts = []
  let prevValue = ''
  let tableLength = 0
  let prevSeries = inputTable.getColumn('cpu', 'string')[0]

  // find all series in the data set
  const yCol = [inputTable.getColumn('cpu', 'string')[0]]

  // so the indices for the lists and the actual input table will be offset
  // first add a new entry in all the lists except endTimes
  // when a new value is encountered, we can add the time stamp to endTimes and update the other lists
  startTimes.push(inputTable.getColumn('_time', 'time')[0])
  values.push(inputTable.getColumn('_value', 'string')[0])
  cpus.push(inputTable.getColumn('cpu', 'string')[0])
  hosts.push(inputTable.getColumn('host', 'string')[0])
  prevValue = inputTable.getColumn('_value', 'string')[0]

  for (let i = 1; i < inputTable.length; i++) {
    // check if we have moved to a new series, and update the end time for the previous series correctly
    if (inputTable.getColumn('cpu', 'string')[i] != prevSeries) {
      endTimes.push(inputTable.getColumn('_time', 'time')[i - 1])
      startTimes.push(inputTable.getColumn('_time', 'time')[i])
      values.push(inputTable.getColumn('_value', 'string')[i])
      cpus.push(inputTable.getColumn('cpu', 'string')[i])
      hosts.push(inputTable.getColumn('host', 'string')[i])
      prevSeries = inputTable.getColumn('cpu', 'string')[i]
      tableLength += 1
    } else if (inputTable.getColumn('_value', 'string')[i] != prevValue) {
      // check if the value has changed or if you've reached the end of the table
      // if so, add a new value to all the lists
      endTimes.push(inputTable.getColumn('_time', 'time')[i])
      startTimes.push(inputTable.getColumn('_time', 'time')[i])
      values.push(inputTable.getColumn('_value', 'string')[i])
      cpus.push(inputTable.getColumn('cpu', 'string')[i])
      hosts.push(inputTable.getColumn('host', 'string')[i])
      tableLength += 1
    }
    // if a series isn't already in yCol, add it
    if (!yCol.includes(inputTable.getColumn('cpu', 'string')[i]))
      yCol.push(inputTable.getColumn('cpu', 'string')[i])
    prevValue = inputTable.getColumn('_value', 'string')[i]
  }
  //close the last interval
  endTimes.push(inputTable.getColumn('_time', 'time')[inputTable.length - 1])
  tableLength += 1

  /*
    xMin (start time) | xMax (end time) | Value Category | host | cpu
    -------------------------------------------------------------------
        1554308748000  |   1554308758000 |     'eenie'    | "a"  |  1
        1554308748000  |   1554308758000 |       'mo'     | "b"  |  2
  */

  const table = newTable(tableLength)
    .addColumn(X_MIN, 'number', startTimes)
    .addColumn(X_MAX, 'number', endTimes)
    .addColumn(VALUE, 'string', values)
    .addColumn(FILL, 'string', cpus)
    .addColumn(SYMBOL, 'string', hosts)

  const resolvedYDomain = [0, yCol.length]

  const fillScale = getNominalColorScale(fillColumnMap, colors)

  return {
    type: 'mosaic',
    inputTable,
    table,
    xDomain: resolvedXDomain,
    yDomain: resolvedYDomain,
    xColumnKey,
    yColumnKey: VALUE,
    xColumnType: inputTable.getColumnType(xColumnKey),
    yColumnType: 'string',
    scales: {fill: fillScale},
    columnGroupMaps: {fill: fillColumnMap},
  }
}
//TODO: fix hard-coding
