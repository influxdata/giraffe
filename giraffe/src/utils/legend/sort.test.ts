import {getDataSortOrder} from './sort'
import {getRandomTable} from '../fixtures/randomTable'
import {lineTransform} from '../../transforms/line'
import {NINETEEN_EIGHTY_FOUR} from '../../constants/colorSchemes'
import {DomainLabel} from '../../types'

describe('getDataSortOrder', () => {
  const xColKey = '_time'
  const yColKey = '_value'
  const maxValue = 100
  const numberOfRecords = 200
  const recordsPerLine = 10
  const fillColKeys = ['cpu', 'host', 'machine']
  const table = getRandomTable(
    maxValue,
    true,
    numberOfRecords,
    recordsPerLine,
    fillColKeys
  )

  it('sorts in in descending order', () => {
    const lineOption = 'stacked'
    const lineSpec = lineTransform(
      table,
      xColKey,
      yColKey,
      fillColKeys,
      NINETEEN_EIGHTY_FOUR,
      lineOption
    )
    const {stackedDomainValueColumn} = lineSpec

    const latestIndices = Object.values(lineSpec.columnGroupMaps.latestIndices)
    const sortOrder = getDataSortOrder(
      lineSpec.lineData,
      latestIndices,
      DomainLabel.Y
    )
    expect(sortOrder.length).toBeGreaterThanOrEqual(2)
    sortOrder.forEach((columnIndex, index) => {
      if (index < sortOrder.length - 1) {
        expect(
          stackedDomainValueColumn[columnIndex] >
            stackedDomainValueColumn[columnIndex + 1]
        )
      } else {
        expect(
          stackedDomainValueColumn[columnIndex] <
            stackedDomainValueColumn[columnIndex + 1]
        )
      }
    })
  })
})
