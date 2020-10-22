import {isFiniteNumber} from './isFiniteNumber'

describe('isFiniteNumber', () => {
  it('the value created from the Number constructor is a finite number', () => {
    const value = new Number()

    expect(typeof value === 'object').toEqual(true)
    expect(isFiniteNumber(value)).toEqual(true)
  })

  it('the value created from the Number function is a finite number', () => {
    const value = Number()

    expect(typeof value !== 'object').toEqual(true)
    expect(isFiniteNumber(value)).toEqual(true)
  })

  it('a literal number and constants are finite numbers', () => {
    expect(isFiniteNumber(1)).toEqual(true)
    expect(isFiniteNumber(123456789)).toEqual(true)
    expect(isFiniteNumber(0)).toEqual(true)
    expect(isFiniteNumber(-4567.89)).toEqual(true)
    expect(isFiniteNumber(Math.PI)).toEqual(true)
  })

  it('Infinity and negative Infinity are not finite numbers', () => {
    expect(isFiniteNumber(Infinity)).toEqual(false)
    expect(isFiniteNumber(-Infinity)).toEqual(false)
  })

  it('the value NaN is not a finite number', () => {
    expect(isFiniteNumber(NaN)).toEqual(false)
  })

  it('anything else is not a finite number', () => {
    expect(isFiniteNumber(undefined)).toEqual(false)
    expect(isFiniteNumber(null)).toEqual(false)
    expect(isFiniteNumber({})).toEqual(false)
    expect(isFiniteNumber([])).toEqual(false)
    expect(isFiniteNumber('123')).toEqual(false)
    expect(isFiniteNumber('-0')).toEqual(false)
    expect(isFiniteNumber(() => 123)).toEqual(false)
    expect(isFiniteNumber(Symbol())).toEqual(false)
  })
})
