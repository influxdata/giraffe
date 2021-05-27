import {ColumnData, DomainLabel, LineData} from '../../types'
import {isNumber} from '../isNumber'

export const getDataSortOrder = (
  lineData: LineData,
  rowIndices: number[],
  domainLabel?: DomainLabel
): number[] => {
  if (!lineData || !rowIndices?.length) {
    return []
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

export const sortByValuesColumn = (
  valuesColumn: ColumnData,
  rowIndices: Array<number>
): Array<number> => {
  if (!valuesColumn || !rowIndices?.length) {
    return []
  }
  const numberMap = {}
  const sortable = []
  rowIndices.forEach(rowIndex => {
    const key = isNumber(valuesColumn[`${rowIndex}`])
      ? valuesColumn[`${rowIndex}`]
      : 0
    if (!numberMap[key]) {
      numberMap[key] = []
    }
    numberMap[key].push(rowIndex)
    sortable.push(key)
  })

  sortable.sort((first, second) => second - first)
  return sortable.map(numericalValue => numberMap[numericalValue].shift())
}

export const isSortable = (values: Array<number>): boolean => {
  if (!values || !values.length || values.length == 1) {
    return false
  }
  const initialValue = values[0]
  return values.every((value, index) => {
    if (index === 0) {
      return true
    }
    return value !== initialValue
  })
}

// export const sortBandLines = (
//   bandValues: ColumnData,
//   bandLineMap: BandLineMap,
//   selectedBandLineIndices: Array<number>
// ): BandLineMap => {
//   const sortedBandLineMap: BandLineMap = {
//     upperIndices: [],
//     rowIndices: [],
//     lowerIndices: [],
//   }

//   const {upperIndices, rowIndices, lowerIndices} = bandLineMap

//   if (isSortable(rowIndices.map(rowIndex => bandValues[rowIndex]))) {
//     // const sortedRowIndices = sortByValuesColumn(bandValues, rowIndices)
//   }
//   return sortedBandLineMap
// }
