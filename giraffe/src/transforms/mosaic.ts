import {newTable} from '../utils/newTable'
import {MosaicLayerSpec, Table} from '../types'
import {DISPLAY_NAME, FILL, SERIES, X_MAX, X_MIN} from '../constants/columnKeys'
import {createGroupIDColumn} from './'
import {resolveDomain} from '../utils/resolveDomain'
import {getNominalColorScale} from './'

export const mosaicTransform = (
  inputTable: Table,
  xColumnKey: string,
  yColumnKeys: string[],
  yLabelColumns: string[],
  yLabelColumnSeparator: string,
  xDomain: number[],
  fillColKeys: string[],
  colors: string[]
): MosaicLayerSpec => {
  const [fillColumn, fillColumnMap] = createGroupIDColumn(
    inputTable,
    fillColKeys
  )
  const xInputCol = inputTable.getColumn(xColumnKey, 'number') || []

  let labelColumns = Array.isArray(yLabelColumns)
    ? yLabelColumns.filter(labelColumn => yColumnKeys.includes(labelColumn))
    : []
  if (labelColumns.length === 0 && Array.isArray(yColumnKeys)) {
    labelColumns = yColumnKeys
  }

  const yInputCols = {}
  if (Array.isArray(yColumnKeys)) {
    yColumnKeys.forEach(columnKey => {
      const column = inputTable.getColumn(columnKey, 'string')
      yInputCols[columnKey] = column
    })
  }

  // Mosaic can only have one column as the fill value,
  //   always the first fill column key
  const valueKey = fillColumnMap.columnKeys[0]

  const timeStampMap = {}

  for (let i = 0; i < inputTable.length; i++) {
    const yColumnTick = Array.isArray(yColumnKeys)
      ? yColumnKeys.reduce((combinedValue, key) => {
          let value = ''
          if (yInputCols[key]) {
            value = yInputCols[key][i]
          }
          return combinedValue + value
        }, '')
      : ''

    const yTickLabel = labelColumns.reduce((combinedValue, key) => {
      let value = ''
      if (yInputCols[key]) {
        value = yInputCols[key][i]
      }
      return combinedValue
        ? `${combinedValue}${yLabelColumnSeparator}${value}`
        : value
    }, '')

    const currentX = xInputCol[i]
    const currentFillValue = fillColumnMap.mappings[fillColumn[i]][valueKey]

    if (!timeStampMap[currentX]) {
      timeStampMap[currentX] = []
    }
    timeStampMap[currentX].push({
      yTickLabel,
      yColumnTick,
      fill: currentFillValue,
    })
  }

  const sortedTimeStamps = Object.keys(timeStampMap).sort()
  let tableLength = 0

  /*
    This is the structure used to create and update the data map below:

    dataMap[series] = {
      xMin: NumericColumnData,
      xMax: NumericColumnData,
      fill: NumericColumnData,
      series: string[],
      displayedColumns: string[],
      yTickLabel: string,
    }
  */
  const dataMap = {}

  sortedTimeStamps.forEach(timeStamp => {
    timeStampMap[timeStamp].forEach(data => {
      if (!dataMap[data.yColumnTick]) {
        dataMap[data.yColumnTick] = {
          xMin: [Number(timeStamp)],
          xMax: [Number(timeStamp)],
          fill: [data.fill],
          series: [data.yColumnTick],
          displayedColumns: [data.yTickLabel],
          yTickLabel: data.yTickLabel,
        }
        tableLength += 1
      } else {
        const prevMaxIndex = dataMap[data.yColumnTick].xMax.length - 1
        const prevFill =
          dataMap[data.yColumnTick].fill[
            dataMap[data.yColumnTick].fill.length - 1
          ]

        dataMap[data.yColumnTick].xMax[prevMaxIndex] = Number(timeStamp)
        if (prevFill !== data.fill) {
          dataMap[data.yColumnTick].xMin.push(Number(timeStamp))
          dataMap[data.yColumnTick].xMax.push(Number(timeStamp))
          dataMap[data.yColumnTick].fill.push(data.fill)
          dataMap[data.yColumnTick].series.push(data.yColumnTick)
          dataMap[data.yColumnTick].displayedColumns.push(data.yTickLabel)
          tableLength += 1
        }
      }
    })
  })

  let xMinData = []
  let xMaxData = []
  let fillData = []
  let seriesData = []
  let displayedColumnsData = []
  const yTicks = []
  const ySeries = []

  for (const key in dataMap) {
    //combine all series into the proper shape
    xMinData = xMinData.concat(dataMap[key].xMin)
    xMaxData = xMaxData.concat(dataMap[key].xMax)
    fillData = fillData.concat(dataMap[key].fill)
    seriesData = seriesData.concat(dataMap[key].series)
    displayedColumnsData = displayedColumnsData.concat(
      dataMap[key].displayedColumns
    )
    ySeries.push(key)
    yTicks.push(dataMap[key].yTickLabel)
  }
  /*
    xMin (start time) | xMax (end time) | Value Category | host | cpu
    -------------------------------------------------------------------
        1554308748000  |   1554308758000 |     'eenie'    | "a"  |  1
        1554308748000  |   1554308758000 |       'mo'     | "b"  |  2
  */
  // const table = newTable(tableLength)
  const table = newTable(tableLength)
    .addColumn(X_MIN, 'system', 'number', xMinData)
    .addColumn(X_MAX, 'system', 'number', xMaxData)
    .addColumn(FILL, 'string', 'string', fillData)
    .addColumn(SERIES, 'string', 'string', seriesData)
    .addColumn(DISPLAY_NAME, 'string', 'string', displayedColumnsData)

  const resolvedXDomain = resolveDomain(xInputCol, xDomain)
  const resolvedYDomain = [0, yTicks.length]
  const fillScale = getNominalColorScale(fillColumnMap, colors)

  return {
    type: 'mosaic',
    inputTable,
    table,
    xDomain: resolvedXDomain,
    xColumnKey,
    xColumnType: inputTable.getColumnType(xColumnKey),
    yDomain: resolvedYDomain,
    yColumnType: 'string',
    ySeries,
    yTicks,
    scales: {fill: fillScale},
    columnGroupMaps: {fill: fillColumnMap},
  }
}
