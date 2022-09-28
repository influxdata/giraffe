import {isDefined, isDefinedOrNaN} from './isDefined'

describe('utils/isDefined', () => {
  describe('isDefined', () => {
    it('handles falsy input', () => {
      expect(isDefined()).toEqual(false)
      expect(isDefined(null)).toEqual(false)
      expect(isDefined(undefined)).toEqual(false)
      expect(isDefined(NaN)).toEqual(false)

      expect(isDefined(false)).toEqual(true)
      expect(isDefined('')).toEqual(true)
      expect(isDefined(0)).toEqual(true)
    })

    it('handles other input', () => {
      expect(isDefined(true)).toEqual(true)
      expect(isDefined('string')).toEqual(true)
      expect(isDefined(1)).toEqual(true)
      expect(isDefined({})).toEqual(true)
      expect(isDefined([])).toEqual(true)
      expect(isDefined(() => {})).toEqual(true)
      expect(isDefined(Symbol())).toEqual(true)
    })
  })

  describe('isDefinedOrNaN', () => {
    it('handles falsy input', () => {
      expect(isDefinedOrNaN()).toEqual(false)
      expect(isDefinedOrNaN(null)).toEqual(false)
      expect(isDefinedOrNaN(undefined)).toEqual(false)

      expect(isDefinedOrNaN(NaN)).toEqual(true)
      expect(isDefinedOrNaN(false)).toEqual(true)
      expect(isDefinedOrNaN('')).toEqual(true)
      expect(isDefinedOrNaN(0)).toEqual(true)
    })

    it('handles other input', () => {
      expect(isDefinedOrNaN(true)).toEqual(true)
      expect(isDefinedOrNaN('string')).toEqual(true)
      expect(isDefinedOrNaN(1)).toEqual(true)
      expect(isDefinedOrNaN({})).toEqual(true)
      expect(isDefinedOrNaN([])).toEqual(true)
      expect(isDefinedOrNaN(() => {})).toEqual(true)
      expect(isDefinedOrNaN(Symbol())).toEqual(true)
    })
  })
})
