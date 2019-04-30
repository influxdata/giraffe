import {Table} from '../'
import {bin} from './bin'

const TABLE: Table = {
  columns: {
    _value: {
      data: [70, 56, 60, 100, 76, 0, 63, 48, 79, 67],
      name: '_value',
      type: 'int',
    },
    _field: {
      data: [
        'usage_guest',
        'usage_guest',
        'usage_guest',
        'usage_guest',
        'usage_guest',
        'usage_idle',
        'usage_idle',
        'usage_idle',
        'usage_idle',
        'usage_idle',
      ],
      name: '_field',
      type: 'string',
    },
    cpu: {
      data: [
        'cpu0',
        'cpu0',
        'cpu0',
        'cpu1',
        'cpu1',
        'cpu0',
        'cpu0',
        'cpu0',
        'cpu1',
        'cpu1',
      ],
      name: 'cpu',
      type: 'string',
    },
  },
  length: 10,
}

describe('bin', () => {
  test('without grouping', () => {
    const actual = bin(TABLE, '_value', null, [], 5, 'stacked')
    const expected = {
      columns: {
        xMin: {data: [0, 20, 40, 60, 80], type: 'int', name: 'xMin'},
        xMax: {data: [20, 40, 60, 80, 100], type: 'int', name: 'xMax'},
        yMin: {data: [0, 0, 0, 0, 0], type: 'int', name: 'yMin'},
        yMax: {data: [1, 0, 2, 6, 1], type: 'int', name: 'yMax'},
      },
      length: 5,
    }

    expect(actual).toEqual(expected)
  })

  test('with grouping by _field and cpu', () => {
    const actual = bin(TABLE, '_value', null, ['_field'], 5, 'stacked').columns

    const expected = {
      xMin: {
        data: [0, 20, 40, 60, 80, 0, 20, 40, 60, 80],
        type: 'int',
        name: 'xMin',
      },
      xMax: {
        data: [20, 40, 60, 80, 100, 20, 40, 60, 80, 100],
        type: 'int',
        name: 'xMax',
      },
      yMin: {data: [0, 0, 0, 0, 0, 0, 0, 1, 3, 1], type: 'int', name: 'yMin'},
      yMax: {data: [0, 0, 1, 3, 1, 1, 0, 2, 6, 1], type: 'int', name: 'yMax'},
      _field: {
        data: [
          'usage_guest',
          'usage_guest',
          'usage_guest',
          'usage_guest',
          'usage_guest',
          'usage_idle',
          'usage_idle',
          'usage_idle',
          'usage_idle',
          'usage_idle',
        ],
        type: 'string',
        name: '_field',
      },
    }

    expect(actual).toEqual(expected)
  })

  test('with grouping and overlaid positioning', () => {
    const actual = bin(TABLE, '_value', null, ['_field'], 5, 'overlaid').columns

    const expected = {
      xMin: {
        data: [0, 20, 40, 60, 80, 0, 20, 40, 60, 80],
        type: 'int',
        name: 'xMin',
      },
      xMax: {
        data: [20, 40, 60, 80, 100, 20, 40, 60, 80, 100],
        type: 'int',
        name: 'xMax',
      },
      yMin: {data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], type: 'int', name: 'yMin'},
      yMax: {data: [0, 0, 1, 3, 1, 1, 0, 1, 3, 0], type: 'int', name: 'yMax'},
      _field: {
        data: [
          'usage_guest',
          'usage_guest',
          'usage_guest',
          'usage_guest',
          'usage_guest',
          'usage_idle',
          'usage_idle',
          'usage_idle',
          'usage_idle',
          'usage_idle',
        ],
        type: 'string',
        name: '_field',
      },
    }

    expect(actual).toEqual(expected)
  })

  test('with an explicitly set xDomain', () => {
    const actual = bin(TABLE, '_value', [-200, 200], [], 10, 'stacked').columns

    const expected = {
      xMin: {
        data: [-200, -160, -120, -80, -40, 0, 40, 80, 120, 160],
        type: 'int',
        name: 'xMin',
      },
      xMax: {
        data: [-160, -120, -80, -40, 0, 40, 80, 120, 160, 200],
        type: 'int',
        name: 'xMax',
      },
      yMin: {data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], type: 'int', name: 'yMin'},
      yMax: {data: [0, 0, 0, 0, 0, 1, 8, 1, 0, 0], type: 'int', name: 'yMax'},
    }

    expect(actual).toEqual(expected)
  })

  test('ignores values outside of xDomain', () => {
    const actual = bin(TABLE, '_value', [50, 80], [], 3, 'stacked').columns

    const expected = {
      xMin: {data: [50, 60, 70], type: 'int', name: 'xMin'},
      xMax: {data: [60, 70, 80], type: 'int', name: 'xMax'},
      yMin: {data: [0, 0, 0], type: 'int', name: 'yMin'},
      yMax: {data: [1, 3, 3], type: 'int', name: 'yMax'},
    }

    expect(actual).toEqual(expected)
  })
})
