import {DomainLabel} from '../types'
import {getDomainDataFromLines} from './lineData'
import {lineTransform} from '../transforms/line'

import {largeTable, lineData} from './fixtures/line'

describe('line graph performance', () => {
  test('getDomainDataFromLines for 1,000,000 data points', () => {
    expect(() => {
      const result = getDomainDataFromLines(lineData, DomainLabel.Y)
      expect(result.length).toEqual(1_000_000)
    }).not.toThrow()
  })

  test('line transform a table with 1,000,000 data points', () => {
    expect(() => {
      const result = lineTransform(
        largeTable,
        '_time',
        '_value',
        ['cpu'],
        ['#31C0F6', '#A500A5', '#FF7E27'],
        'stacked'
      )
      expect(result.table.length).toEqual(1_000_000)
      expect(Array.isArray(result.stackedDomainValueColumn)).toEqual(true)
      expect(result.stackedDomainValueColumn.length).toEqual(1_000_000)
    }).not.toThrow()
  })
})
