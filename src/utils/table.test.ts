import {Table} from '../types'
import {filterTable} from './table'

test('filterTable', () => {
  const table: Table = {
    columns: {
      a: {
        name: 'a',
        type: 'number',
        data: [11, 15, 20, 4, 2],
      },
      b: {
        name: 'b',
        type: 'number',
        data: [1, 2, 3, 1, 9],
      },
    },
    length: 5,
  }

  const actual = filterTable(row => row.a % 5 === 0 || row.b % 3 === 0, table)

  const expected: Table = {
    columns: {
      a: {
        name: 'a',
        type: 'number',
        data: [15, 20, 2],
      },
      b: {
        name: 'b',
        type: 'number',
        data: [2, 3, 9],
      },
    },
    length: 3,
  }

  expect(actual).toEqual(expected)
})
