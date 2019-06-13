import {extent} from 'd3-array'

import {bin} from './histogram'
import {newTable} from '../utils/newTable'
import {X_MIN, X_MAX, Y_MIN, Y_MAX, COUNT, FILL} from '../constants/columnKeys'

const valueData = [70, 56, 60, 100, 76, 0, 63, 48, 79, 67]

describe('bin', () => {
  test('with a single group', () => {
    const table = newTable(10)
      .addColumn('_value', 'number', valueData)
      .addColumn(FILL, 'number', [0, 0, 0, 0, 0, 0, 0, 0, 0, 0])

    const actual = bin(table, '_value', extent(valueData), 5, 'stacked')

    expect(actual.length).toEqual(5)
    expect(actual.getColumn(X_MIN, 'number')).toEqual([0, 20, 40, 60, 80])
    expect(actual.getColumn(X_MAX, 'number')).toEqual([20, 40, 60, 80, 100])
    expect(actual.getColumn(Y_MIN, 'number')).toEqual([0, 0, 0, 0, 0])
    expect(actual.getColumn(Y_MAX, 'number')).toEqual([1, 0, 2, 6, 1])
    expect(actual.getColumn(COUNT, 'number')).toEqual([1, 0, 2, 6, 1])
  })

  test('with four groups', () => {
    const table = newTable(10)
      .addColumn('_value', 'number', valueData)
      .addColumn(FILL, 'number', [0, 0, 0, 1, 1, 2, 2, 2, 3, 3])

    const actual = bin(table, '_value', extent(valueData), 5, 'stacked')

    // prettier-ignore
    expect(actual.getColumn(X_MIN, 'number')).toEqual([
      0, 20, 40, 60, 80,
      0, 20, 40, 60, 80,
      0, 20, 40, 60, 80,
      0, 20, 40, 60, 80,
    ])

    // prettier-ignore
    expect(actual.getColumn(X_MAX, 'number')).toEqual([
      20, 40, 60, 80, 100,
      20, 40, 60, 80, 100,
      20, 40, 60, 80, 100,
      20, 40, 60, 80, 100,
    ])

    // prettier-ignore
    expect(actual.getColumn(Y_MIN, 'number')).toEqual([
      0, 0, 0, 0, 0,
      0, 0, 1, 2, 0,
      0, 0, 1, 3, 1,
      1, 0, 2, 4, 1
    ])

    // prettier-ignore
    expect(actual.getColumn(Y_MAX, 'number')).toEqual([
      0, 0, 1, 2, 0,
      0, 0, 1, 3, 1,
      1, 0, 2, 4, 1,
      1, 0, 2, 6, 1
    ])

    // prettier-ignore
    expect(actual.getColumn(COUNT, 'number')).toEqual([
      0, 0, 1, 2, 0,
      0, 0, 0, 1, 1,
      1, 0, 1, 1, 0,
      0, 0, 0, 2, 0
    ])

    // prettier-ignore
    expect(actual.getColumn(FILL, 'number')).toEqual([
      0, 0, 0, 0, 0,
      1, 1, 1, 1, 1,
      2, 2, 2, 2, 2,
      3, 3, 3, 3, 3
    ])
  })

  test('with overlaid positioning', () => {
    const table = newTable(10)
      .addColumn('_value', 'number', valueData)
      .addColumn(FILL, 'number', [0, 0, 0, 0, 0, 1, 1, 1, 1, 1])

    const actual = bin(table, '_value', extent(valueData), 5, 'overlaid')

    // prettier-ignore
    expect(actual.getColumn(X_MIN, 'number')).toEqual([
      0, 20, 40, 60, 80,
      0, 20, 40, 60, 80,
    ])

    // prettier-ignore
    expect(actual.getColumn(X_MAX, 'number')).toEqual([
      20, 40, 60, 80, 100,
      20, 40, 60, 80, 100,
    ])

    // prettier-ignore
    expect(actual.getColumn(Y_MIN, 'number')).toEqual([
      0, 0, 0, 0, 0,
      0, 0, 0, 0, 0,
    ])

    // prettier-ignore
    expect(actual.getColumn(Y_MAX, 'number')).toEqual([
      0, 0, 1, 3, 1,
      1, 0, 1, 3, 0,
    ])

    // prettier-ignore
    expect(actual.getColumn(COUNT, 'number')).toEqual([
      0, 0, 1, 3, 1,
      1, 0, 1, 3, 0,
    ])
  })

  test('with a widened x domain', () => {
    const table = newTable(10)
      .addColumn('_value', 'number', valueData)
      .addColumn(FILL, 'number', [0, 0, 0, 0, 0, 0, 0, 0, 0, 0])

    const actual = bin(table, '_value', [-200, 200], 10, 'stacked')

    // prettier-ignore
    expect(actual.getColumn(X_MIN, 'number')).toEqual([
      -200, -160, -120, -80, -40, 0, 40, 80, 120, 160
    ])

    // prettier-ignore
    expect(actual.getColumn(X_MAX, 'number')).toEqual([
      -160, -120, -80, -40, 0, 40, 80, 120, 160, 200,
    ])

    // prettier-ignore
    expect(actual.getColumn(Y_MIN, 'number')).toEqual([
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ])

    // prettier-ignore
    expect(actual.getColumn(Y_MAX, 'number')).toEqual([
      0, 0, 0, 0, 0, 1, 8, 1, 0, 0,
    ])

    // prettier-ignore
    expect(actual.getColumn(COUNT, 'number')).toEqual([
      0, 0, 0, 0, 0, 1, 8, 1, 0, 0,
    ])
  })

  test('with a narrowed x domain', () => {
    const table = newTable(10)
      .addColumn('_value', 'number', valueData)
      .addColumn(FILL, 'number', [0, 0, 0, 0, 0, 0, 0, 0, 0, 0])

    const actual = bin(table, '_value', [50, 80], 3, 'stacked')

    expect(actual.getColumn(X_MIN, 'number')).toEqual([50, 60, 70])
    expect(actual.getColumn(X_MAX, 'number')).toEqual([60, 70, 80])
    expect(actual.getColumn(Y_MIN, 'number')).toEqual([0, 0, 0])
    expect(actual.getColumn(Y_MAX, 'number')).toEqual([1, 3, 3])
    expect(actual.getColumn(COUNT, 'number')).toEqual([1, 3, 3])
  })
})
