import {ColumnData, Formatter} from '../../types'

export const formatLegendValues = (
  values: ColumnData,
  indexes: Array<number>,
  formatter: Formatter
): Array<string> => {
  if (!Array.isArray(indexes)) {
    return []
  }
  return indexes.map(index => {
    const latestValue = values[index]
    if (latestValue === latestValue) {
      return formatter(latestValue)
    }
    return ''
  })
}
