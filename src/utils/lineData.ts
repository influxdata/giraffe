import {Table, Scale} from '../types'
import {getGroupColumn} from '../utils/getGroupColumn'
import {simplify} from '../utils/simplify'

export type LineData = Array<{
  xs: number[] | Float64Array
  ys: number[] | Float64Array
  fill: string
}>

export const collectLineData = (
  table: Table,
  xColKey: string,
  yColKey: string,
  fillScale: Scale<string, string>
): LineData => {
  const xCol = table.columns[xColKey].data
  const yCol = table.columns[yColKey].data
  const {data: groupCol} = getGroupColumn(table)

  const resultByGroupKey = {}

  for (let i = 0; i < table.length; i++) {
    const groupKey = groupCol[i]

    if (!resultByGroupKey[groupKey]) {
      resultByGroupKey[groupKey] = {
        xs: [],
        ys: [],
        fill: fillScale(groupKey),
      }
    }

    resultByGroupKey[groupKey].xs.push(xCol[i])
    resultByGroupKey[groupKey].ys.push(yCol[i])
  }

  return Object.values(resultByGroupKey)
}

export const simplifyLineData = (
  lineData: LineData,
  xScale,
  yScale
): LineData =>
  lineData.map(({xs: initialXs, ys: initialYs, fill}) => {
    const [xs, ys] = simplify(
      initialXs.map(x => xScale(x)),
      initialYs.map(y => yScale(y)),
      1
    )

    return {xs, ys, fill}
  })
