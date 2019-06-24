import {heatmapTransform} from './heatmap'
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
})
