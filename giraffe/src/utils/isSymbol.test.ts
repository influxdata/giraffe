import {isSymbol} from './isSymbol'

describe('isSymbol', () => {
  test('a value created from the Symbol function is a Symbol', () => {
    expect(isSymbol(Symbol())).toEqual(true)
    expect(isSymbol(Symbol(''))).toEqual(true)
    expect(isSymbol(Symbol('yoyoyo'))).toEqual(true)
    expect(isSymbol(Symbol(0))).toEqual(true)
    expect(isSymbol(Symbol(1))).toEqual(true)
    expect(isSymbol(Symbol(-3.14))).toEqual(true)
  })

  test('an object wrapping a value created from the Symbol function is a Symbol', () => {
    const symbol = Symbol('a real symbol')
    const wrapper = Object(symbol)
    expect(isSymbol(wrapper)).toEqual(true)
  })

  test('anything else is not a Symbol', () => {
    expect(isSymbol('is this a symbol?')).toEqual(false)
    expect(isSymbol(undefined)).toEqual(false)
    expect(isSymbol(null)).toEqual(false)
    expect(isSymbol({})).toEqual(false)
    expect(isSymbol([])).toEqual(false)
    expect(isSymbol(123)).toEqual(false)
    expect(isSymbol(-0)).toEqual(false)
    expect(isSymbol(NaN)).toEqual(false)
    expect(isSymbol(Infinity)).toEqual(false)
    expect(isSymbol(-Infinity)).toEqual(false)
    expect(isSymbol(() => 'return value is a string!')).toEqual(false)
  })
})
