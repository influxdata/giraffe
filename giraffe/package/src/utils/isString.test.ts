import {isString} from './isString'

describe('isString', () => {
  test('the value created from the String constructor is a string', () => {
    const value = new String()

    expect(typeof value === 'object').toEqual(true)
    expect(isString(value)).toEqual(true)
  })

  test('the value created from the String function is a string', () => {
    const value = String()

    expect(typeof value !== 'object').toEqual(true)
    expect(isString(value)).toEqual(true)
  })

  test('a literal string is a string', () => {
    expect(
      isString('@#$^@#$@ ; \n\nerer /.,.. abc one two three!!!!! #_+[]')
    ).toEqual(true)
    expect(isString('123456789')).toEqual(true)
    expect(isString('0')).toEqual(true)
    expect(isString('-4567.89')).toEqual(true)
  })

  test('anything else is not a string', () => {
    expect(isString(undefined)).toEqual(false)
    expect(isString(null)).toEqual(false)
    expect(isString({})).toEqual(false)
    expect(isString([])).toEqual(false)
    expect(isString(123)).toEqual(false)
    expect(isString(-0)).toEqual(false)
    expect(isString(NaN)).toEqual(false)
    expect(isString(Infinity)).toEqual(false)
    expect(isString(-Infinity)).toEqual(false)
    expect(isString(() => 'return value is a string!')).toEqual(false)
    expect(isString(Symbol())).toEqual(false)
  })
})
