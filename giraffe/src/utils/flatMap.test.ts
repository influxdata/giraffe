import {flatMap} from './flatMap'

describe('flatMap', () => {
  it('handles an empty array', () => {
    expect(flatMap([], value => [String(value)])).toEqual([])
  })

  it('flattens a non-empty array', () => {
    expect(flatMap([1, 2, 3], value => [String(value)])).toEqual([
      '1',
      '2',
      '3',
    ])
  })

  it('flattens nested arrays one level deep', () => {
    expect(
      flatMap(
        [
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 9],
        ],
        value => value.map(v => String(v))
      )
    ).toEqual(['1', '2', '3', '4', '5', '6', '7', '8', '9'])
  })

  it('flattens only the first level of nested arrays more than one level deep', () => {
    expect(
      flatMap(
        [
          [[1], [2], [3]],
          [[4], [5], [6]],
          [[7], [8], [9]],
        ],
        value => value.map(v => v.map(innerV => String(innerV)))
      )
    ).toEqual([['1'], ['2'], ['3'], ['4'], ['5'], ['6'], ['7'], ['8'], ['9']])
  })
})
