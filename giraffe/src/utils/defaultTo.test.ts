import {defaultTo} from './defaultTo'

describe('defaultTo', () => {
  it('handles falsy values', () => {
    expect(defaultTo(undefined, 'default value')).toEqual('default value')
    expect(defaultTo(null, 'default value')).toEqual('default value')
    expect(defaultTo(NaN, 'default value')).toEqual('default value')

    expect(defaultTo(false, 'default value')).not.toEqual('default value')
  })

  it('handles truthy values', () => {
    expect(defaultTo(true, 'default value')).not.toEqual('default value')
    expect(defaultTo('data value', 'default value')).not.toEqual(
      'default value'
    )
    expect(defaultTo(0, 'default value')).not.toEqual('default value')
    expect(defaultTo(-1, 'default value')).not.toEqual('default value')
    expect(defaultTo(Infinity, 'default value')).not.toEqual('default value')
    expect(defaultTo(Symbol('a symbol'), 'default value')).not.toEqual(
      'default value'
    )
    expect(defaultTo([], 'default value')).not.toEqual('default value')
    expect(defaultTo({}, 'default value')).not.toEqual('default value')
    expect(defaultTo(() => {}, 'default value')).not.toEqual('default value')
  })
})
