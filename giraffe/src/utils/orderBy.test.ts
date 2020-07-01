import {orderBy} from './orderBy'

describe('orderBy', () => {
  it('handles a function as iteratee', () => {
    const collection = ['d', 'b', 'c', 'a']
    expect(orderBy(collection, item => item, ['asc'])).toEqual([
      'a',
      'b',
      'c',
      'd',
    ])
  })

  it('handles strings as iteratees', () => {
    const collection = [
      {user: 'barney', age: 34},
      {user: 'fred', age: 40},
      {user: 'fred', age: 48},
      {user: 'barney', age: 36},
    ]
    expect(orderBy(collection, ['user', 'age'], ['asc', 'desc'])).toEqual([
      {user: 'barney', age: 36},
      {user: 'barney', age: 34},
      {user: 'fred', age: 48},
      {user: 'fred', age: 40},
    ])
  })
})
