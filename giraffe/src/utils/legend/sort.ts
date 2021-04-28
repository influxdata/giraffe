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

  const numberMap = {}
  const numericalValues = Object.keys(lineData).reduce(
    (combinedNumericalValues, id) =>
      combinedNumericalValues.concat(lineData[id][domainLabelName]),
    []
  )
  const sortable = []
  rowIndices.forEach(rowIndex => {
    if (!numberMap[numericalValues[rowIndex]]) {
      numberMap[numericalValues[rowIndex]] = []
    }
    numberMap[numericalValues[rowIndex]].push(rowIndex)
    sortable.push(numericalValues[rowIndex])
  })
  sortable.sort((first, second) => second - first)
  return sortable.map(numericalValue => numberMap[numericalValue].shift())
}
