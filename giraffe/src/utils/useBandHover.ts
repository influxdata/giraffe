import {BandLineMap, LineData, NumericColumnData} from '../types'
import {useLazyMemo} from './useLazyMemo'
import {isDefined} from './isDefined'

const buildColumnData = (
  lineData: LineData,
  groupColData: NumericColumnData,
  bandLineMap: BandLineMap
) => {
  const hoverableColumnData = {
    xs: [],
    ys: [],
    groupColData: [],
  }
  const {rowLines} = bandLineMap

  rowLines.forEach(rowIndex => {
    if (isDefined(rowIndex)) {
      hoverableColumnData.xs = [
        ...hoverableColumnData.xs,
        ...lineData[rowIndex].xs,
      ]
      hoverableColumnData.ys = [
        ...hoverableColumnData.ys,
        ...lineData[rowIndex].ys,
      ]
      hoverableColumnData.groupColData = [
        ...hoverableColumnData.groupColData,
        ...groupColData.filter(index => index === rowIndex),
      ]
    }
  })
  return hoverableColumnData
}

export const useBandHoverColumns = (
  mouseX: number,
  mouseY: number,
  lineData: LineData,
  groupColData: NumericColumnData,
  bandLineMap: BandLineMap,
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
    () => buildColumnData(lineData, groupColData, bandLineMap),
    [lineData, groupColData, bandLineMap, width, height],
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
