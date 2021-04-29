import {nearestTimestamp} from './nearestTimestamp'

describe('finding the nearest timestamp', () => {
  const tens = [10, 20, 30, 40, 50, 60, 70, 80, 90]

  it('returns the nearest timestamp', () => {
    expect(nearestTimestamp(tens, 8)).toBe(10)
    expect(nearestTimestamp(tens, 29)).toBe(30)
    expect(nearestTimestamp(tens, 36)).toBe(40)
    expect(nearestTimestamp(tens, 52)).toBe(50)
    expect(nearestTimestamp(tens, 60)).toBe(60)
    expect(nearestTimestamp(tens, 74)).toBe(70)
    expect(nearestTimestamp(tens, 99)).toBe(90)
  })

  it('rounds down in the case of ties', () => {
    expect(nearestTimestamp(tens, 55)).toBe(50)
  })

  it('handles negative numbers', () => {
    expect(nearestTimestamp(tens, -5)).toBe(10)
  })

  it('handles very big numbers', () => {
    expect(nearestTimestamp(tens, Number.MAX_SAFE_INTEGER)).toBe(90)
  })

  it('handles non integers', () => {
    expect(nearestTimestamp(tens, 44.87628090023)).toBe(40)
  })

  it('handles single item arrays', () => {
    expect(nearestTimestamp([25], 55)).toBe(25)
  })

  it('handles dual item arrays', () => {
    expect(nearestTimestamp([25, 75], 55)).toBe(75)
  })

  it('returns the hover value when the array is empty', () => {
    expect(nearestTimestamp([], 55)).toBe(55)
  })
})
