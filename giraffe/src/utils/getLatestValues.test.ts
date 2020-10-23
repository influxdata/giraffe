import {getLatestValues} from './getLatestValues'
import {newTable} from '../utils/newTable'

describe('getLatestValues', () => {
  it('gives an empty array when table is empty', () => {
    const table = newTable(0)
    const result = getLatestValues(table)

    expect(Array.isArray(result)).toEqual(true)
    expect(result.length).toEqual(0)
  })

  it('finds the value when timestamp column is missing and only 1 row exists in the table', () => {
    const yColKey = '_value'
    const table = newTable(1).addColumn(yColKey, 'system', 'number', [3.99])
    const result = getLatestValues(table)

    expect(Array.isArray(result)).toEqual(true)
    expect(result[0]).toEqual(3.99)
  })

  it('gives an empty array when timestamp column is missing and there are multiple rows in the table', () => {
    const yColKey = '_value'
    const table = newTable(4).addColumn(yColKey, 'system', 'number', [
      0,
      1.67,
      2.32,
      3.99,
    ])
    const result = getLatestValues(table)

    expect(Array.isArray(result)).toEqual(true)
    expect(result.length).toEqual(0)
  })

  it('finds the correct value even when timestamp column is not ordered', () => {
    const xColKey = '_time'
    const yColKey = '_value'
    const startTime = Date.now()
    const interval = 100
    const table = newTable(4)
      .addColumn(xColKey, 'dateTime:RFC3339', 'time', [
        startTime + interval * 4,
        startTime - interval,
        startTime + interval * 5,
        startTime + interval * 2,
      ])
      .addColumn(yColKey, 'system', 'number', [0, 1.67, 2.32, 3.97])
    const result = getLatestValues(table)

    expect(Array.isArray(result)).toEqual(true)
    expect(result[0]).toEqual(2.32)
  })

  it('finds the value associated with the most recent timestamp', () => {
    const xColKey = '_time'
    const yColKey = '_value'
    const startTime = Date.now()
    const interval = 100
    const table = newTable(3)
      .addColumn(xColKey, 'dateTime:RFC3339', 'time', [
        startTime,
        startTime + interval,
        startTime + interval * 2,
      ])
      .addColumn(yColKey, 'system', 'number', [0, 4.67, 2.32])
    const result = getLatestValues(table)

    expect(Array.isArray(result)).toEqual(true)
    expect(result[0]).toEqual(2.32)
  })

  it('ignores columns with invalid types', () => {
    const xColKey = '_time'
    const yColKey = '_value'
    const startTime = Date.now()
    const interval = 100
    const table = newTable(3)
      .addColumn(xColKey, 'dateTime:RFC3339', 'time', [
        startTime,
        startTime + interval,
        startTime + interval * 2,
      ])
      .addColumn(yColKey, 'system', 'number', [2.32, 4.67, 0.01])
      .addColumn('didItWork', 'boolean', 'boolean', [true, false, true])
    const result = getLatestValues(table)

    expect(Array.isArray(result)).toEqual(true)
    expect(result[0]).toEqual(0.01)
  })
})
