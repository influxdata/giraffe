import {
  Table,
  LineLayerSpec,
  LineData,
  LinePosition,
  DomainLabel,
} from '../types'
import {FILL} from '../constants/columnKeys'
import {createGroupIDColumn, getNominalColorScale} from './'

export const getPreviousDomainNextValue = (
  lineData: LineData,
  groupID: number,
  domainLabel: DomainLabel
): number => {
  if (!lineData[groupID] || !lineData[groupID - 1]) {
    return 0
  }
  const currentGroupLength = lineData[groupID][domainLabel].length
  const previousGroupLength = lineData[groupID - 1][domainLabel].length
  if (previousGroupLength > currentGroupLength) {
    return lineData[groupID - 1][domainLabel][currentGroupLength]
  }
  return 0
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

  const table = inputTable.addColumn(FILL, 'number', fillColumn)
  const xCol = table.getColumn(xColumnKey, 'number')
  const yCol = table.getColumn(yColumnKey, 'number')
  const fillScale = getNominalColorScale(fillColumnMap, colors)
  const lineData: LineData = {}

  let xMin = Infinity
  let xMax = -Infinity
  let yMin = Infinity
  let yMax = -Infinity

  for (let i = 0; i < table.length; i++) {
    const groupID = fillColumn[i]
    const x = xCol[i]
    let y = yCol[i]

    if (!lineData[groupID]) {
      lineData[groupID] = {xs: [], ys: [], fill: fillScale(groupID)}
    }

    lineData[groupID].xs.push(x)

    if (position === 'stacked') {
      y += getPreviousDomainNextValue(lineData, groupID, DomainLabel.Y)
    }
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
    columnGroupMaps: {fill: fillColumnMap},
  }
}
