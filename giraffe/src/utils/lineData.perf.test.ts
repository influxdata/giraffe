import {DomainLabel} from '../types'
import {getDomainDataFromLines} from './lineData'
import {lineTransform} from '../transforms/line'

import {dataSize, largeTable, lineData} from './fixtures/line'

// A number representing the limit on the number of points
//   in a data set that most, if not all users, could possibly want
//   to see in a line graph
const REASONABLE_LIMIT = 5_000_000

describe('line graph performance', () => {
  it('fixture should be greater than or equal to REASONABLE_LIMIT', () => {
    expect(dataSize).toBeGreaterThanOrEqual(REASONABLE_LIMIT)
  })

  test(`getDomainDataFromLines on ${REASONABLE_LIMIT} data points`, () => {
    expect(() => {
      const result = getDomainDataFromLines(lineData, DomainLabel.Y)
      expect(result.length).toBeGreaterThanOrEqual(REASONABLE_LIMIT)
    }).not.toThrow()
  })

  test(`line transform a table with ${REASONABLE_LIMIT} data points`, () => {
    expect(() => {
      const result = lineTransform(
        largeTable,
        '_time',
        '_value',
        ['cpu'],
        ['#31C0F6', '#A500A5', '#FF7E27'],
        'stacked'
      )
      expect(result.table.length).toBeGreaterThanOrEqual(REASONABLE_LIMIT)
      expect(Array.isArray(result.stackedDomainValueColumn)).toEqual(true)
      expect(result.stackedDomainValueColumn.length).toBeGreaterThanOrEqual(
        REASONABLE_LIMIT
      )
    }).not.toThrow()
  })
})
