import {getLatestValues} from './getLatestValues'
import {newTable} from '../utils/newTable'

describe('getLatestValues', () => {
  test('gives an empty array when table is empty', () => {
    const table = newTable(0)
    const result = getLatestValues(table)

    expect(Array.isArray(result)).toEqual(true)
    expect(result.length).toEqual(0)
  })

  test('finds the value when timestamp column is missing and only 1 row exists in the table', () => {
    const yColKey = '_value'
    const table = newTable(1).addColumn(yColKey, 'number', [3.99])
    const result = getLatestValues(table)

    expect(Array.isArray(result)).toEqual(true)
    expect(result[0]).toEqual(3.99)
  })

  test('gives an empty array when timestamp column is missing and there are multiple rows in the table', () => {
    const yColKey = '_value'
    const table = newTable(4).addColumn(yColKey, 'number', [
      0,
      1.67,
      2.32,
      3.99,
    ])
    const result = getLatestValues(table)

    expect(Array.isArray(result)).toEqual(true)
    expect(result.length).toEqual(0)
  })

  test('finds the correct value even when timestamp column is not ordered', () => {
    const xColKey = '_time'
    const yColKey = '_value'
    const startTime = Date.now()
    const interval = 100
    const table = newTable(4)
      .addColumn(xColKey, 'time', [
        startTime + interval * 4,
        startTime - interval,
        startTime + interval * 5,
        startTime + interval * 2,
      ])
      .addColumn(yColKey, 'number', [0, 1.67, 2.32, 3.97])
    const result = getLatestValues(table)

    expect(Array.isArray(result)).toEqual(true)
    expect(result[0]).toEqual(2.32)
  })

  test('finds the value associated with the most recent timestamp', () => {
    const xColKey = '_time'
    const yColKey = '_value'
    const startTime = Date.now()
    const interval = 100
    const table = newTable(3)
      .addColumn(xColKey, 'time', [
        startTime,
        startTime + interval,
        startTime + interval * 2,
      ])
      .addColumn(yColKey, 'number', [0, 1.67, 2.32])
    const result = getLatestValues(table)

    expect(Array.isArray(result)).toEqual(true)
    expect(result[0]).toEqual(2.32)
  })
})
