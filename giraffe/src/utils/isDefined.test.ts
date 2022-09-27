import {isDefined} from './isDefined'

describe('isDefined', () => {
  it('handles falsy input', () => {
    expect(isDefined()).toEqual(false)
    expect(isDefined(null)).toEqual(false)
    expect(isDefined(undefined)).toEqual(false)
    expect(isDefined(NaN)).toEqual(false)

    expect(isDefined(false)).toEqual(true)
    expect(isDefined('')).toEqual(true)
    expect(isDefined(0)).toEqual(true)
  })

  it('handles other input', () => {
    expect(isDefined(true)).toEqual(true)
    expect(isDefined('string')).toEqual(true)
    expect(isDefined(1)).toEqual(true)
    expect(isDefined({})).toEqual(true)
    expect(isDefined([])).toEqual(true)
    expect(isDefined(() => {})).toEqual(true)
    expect(isDefined(Symbol())).toEqual(true)
  })
})
