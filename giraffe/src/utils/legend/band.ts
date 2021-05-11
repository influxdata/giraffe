import {Table, LegendColumn} from '../../types'
import {RESULT} from '../../constants/columnKeys'
import {isVoid} from '../isVoid'

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
