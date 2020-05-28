import {heatmapTransform, bin2d} from './heatmap'
import {newTable} from '../utils/newTable'

describe('heatmapTransform', () => {
  test('does not crash when passed zero-width domain', () => {
    // x domain of this table has a zero-width domain
    const table = newTable(3)
      .addColumn('x', 'number', [1, 1, 1])
      .addColumn('y', 'number', [0, 1, 2])

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
    const currentTime = Date.now()
    const interval = 100
    const table = newTable(3)
      .addColumn(xColKey, 'time', [
        currentTime,
        currentTime + interval,
        currentTime + interval * 2,
      ])
      .addColumn(yColKey, 'number', [0, 1, 2])

    const width = 987
    const height = 788
    const binSize = Math.max(width, height) + 1
    expect(() => {
      bin2d(
        table,
        xColKey,
        yColKey,
        [currentTime, currentTime + interval * 2],
        [0, 2],
        width,
        height,
        binSize
      )
    }).not.toThrow()
  })

  test('does not crash when bin size is 0, negative, NaN, negative Infinity, positive Infinity', () => {
    const xColKey = '_time'
    const yColKey = '_value'
    const currentTime = Date.now()
    const interval = 100
    const table = newTable(3)
      .addColumn(xColKey, 'time', [
        currentTime,
        currentTime + interval,
        currentTime + interval * 2,
      ])
      .addColumn(yColKey, 'number', [0, 1, 2])

    const width = 987
    const height = 788

    let binSize = 0
    expect(() => {
      bin2d(
        table,
        xColKey,
        yColKey,
        [currentTime, currentTime + interval * 2],
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
        [currentTime, currentTime + interval * 2],
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
        [currentTime, currentTime + interval * 2],
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
        [currentTime, currentTime + interval * 2],
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
        [currentTime, currentTime + interval * 2],
        [0, 2],
        width,
        height,
        binSize
      )
    }).not.toThrow()
  })
})
