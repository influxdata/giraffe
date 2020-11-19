import {BandIndexMap, LineData, NumericColumnData} from '../types'
import {useLazyMemo} from './useLazyMemo'
import {isDefined} from './isDefined'

const buildColumnData = (
  lineData: LineData,
  groupColData: NumericColumnData,
  bandIndexMap: BandIndexMap
) => {
  const hoverableColumnData = {
    xs: [],
    ys: [],
    groupColData: [],
  }
  const {rowIndices} = bandIndexMap

  rowIndices.forEach(rowIndex => {
    if (isDefined(rowIndex)) {
      hoverableColumnData.xs = [
        ...hoverableColumnData.xs,
        ...lineData[rowIndex].xs,
      ]
      hoverableColumnData.ys = [
        ...hoverableColumnData.ys,
        ...lineData[rowIndex].ys,
      ]
      groupColData
        .filter(index => index === rowIndex)
        .forEach(value => hoverableColumnData.groupColData.push(value))
    }
  })
  return hoverableColumnData
}

export const useBandHoverColumns = (
  mouseX: number,
  mouseY: number,
  lineData: LineData,
  groupColData: NumericColumnData,
  bandIndexMap: BandIndexMap,
  width: number,
  height: number
) => {
  const isActive =
    mouseX !== undefined &&
    mouseX !== null &&
    mouseX >= 0 &&
    mouseX < width &&
    mouseY !== undefined &&
    mouseY !== null &&
    mouseY >= 0 &&
    mouseY < height

  const result = useLazyMemo(
    () => buildColumnData(lineData, groupColData, bandIndexMap),
    [lineData, groupColData, bandIndexMap, width, height],
    isActive
  )

  return !result
    ? {
        xs: [],
        ys: [],
        groupColData: [],
      }
    : result
}
