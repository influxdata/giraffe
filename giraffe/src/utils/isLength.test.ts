import {isLength, MAX_SAFE_INTEGER} from './isLength'

describe('isLength', () => {
  it('a non-negative integer within a certain limit is a valid length', () => {
    expect(isLength(0)).toEqual(true)
    expect(isLength(1000)).toEqual(true)
    expect(isLength(MAX_SAFE_INTEGER)).toEqual(true)
    expect(isLength(MAX_SAFE_INTEGER + 1)).toEqual(false)

    const numberOfRandomIntegers = 1000
    for (let x = 0; x < numberOfRandomIntegers; x++) {
      expect(
        isLength(Math.floor(Math.random() * (MAX_SAFE_INTEGER + 1)))
      ).toEqual(true)
    }
  })

  it('everything else is not a valid length', () => {
    expect(isLength(1.5)).toEqual(false)
    expect(isLength(Math.PI)).toEqual(false)
    expect(isLength(-1)).toEqual(false)
    expect(isLength('1')).toEqual(false)
    expect(isLength('length')).toEqual(false)
    expect(isLength(true)).toEqual(false)
    expect(isLength()).toEqual(false)
    expect(isLength(undefined)).toEqual(false)
    expect(isLength(null)).toEqual(false)
    expect(isLength([])).toEqual(false)
    expect(isLength({})).toEqual(false)
    expect(isLength(() => {})).toEqual(false)
    expect(isLength(Symbol('a symbol'))).toEqual(false)
  })
})
