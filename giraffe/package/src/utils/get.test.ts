import {get} from './get'

describe('get', () => {
  describe('gracefully handles bad input', () => {
    it('handles falsy values, NaN, Infinity, -Infinity, 0, and -0 for the object, path, or both', () => {
      const defaultValue = 'default value'

      expect(get(undefined, undefined, defaultValue)).toEqual(defaultValue)
      expect(get(undefined, null, defaultValue)).toEqual(defaultValue)
      expect(get(undefined, '', defaultValue)).toEqual(defaultValue)
      expect(get(undefined, false, defaultValue)).toEqual(defaultValue)
      expect(get(undefined, NaN, defaultValue)).toEqual(defaultValue)
      expect(get(undefined, Infinity, defaultValue)).toEqual(defaultValue)
      expect(get(undefined, -Infinity, defaultValue)).toEqual(defaultValue)
      expect(get(undefined, 0, defaultValue)).toEqual(defaultValue)
      expect(get(undefined, -0, defaultValue)).toEqual(defaultValue)

      expect(get(null, undefined, defaultValue)).toEqual(defaultValue)
      expect(get(null, null, defaultValue)).toEqual(defaultValue)
      expect(get(null, '', defaultValue)).toEqual(defaultValue)
      expect(get(null, false, defaultValue)).toEqual(defaultValue)
      expect(get(null, NaN, defaultValue)).toEqual(defaultValue)
      expect(get(null, Infinity, defaultValue)).toEqual(defaultValue)
      expect(get(null, -Infinity, defaultValue)).toEqual(defaultValue)
      expect(get(null, 0, defaultValue)).toEqual(defaultValue)
      expect(get(null, -0, defaultValue)).toEqual(defaultValue)

      expect(get('', undefined, defaultValue)).toEqual(defaultValue)
      expect(get('', null, defaultValue)).toEqual(defaultValue)
      expect(get('', '', defaultValue)).toEqual(defaultValue)
      expect(get('', false, defaultValue)).toEqual(defaultValue)
      expect(get('', NaN, defaultValue)).toEqual(defaultValue)
      expect(get('', Infinity, defaultValue)).toEqual(defaultValue)
      expect(get('', -Infinity, defaultValue)).toEqual(defaultValue)
      expect(get('', 0, defaultValue)).toEqual(defaultValue)
      expect(get('', -0, defaultValue)).toEqual(defaultValue)

      expect(get(false, undefined, defaultValue)).toEqual(defaultValue)
      expect(get(false, null, defaultValue)).toEqual(defaultValue)
      expect(get(false, '', defaultValue)).toEqual(defaultValue)
      expect(get(false, false, defaultValue)).toEqual(defaultValue)
      expect(get(false, NaN, defaultValue)).toEqual(defaultValue)
      expect(get(false, Infinity, defaultValue)).toEqual(defaultValue)
      expect(get(false, -Infinity, defaultValue)).toEqual(defaultValue)
      expect(get(false, 0, defaultValue)).toEqual(defaultValue)
      expect(get(false, -0, defaultValue)).toEqual(defaultValue)

      expect(get(NaN, undefined, defaultValue)).toEqual(defaultValue)
      expect(get(NaN, null, defaultValue)).toEqual(defaultValue)
      expect(get(NaN, '', defaultValue)).toEqual(defaultValue)
      expect(get(NaN, false, defaultValue)).toEqual(defaultValue)
      expect(get(NaN, NaN, defaultValue)).toEqual(defaultValue)
      expect(get(NaN, Infinity, defaultValue)).toEqual(defaultValue)
      expect(get(NaN, -Infinity, defaultValue)).toEqual(defaultValue)
      expect(get(NaN, 0, defaultValue)).toEqual(defaultValue)
      expect(get(NaN, -0, defaultValue)).toEqual(defaultValue)

      expect(get(Infinity, undefined, defaultValue)).toEqual(defaultValue)
      expect(get(Infinity, null, defaultValue)).toEqual(defaultValue)
      expect(get(Infinity, '', defaultValue)).toEqual(defaultValue)
      expect(get(Infinity, false, defaultValue)).toEqual(defaultValue)
      expect(get(Infinity, NaN, defaultValue)).toEqual(defaultValue)
      expect(get(Infinity, Infinity, defaultValue)).toEqual(defaultValue)
      expect(get(Infinity, -Infinity, defaultValue)).toEqual(defaultValue)
      expect(get(Infinity, 0, defaultValue)).toEqual(defaultValue)
      expect(get(Infinity, -0, defaultValue)).toEqual(defaultValue)

      expect(get(-Infinity, undefined, defaultValue)).toEqual(defaultValue)
      expect(get(-Infinity, null, defaultValue)).toEqual(defaultValue)
      expect(get(-Infinity, '', defaultValue)).toEqual(defaultValue)
      expect(get(-Infinity, false, defaultValue)).toEqual(defaultValue)
      expect(get(-Infinity, NaN, defaultValue)).toEqual(defaultValue)
      expect(get(-Infinity, Infinity, defaultValue)).toEqual(defaultValue)
      expect(get(-Infinity, -Infinity, defaultValue)).toEqual(defaultValue)
      expect(get(-Infinity, 0, defaultValue)).toEqual(defaultValue)
      expect(get(-Infinity, -0, defaultValue)).toEqual(defaultValue)

      expect(get(0, undefined, defaultValue)).toEqual(defaultValue)
      expect(get(0, null, defaultValue)).toEqual(defaultValue)
      expect(get(0, '', defaultValue)).toEqual(defaultValue)
      expect(get(0, false, defaultValue)).toEqual(defaultValue)
      expect(get(0, NaN, defaultValue)).toEqual(defaultValue)
      expect(get(0, Infinity, defaultValue)).toEqual(defaultValue)
      expect(get(0, -Infinity, defaultValue)).toEqual(defaultValue)
      expect(get(0, 0, defaultValue)).toEqual(defaultValue)
      expect(get(0, -0, defaultValue)).toEqual(defaultValue)

      expect(get(-0, undefined, defaultValue)).toEqual(defaultValue)
      expect(get(-0, null, defaultValue)).toEqual(defaultValue)
      expect(get(-0, '', defaultValue)).toEqual(defaultValue)
      expect(get(-0, false, defaultValue)).toEqual(defaultValue)
      expect(get(-0, NaN, defaultValue)).toEqual(defaultValue)
      expect(get(-0, Infinity, defaultValue)).toEqual(defaultValue)
      expect(get(-0, -Infinity, defaultValue)).toEqual(defaultValue)
      expect(get(-0, 0, defaultValue)).toEqual(defaultValue)
      expect(get(-0, -0, defaultValue)).toEqual(defaultValue)
    })

    it('default value is considered undefined when not specified', () => {
      const prop = 'this is a property'
      expect(get({prop}, 'mispelledProp')).toEqual(undefined)

      expect(get(undefined, undefined)).toEqual(undefined)
    })
  })

  it('uses the default value when property is not found', () => {
    const prop = 'this is a property'
    const defaultValue = 'default value'

    expect(get({prop}, prop, defaultValue)).not.toEqual(prop)
    expect(get({prop}, prop, defaultValue)).toEqual(defaultValue)

    expect(get({prop}, 'someOtherProp', defaultValue)).not.toEqual(prop)
    expect(get({prop}, 'someOtherProp', defaultValue)).toEqual(defaultValue)
    expect(
      get(
        {
          prop: {
            childProp: {
              deeplyNestedProp: [
                {
                  someOtherProp: prop,
                },
              ],
            },
          },
        },
        'someOtherProp',
        defaultValue
      )
    ).not.toEqual(prop)

    expect(
      get(
        {
          prop: {
            childProp: {
              deeplyNestedProp: [
                {
                  someOtherProp: prop,
                },
              ],
            },
          },
        },
        'someOtherProp',
        defaultValue
      )
    ).toEqual(defaultValue)
  })

  it('can find properties on objects', () => {
    const prop = 'this is a property'
    const defaultValue = 'default value'

    expect(get({prop}, 'prop')).toEqual(prop)
    expect(get({prop}, 'prop', defaultValue)).not.toEqual(defaultValue)
  })

  it('can find properties on arrays', () => {
    const prop = 42
    const defaultValue = 'default value'

    expect(get([prop], '0')).toEqual(prop)
    expect(get([prop], '0', defaultValue)).not.toEqual(defaultValue)

    expect(get([0, 1, 2, prop], 3)).toEqual(prop)
    expect(get([0, 1, 2, prop], 3, defaultValue)).not.toEqual(defaultValue)
  })

  it('can find properties on functions', () => {
    const func = () => {}
    const prop = false
    const defaultValue = 'default value'

    func.prop = prop

    expect(get(func, 'prop')).toEqual(prop)
    expect(get(func, 'prop', defaultValue)).not.toEqual(defaultValue)

    expect(get(func, 'prop')).toEqual(prop)
    expect(get(func, 'prop', defaultValue)).not.toEqual(defaultValue)
  })

  it('properties can be Symbols', () => {
    const func = () => {}
    const prop = Symbol('a property')
    const defaultValue = 'default value'

    func.prop = prop

    expect(get({prop}, 'prop')).toEqual(prop)
    expect(get([prop], '0')).toEqual(prop)
    expect(get([0, 1, 2, prop], 3)).toEqual(prop)
    expect(get(func, 'prop')).toEqual(prop)

    expect(get({prop}, 'prop', defaultValue)).not.toEqual(defaultValue)
    expect(get([prop], '0', defaultValue)).not.toEqual(defaultValue)
    expect(get([0, 1, 2, prop], 3, defaultValue)).not.toEqual(defaultValue)
    expect(get(func, 'prop', defaultValue)).not.toEqual(defaultValue)
  })

  it('properties can be nested', () => {
    const result = 'a nested prop'
    const defaultValue = false

    const obj = {
      nested: {
        result,
      },
    }
    expect(get(obj, 'nested.result')).toEqual(result)
    expect(get(obj, 'nested.result', defaultValue)).not.toEqual(defaultValue)

    const deeplyNested = {
      arr: [
        {
          nested: {
            result,
          },
        },
      ],
    }
    expect(get(deeplyNested, 'arr[0].nested.result')).toEqual(result)
    expect(get(deeplyNested, 'arr[0].nested.result', defaultValue)).not.toEqual(
      defaultValue
    )
  })
})
