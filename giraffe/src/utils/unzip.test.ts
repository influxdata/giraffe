import {unzip} from './unzip'

describe('unzip', () => {
  it('handles arrays of same types', () => {
    const mixed = [
      ['Queen', 'Elizabeth', 'I'],
      ['King', 'James', 'II'],
      ['Princess', 'Caroline', 'X'],
      ['Prince', 'Henry', 'VII'],
    ]

    expect(unzip(mixed)).toEqual([
      ['Queen', 'King', 'Princess', 'Prince'],
      ['Elizabeth', 'James', 'Caroline', 'Henry'],
      ['I', 'II', 'X', 'VII'],
    ])
  })

  it('handles arrays of mixed types', () => {
    const mixed = [
      ['a', 1, true],
      ['b', 2, false],
      ['c', 3, false],
    ]

    expect(unzip(mixed)).toEqual([
      ['a', 'b', 'c'],
      [1, 2, 3],
      [true, false, false],
    ])
  })
})
