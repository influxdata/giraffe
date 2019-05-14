import {TooltipColumn, Table} from '../types'

const isVoid = (x: any) => x === null || x === undefined

export const getRangeLabel = (min: number, max: number, formatter): string => {
  let label = ''

  if (isVoid(min) || isVoid(max)) {
    label = ''
  } else if (min === max) {
    label = formatter(min)
  } else {
    label = `${formatter(min)} – ${formatter(max)}`
  }

  return label
}

export const getTooltipGroupColumns = (
  table: Table,
  rowIndices: number[],
  groupColKeys: string[],
  getValueFormatter: (colKey: string) => (x: any) => string,
  rowColors: string[] | null
): TooltipColumn[] =>
  groupColKeys.map(key => {
    const {name, type, data} = table.columns[key]
    const formatter = getValueFormatter(key)

    return {
      key,
      name,
      type,
      colors: rowColors,
      values: rowIndices.map(i => formatter(data[i])),
    }
  })
