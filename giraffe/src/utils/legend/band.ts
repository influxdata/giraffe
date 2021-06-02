import {
  Table,
  LegendColumn,
  LineData,
  BandLineMap,
  DomainLabel,
  LatestIndexMap,
} from '../../types'
import {RESULT} from '../../constants/columnKeys'
import {isVoid} from '../isVoid'
import {isNumber} from '../isNumber'

export const getTooltipBandGroupColumns = (
  table: Table,
  rowIndices: number[],
  groupColKeys: string[],
  getValueFormatter: (colKey: string) => (x: any) => string,
  rowColors: string[] | null
): LegendColumn[] => {
  return groupColKeys.reduce((accum, key) => {
    if (key === RESULT) {
      return accum
    }
    const colData = table.getColumn(key)
    const formatter = getValueFormatter(key)

    accum.push({
      key,
      name: table.getColumnName(key),
      type: table.getColumnType(key),
      colors: rowColors,
      values: rowIndices.map(i =>
        !isVoid(colData[i]) ? formatter(colData[i]) : null
      ),
    })
    return accum
  }, [])
}

export const createLatestBandIndices = (
  lineData: LineData,
  bandLineMap: BandLineMap,
  bandDimension: DomainLabel,
  hoveredLines?: LatestIndexMap
): LatestIndexMap => {
  const latestIndices: LatestIndexMap = {}
  const lineDataLastIndices: LatestIndexMap = {}

  let counter = -1
  Object.keys(lineData).forEach(lineNumber => {
    counter += lineData[lineNumber][bandDimension].length
    lineDataLastIndices[lineNumber] = counter
  })
  const {upperLines, rowLines, lowerLines} = bandLineMap

  rowLines.forEach((line, position) => {
    const targetValues = lineData[line][bandDimension]

    let lastIndex = lineDataLastIndices[line]
    let targetBandValue = targetValues[targetValues.length - 1]
    if (hoveredLines) {
      const offset = line === 0 ? 0 : lineDataLastIndices[line - 1] + 1
      lastIndex = hoveredLines[line]
      targetBandValue = targetValues[lastIndex - offset]
    }
    latestIndices[line] = lastIndex

    const upperLine = upperLines[position]
    if (isNumber(upperLine)) {
      const matchingUpperIndex = lineData[upperLine][bandDimension].findIndex(
        value => value === targetBandValue
      )
      if (matchingUpperIndex > -1) {
        const offset =
          upperLine === 0 ? 0 : lineDataLastIndices[upperLine - 1] + 1
        latestIndices[upperLine] = matchingUpperIndex + offset
      }
    }

    const lowerLine = lowerLines[position]
    if (isNumber(lowerLine)) {
      const matchingLowerIndex = lineData[lowerLine][bandDimension].findIndex(
        value => value === targetBandValue
      )
      if (matchingLowerIndex > -1) {
        const offset =
          lowerLine === 0 ? 0 : lineDataLastIndices[lowerLine - 1] + 1
        latestIndices[lowerLine] = matchingLowerIndex + offset
      }
    }
  })
  return latestIndices
}
