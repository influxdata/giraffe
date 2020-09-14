import {range} from 'd3-array'
import {scaleOrdinal} from 'd3-scale'
import {interpolateRgbBasis} from 'd3-interpolate'
import {scaleSequential} from 'd3-scale'

import {
  Table,
  ColumnGroupMap,
  Scale,
  NumericColumnData,
  SymbolType,
  BandIndexMap,
} from '../types'
import {ALL_SYMBOL_TYPES, BAND_COLOR_SCALE_CONSTANT} from '../constants'

export const createGroupIDColumn = (
  table: Table,
  columnKeys: string[]
): [NumericColumnData, ColumnGroupMap] => {
  const groupIDColumn = new Float64Array(table.length)
  const mappings = []
  const groupIDs = {}

  let currentGroupID = 0

  for (let i = 0; i < table.length; i++) {
    const mapping = {}

    for (const k of columnKeys) {
      mapping[k] = table.getColumn(k)[i]
    }

    const hashedGroupValues = Object.values(mapping)
      .sort()
      .join('')

    let groupID = groupIDs[hashedGroupValues]

    if (groupID === undefined) {
      groupID = currentGroupID

      groupIDs[hashedGroupValues] = groupID
      mappings[groupID] = mapping

      currentGroupID++
    }

    groupIDColumn[i] = groupID
  }

  const columnGroupMap: ColumnGroupMap = {mappings, columnKeys}

  return [groupIDColumn, columnGroupMap]
}

export const getNominalColorScale = (
  groupMap: ColumnGroupMap,
  colors: string[]
): Scale<number, string> => {
  const domain = range(groupMap.mappings.length)

  let scaleRange = []

  if (domain.length <= colors.length) {
    scaleRange = colors.slice(0, domain.length)
  } else {
    const interpolator = interpolateRgbBasis(colors)

    scaleRange = range(domain.length).map(k =>
      interpolator(k / (domain.length - 1))
    )
  }

  const scale = scaleOrdinal<number, string>()
    .domain(domain)
    .range(scaleRange)

  return scale
}

export const getContinuousColorScale = (
  domain: [number, number],
  colors: string[]
): Scale<number, string> => {
  const colorScheme = interpolateRgbBasis(colors)
  const scale = scaleSequential(colorScheme).domain(domain)

  return scale
}

export const getSymbolScale = (
  columnGroupMap: ColumnGroupMap
): Scale<number, SymbolType> => {
  const domain = range(columnGroupMap.mappings.length)

  const scale = scaleOrdinal<number, SymbolType>()
    .domain(domain)
    .range(ALL_SYMBOL_TYPES)

  return scale
}

export const getBandColorScale = (
  bandIndexMap: BandIndexMap,
  colors: string[]
): Scale<number, string> => {
  const domain = range(
    bandIndexMap.rowIndices.length * BAND_COLOR_SCALE_CONSTANT
  )

  let scaleRange = []

  if (domain.length <= colors.length) {
    scaleRange = colors.slice(0, domain.length)
  } else {
    const interpolator = interpolateRgbBasis(colors)

    scaleRange = range(domain.length).map(k =>
      interpolator(k / (domain.length - 1))
    )
  }

  const scale = scaleOrdinal<number, string>()
    .domain(domain)
    .range(scaleRange)

  return scale
}
