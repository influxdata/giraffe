import {DomainLabel, LineData, LinePosition} from '../../types'

export const getDataSortOrder = (
  lineData: LineData,
  rowIndices: number[],
  position: LinePosition,
  domainLabel?: DomainLabel
): number[] => {
  if (!position || position === 'overlaid') {
    return rowIndices
  }

  const domainLabelName = domainLabel || DomainLabel.Y

  const dataMap = {}
  const measurementValues = Object.keys(lineData).reduce(
    (accumulator, id) => accumulator.concat(lineData[id][domainLabelName]),
    []
  )
  const sortable = []
  rowIndices.forEach(hoveredRowIndex => {
    if (!dataMap[measurementValues[hoveredRowIndex]]) {
      dataMap[measurementValues[hoveredRowIndex]] = []
    }
    dataMap[measurementValues[hoveredRowIndex]].push(hoveredRowIndex)
    sortable.push(measurementValues[hoveredRowIndex])
  })
  sortable.sort((first, second) => second - first)
  return sortable.map(measurement => dataMap[measurement].shift())
}
