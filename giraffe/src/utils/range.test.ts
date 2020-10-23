import {range} from './range'

describe('range creates an array from start to end using an increment or decrement', () => {
  const emptyRange = []
  const MAX_INTEGER = 1.7976931348623157e308

  describe('uses increment when end is greater than start', () => {
    it('uses an increment of 1 when not specified or explicitly undefined', () => {
      expect(range(0, 5)).toEqual([0, 1, 2, 3, 4])
      expect(range(0, 5, undefined)).toEqual([0, 1, 2, 3, 4])
    })

    it('uses an increment of 0 when increment is NaN or null', () => {
      expect(range(0, 5, NaN)).toEqual([0, 0, 0, 0, 0])
      expect(range(0, 5, null)).toEqual([0, 0, 0, 0, 0])
    })

    it('uses a max integer for increment when increment is Infinity', () => {
      expect(range(0, MAX_INTEGER, Infinity)).toEqual([0])
    })

    it('throws an error when start is negative Infinity, end is Infinity, or both', () => {
      expect(() => range(0, Infinity)).toThrow()
      expect(() => range(-Infinity, 0)).toThrow()
      expect(() => range(-Infinity, Infinity)).toThrow()
    })

    it('uses the increment when specified', () => {
      expect(range(0, 10, 2)).toEqual([0, 2, 4, 6, 8])
    })
  })

  describe('uses decrement when start is greater than end', () => {
    it('returns empty range when decrement is not specified, explicitly undefined, null, or NaN', () => {
      expect(range(5, 0)).toEqual(emptyRange)
      expect(range(5, 0, undefined)).toEqual(emptyRange)
      expect(range(5, 0, NaN)).toEqual(emptyRange)
      expect(range(5, 0, null)).toEqual(emptyRange)
    })

    it('uses a max integer for decrement when decrement is -Infinity', () => {
      expect(range(0, -MAX_INTEGER, -Infinity)).toEqual([0])
    })

    it('throws an error when start is Infinity, end is negative Infinity, or both', () => {
      expect(() => range(Infinity, 0, -1)).toThrow()
      expect(() => range(0, -Infinity, -1)).toThrow()
      expect(() => range(Infinity, -Infinity, -1)).toThrow()
    })

    it('uses the decrement when specified', () => {
      expect(range(5, 0, -1)).toEqual([5, 4, 3, 2, 1])
    })
  })

  it('gives a range that includes start and excludes end', () => {
    expect(range(0, 1)).toEqual([0])
    expect(range(-1, -2, -1)).toEqual([-1])
  })

  it('gives an empty range when start and end are equal', () => {
    expect(range(0, 0)).toEqual(emptyRange)
    expect(range(20, 20)).toEqual(emptyRange)
    expect(range(-1, -1)).toEqual(emptyRange)
    expect(range(-5, -5, -1)).toEqual(emptyRange)
  })

  it('interprets start as 0 when start is NaN', () => {
    expect(range(NaN, 5)).toEqual([0, 1, 2, 3, 4])
    expect(range(NaN, -5, -1)).toEqual([0, -1, -2, -3, -4])
  })

  it('interprets end as 0 when end is NaN', () => {
    expect(range(-5, NaN)).toEqual([-5, -4, -3, -2, -1])
    expect(range(5, NaN, -1)).toEqual([5, 4, 3, 2, 1])
  })

  it('interprets start and end as 0 when both are NaN', () => {
    expect(range(NaN, NaN)).toEqual(emptyRange)
    expect(range(NaN, NaN, -1)).toEqual(emptyRange)
  })
})
