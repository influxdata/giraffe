import {replace} from './replace'

describe('replace', () => {
  describe('returns the first argument when given less than 3 arguments', () => {
    it('returns "undefined" as a string when first argument is undefined', () => {
      expect(replace()).toEqual('undefined')
      expect(replace(undefined, 'hello world')).toEqual('undefined')
    })

    it('returns "null" as a string when first argument is null', () => {
      expect(replace(null)).toEqual('null')
      expect(replace(null, 'who am i')).toEqual('null')
    })

    it('returns the first argument as a string', () => {
      expect(replace('hello')).toEqual('hello')
      expect(replace('hello', 'world')).toEqual('hello')
    })
  })

  it('replaces only the first match of the second argument string with the third argument', () => {
    const str = 'dog dog dog'

    expect(replace(str, 'dog', 'ferret')).toEqual('ferret dog dog')
  })

  it('handles the second argument RegEx with correct replacement using the third argument', () => {
    const str = 'dog dog dog'

    expect(replace(str, /dog/, 'ferret')).toEqual('ferret dog dog')
    expect(replace(str, /dog/g, 'ferret')).toEqual('ferret ferret ferret')

    const mixedCase = 'MiXeD cAsE iS CoOl'
    expect(
      replace(mixedCase, /mixed case is cool/, 'mixed case is cool')
    ).toEqual(mixedCase)
    expect(
      replace(mixedCase, /mixed case is cool/i, 'mixed case is cool')
    ).toEqual('mixed case is cool')
  })
})
