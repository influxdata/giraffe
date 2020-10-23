import {getJavaScriptTag} from './getJavaScriptTag'

describe('getJavaScriptTag', () => {
  it('get tag for Undefined', () => {
    expect(getJavaScriptTag(undefined)).toEqual('[object Undefined]')
  })

  it('get tag for Null', () => {
    expect(getJavaScriptTag(null)).toEqual('[object Null]')
  })

  it('get tag for Object', () => {
    expect(getJavaScriptTag({})).toEqual('[object Object]')
  })

  it('get tag for Array', () => {
    expect(getJavaScriptTag([])).toEqual('[object Array]')
  })

  it('get tag for Function', () => {
    expect(getJavaScriptTag(() => {})).toEqual('[object Function]')
  })

  it('get tag for String', () => {
    expect(getJavaScriptTag('')).toEqual('[object String]')
  })

  it('get tag for Number', () => {
    expect(getJavaScriptTag(1)).toEqual('[object Number]')
  })

  it('get tag for Boolean', () => {
    expect(getJavaScriptTag(true)).toEqual('[object Boolean]')
  })

  it('get tag for Symbol', () => {
    expect(getJavaScriptTag(Symbol())).toEqual('[object Symbol]')
  })
})
