import {getJavaScriptTag} from './getJavaScriptTag'

describe('getJavaScriptTag', () => {
  test('get tag for Undefined', () => {
    expect(getJavaScriptTag(undefined)).toEqual('[object Undefined]')
  })

  test('get tag for Null', () => {
    expect(getJavaScriptTag(null)).toEqual('[object Null]')
  })

  test('get tag for Object', () => {
    expect(getJavaScriptTag({})).toEqual('[object Object]')
  })

  test('get tag for Array', () => {
    expect(getJavaScriptTag([])).toEqual('[object Array]')
  })

  test('get tag for Function', () => {
    expect(getJavaScriptTag(() => {})).toEqual('[object Function]')
  })

  test('get tag for String', () => {
    expect(getJavaScriptTag('')).toEqual('[object String]')
  })

  test('get tag for Number', () => {
    expect(getJavaScriptTag(1)).toEqual('[object Number]')
  })

  test('get tag for Boolean', () => {
    expect(getJavaScriptTag(true)).toEqual('[object Boolean]')
  })

  test('get tag for Symbol', () => {
    expect(getJavaScriptTag(Symbol())).toEqual('[object Symbol]')
  })
})
