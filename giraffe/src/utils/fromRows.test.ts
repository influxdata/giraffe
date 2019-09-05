import {fromRows} from './fromRows'
import {ColumnType} from '../types'

describe('fromRows', () => {
  test('it can infer column types', () => {
    const rows = [
      {foo: 1, bar: new Date(0), baz: false, a: 'A'},
      {foo: 3, bar: new Date(1), baz: true, a: 'B'},
      {foo: 5, bar: new Date(2), baz: false, a: 'C'},
    ]

    const table = fromRows(rows)

    expect(table.length).toBe(3)

    expect(table.getColumn('foo')).toEqual([1, 3, 5])
    expect(table.getColumnType('foo')).toEqual('number')

    expect(table.getColumn('bar')).toEqual([0, 1, 2])
    expect(table.getColumnType('bar')).toEqual('time')

    expect(table.getColumn('baz')).toEqual([false, true, false])
    expect(table.getColumnType('baz')).toEqual('boolean')

    expect(table.getColumn('a')).toEqual(['A', 'B', 'C'])
    expect(table.getColumnType('a')).toEqual('string')
  })

  test('it can accept an explicit schema definition', () => {
    const rows = [
      {foo: 1, bar: 0, baz: 0, a: 'A', b: '1'},
      {foo: 3, bar: 1, baz: 1, a: 'B', b: '2'},
      {foo: 5, bar: 2, baz: 0, a: 'C', b: '3'},
    ]

    const schema: {[k: string]: ColumnType} = {
      foo: 'number',
      bar: 'time',
      baz: 'boolean',
      a: 'string',
    }

    const table = fromRows(rows, schema)

    expect(table.length).toBe(3)

    expect(table.getColumn('foo')).toEqual([1, 3, 5])
    expect(table.getColumnType('foo')).toEqual('number')

    expect(table.getColumn('bar')).toEqual([0, 1, 2])
    expect(table.getColumnType('bar')).toEqual('time')

    expect(table.getColumn('baz')).toEqual([false, true, false])
    expect(table.getColumnType('baz')).toEqual('boolean')

    expect(table.getColumn('a')).toEqual(['A', 'B', 'C'])
    expect(table.getColumnType('a')).toEqual('string')

    expect(table.getColumn('b')).toBeNull()
  })

  test('with sparse data', () => {
    const rows = [
      {foo: 1, baz: 3},
      {foo: 3, bar: 1, baz: 7},
      {foo: 5, bar: 2},
      {snorp: 11},
    ]

    const table = fromRows(rows)

    expect(table.length).toBe(4)
    expect(table.getColumn('foo')).toEqual([1, 3, 5, undefined])
    expect(table.getColumn('bar')).toEqual([undefined, 1, 2, undefined])
    expect(table.getColumn('baz')).toEqual([3, 7, undefined, undefined])
    expect(table.getColumn('snorp')).toEqual([
      undefined,
      undefined,
      undefined,
      11,
    ])
  })

  test('throws an error when encountering a mismatched schema', () => {
    const rows = [{foo: 'bar'}, {foo: 1}]

    expect(() => fromRows(rows)).toThrowError(
      'ColumnType for column "foo" cannot be both "string" and "number"'
    )
  })

  test('throws an error when encountering a value of unknown ColumnType', () => {
    const rows = [{foo: {some: 'object'}}]

    expect(() => fromRows(rows)).toThrowError(
      'could not infer ColumnType of value "[object Object]"'
    )
  })
})
