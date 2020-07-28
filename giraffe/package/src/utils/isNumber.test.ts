import {isNumber} from './isNumber'

describe('isNumber', () => {
  test('the value created from the Number constructor is a number', () => {
    const value = new Number()

    expect(typeof value === 'object').toEqual(true)
    expect(isNumber(value)).toEqual(true)
  })

  test('the value created from the Number function is a number', () => {
    const value = Number()

    expect(typeof value !== 'object').toEqual(true)
    expect(isNumber(value)).toEqual(true)
  })

  test('a literal number is a number', () => {
    expect(isNumber(1)).toEqual(true)
    expect(isNumber(123456789)).toEqual(true)
    expect(isNumber(0)).toEqual(true)
    expect(isNumber(-4567.89)).toEqual(true)
  })

  test('Infinity and negative Infinity are numbers', () => {
    expect(isNumber(Infinity)).toEqual(true)
    expect(isNumber(-Infinity)).toEqual(true)
  })

  test('the value NaN is a number', () => {
    expect(isNumber(NaN)).toEqual(true)
  })

  test('anything else is not a number', () => {
    expect(isNumber(undefined)).toEqual(false)
    expect(isNumber(null)).toEqual(false)
    expect(isNumber({})).toEqual(false)
    expect(isNumber([])).toEqual(false)
    expect(isNumber('123')).toEqual(false)
    expect(isNumber('-0')).toEqual(false)
    expect(isNumber(() => 123)).toEqual(false)
    expect(isNumber(Symbol())).toEqual(false)
  })
})
