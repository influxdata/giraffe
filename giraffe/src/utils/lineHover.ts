import {ColumnGroupMap, LineLayerSpec, LinePosition, Scale} from '../types'

import {FILL} from '../constants/columnKeys'

export const getLineHoverPoints = (
  position: LinePosition,
  spec: LineLayerSpec,
  hoverRowIndices: number[],
  xColKey: string,
  yColKey: string,
  xScale: Scale<number, number>,
  yScale: Scale<number, number>,
  fillScale: Scale<number, string>,
  colorMapping?: ColumnGroupMap
): Array<{x: number; y: number; fill: string}> => {
  const {table} = spec
  const xColData = table.getColumn(xColKey, 'number')
  const yColData =
    position === 'stacked'
      ? spec.stackedDomainValueColumn
      : table.getColumn(yColKey, 'number')
  const groupColData = table.getColumn(FILL, 'number')

  return hoverRowIndices.map(i => ({
    x: xScale(xColData[i]),
    y: yScale(yColData[i]),
    fill: colorMapping
      ? colorMapping.mappings[groupColData[i]].color
      : fillScale(groupColData[i]),
  }))
}
