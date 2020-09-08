import {isEqual} from './isEqual'

describe('isEqual', () => {
  it('handles basic types', () => {
    expect(isEqual(0, 0)).toEqual(true)
    expect(isEqual(0, 1)).toEqual(false)
    expect(isEqual(3, 1)).toEqual(false)
    expect(isEqual(3, 0)).toEqual(false)
    expect(isEqual(3, 3)).toEqual(true)
    expect(isEqual('', '')).toEqual(true)
    expect(isEqual('omg', 'omg')).toEqual(true)
    expect(isEqual('wow', 'wow')).toEqual(true)
    expect(isEqual('owowow', `owowow`)).toEqual(true)
    expect(isEqual('owowow', 'owen wilson')).toEqual(false)
    expect(isEqual(false, false)).toEqual(true)
    expect(isEqual()).toEqual(true)
    expect(isEqual(undefined)).toEqual(true)
  })

  it('uses strict equality', () => {
    expect(isEqual(0, false)).toEqual(false)
    expect(isEqual('', false)).toEqual(false)
    expect(isEqual('', 0)).toEqual(false)
    expect(isEqual(undefined, null)).toEqual(false)
  })

  it('handles numeric concepts', () => {
    expect(isEqual(NaN, NaN)).toEqual(false)
    expect(isEqual(NaN, false)).toEqual(false)
    expect(isEqual(NaN, 'a string')).toEqual(false)
    expect(isEqual(NaN, Infinity)).toEqual(false)
    expect(isEqual(NaN, -Infinity)).toEqual(false)

    expect(isEqual(Infinity, Infinity)).toEqual(true)
    expect(isEqual(-Infinity, -Infinity)).toEqual(true)
  })

  it('handles Symbols', () => {
    const description = 'a symbol'
    const symbol = Symbol(description)

    expect(isEqual(symbol, symbol)).toEqual(true)

    expect(isEqual(Symbol(description), Symbol(description))).toEqual(false)
  })

  it('handles functions', () => {
    const testFunc = () => {}
    expect(isEqual(testFunc, testFunc)).toEqual(true)
    expect(
      isEqual(
        () => {},
        () => {}
      )
    ).toEqual(false)
  })

  it('handles objects', () => {
    expect(isEqual(null, null)).toEqual(true)
    expect(isEqual({a: 1, b: false}, {a: 1, b: false})).toEqual(true)
    expect(isEqual([1, 2, 3], [1, 2, 3])).toEqual(true)
  })

  it('handles nested objects', () => {
    expect(
      isEqual(
        {
          a: {
            nested: 'yes',
          },
          b: false,
          c: [1, 2, 3],
          d: [
            {
              data: [
                {
                  array: [1, 2, 3],
                },
              ],
            },
          ],
        },
        {
          a: {
            nested: 'yes',
          },
          b: false,
          c: [1, 2, 3],
          d: [
            {
              data: [
                {
                  array: [1, 2, 3],
                },
              ],
            },
          ],
        }
      )
    ).toEqual(true)
    expect(isEqual([[1, 2], 3, {four: 4}], [[1, 2], 3, {four: 4}])).toEqual(
      true
    )
  })
})
