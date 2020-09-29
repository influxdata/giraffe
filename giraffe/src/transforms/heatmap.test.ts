import {heatmapTransform, bin2d} from './heatmap'
import {newTable} from '../utils/newTable'

describe('heatmapTransform', () => {
  test('does not crash when passed zero-width domain', () => {
    // x domain of this table has a zero-width domain
    const table = newTable(3)
      .addColumn('x', 'long', 'number', [1, 1, 1])
      .addColumn('y', 'long', 'number', [0, 1, 2])

    expect(() => {
      heatmapTransform(table, 'x', 'y', null, null, 100, 100, 10, [
        'papayawhip',
        'tomato',
      ])
    }).not.toThrow()
  })

  test('does not crash when bin size is the largest among bin size, width, and height', () => {
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
      .addColumn(yColKey, 'long', 'number', [0, 1, 2])

    const width = 987
    const height = 788
    const binSize = Math.max(width, height) + 1

    expect(Math.max(width, height, binSize)).toEqual(binSize)
    expect(() => {
      bin2d(
        table,
        xColKey,
        yColKey,
        [startTime, startTime + interval * 2],
        [0, 2],
        width,
        height,
        binSize
      )
    }).not.toThrow()
  })

  test('does not crash when bin size is negative 0, positive 0, negative, NaN, negative Infinity, or positive Infinity', () => {
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
      .addColumn(yColKey, 'long', 'number', [0, 1, 2])

    const width = 987
    const height = 788

    let binSize = -0
    expect(() => {
      bin2d(
        table,
        xColKey,
        yColKey,
        [startTime, startTime + interval * 2],
        [0, 2],
        width,
        height,
        binSize
      )
    }).not.toThrow()

    binSize = +0
    expect(() => {
      bin2d(
        table,
        xColKey,
        yColKey,
        [startTime, startTime + interval * 2],
        [0, 2],
        width,
        height,
        binSize
      )
    }).not.toThrow()

    binSize = -1
    expect(() => {
      bin2d(
        table,
        xColKey,
        yColKey,
        [startTime, startTime + interval * 2],
        [0, 2],
        width,
        height,
        binSize
      )
    }).not.toThrow()

    binSize = NaN
    expect(() => {
      bin2d(
        table,
        xColKey,
        yColKey,
        [startTime, startTime + interval * 2],
        [0, 2],
        width,
        height,
        binSize
      )
    }).not.toThrow()

    binSize = -Infinity
    expect(() => {
      bin2d(
        table,
        xColKey,
        yColKey,
        [startTime, startTime + interval * 2],
        [0, 2],
        width,
        height,
        binSize
      )
    }).not.toThrow()

    binSize = Infinity
    expect(() => {
      bin2d(
        table,
        xColKey,
        yColKey,
        [startTime, startTime + interval * 2],
        [0, 2],
        width,
        height,
        binSize
      )
    }).not.toThrow()
  })
})
