import {DomainLabel, LineData, Scale, Table} from '../types'
import {simplify} from '../utils/simplify'
import {FILL} from '../constants/columnKeys'

export const collectLineData = (
  table: Table,
  xColKey: string,
  yColKey: string,
  fillScale: Scale<string, string>
): LineData => {
  const xCol = table.getColumn(xColKey, 'number')
  const yCol = table.getColumn(yColKey, 'number')
  const groupCol = table.getColumn(FILL, 'string')

  const result = {}

  for (let i = 0; i < table.length; i++) {
    const groupKey = groupCol[i]

    if (!result[groupKey]) {
      result[groupKey] = {
        xs: [],
        ys: [],
        fill: fillScale(groupKey),
      }
    }

    result[groupKey].xs.push(xCol[i])
    result[groupKey].ys.push(yCol[i])
  }

  return result
}

export const simplifyLineData = (
  lineData: LineData,
  xScale,
  yScale
): LineData => {
  const result = {}

  for (const [k, {xs, ys, fill}] of Object.entries(lineData)) {
    const [simplifedXs, simplifiedYs] = simplify(
      xs.map(x => xScale(x || 0)),
      ys.map(y => yScale(y || 0)),
      0.5
    )

    result[k] = {xs: simplifedXs, ys: simplifiedYs, fill}
  }

  return result
}

export const simplifyBandData = (
  lineData: LineData,
  xScale,
  yScale
): LineData => {
  const result = {}

  for (const [k, {xs, ys, fill}] of Object.entries(lineData)) {
    const simplifedXs = xs.map(x => xScale(x || 0))
    const simplifiedYs = ys.map(y => yScale(y || 0))

    result[k] = {xs: simplifedXs, ys: simplifiedYs, fill}
  }

  return result
}

export const getDomainDataFromLines = (
  lineData: LineData,
  fillCol: Array<number | string>,
  domainLabel: DomainLabel
): Array<number> => {
  if (Array.isArray(fillCol)) {
    const counters = {}
    return fillCol.map(line => {
      if (!counters[line]) {
        counters[line] = 0
      }
      const index = counters[line]
      const value = lineData[line][domainLabel][index]
      counters[line] += 1
      return value
    })
  }
  return []
}
