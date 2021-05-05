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

export const getDomainDataFromLines = (
  lineData: LineData,
  domainLabel: DomainLabel
): number[] => {
  const result = []
  const numberOfLines = Object.keys(lineData).length
  for (let lineIndex = 0; lineIndex < numberOfLines; lineIndex += 1) {
    const line = lineData[lineIndex] ? lineData[lineIndex][domainLabel] : []
    if (Array.isArray(line)) {
      for (let domainIndex = 0; domainIndex < line.length; domainIndex += 1) {
        result.push(line[domainIndex])
      }
    }
  }
  return result
}
