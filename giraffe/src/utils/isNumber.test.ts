import {isNumber} from './isNumber'

describe('isNumber', () => {
  it('the value created from the Number constructor is a number', () => {
    const value = new Number()

    expect(typeof value === 'object').toEqual(true)
    expect(isNumber(value)).toEqual(true)
  })

  it('the value created from the Number function is a number', () => {
    const value = Number()

    expect(typeof value !== 'object').toEqual(true)
    expect(isNumber(value)).toEqual(true)
  })

  it('a literal number is a number', () => {
    expect(isNumber(1)).toEqual(true)
    expect(isNumber(123456789)).toEqual(true)
    expect(isNumber(0)).toEqual(true)
    expect(isNumber(-4567.89)).toEqual(true)
  })

  it('Infinity and negative Infinity are numbers', () => {
    expect(isNumber(Infinity)).toEqual(true)
    expect(isNumber(-Infinity)).toEqual(true)
  })

  it('the value NaN is a number', () => {
    expect(isNumber(NaN)).toEqual(true)
  })

  it('anything else is not a number', () => {
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
