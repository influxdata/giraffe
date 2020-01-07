import {FormatterType} from '../types'
import {getTicks} from './getTicks'

jest.mock('./getTextMetrics')

describe('getTicks', () => {
  const charHeight = 12
  const font = '10px sans-serif'

  describe('vertical axis', () => {
    const laptopScreenHeight = 788
    const formatter = (num: number): string => `${num} foo`
    const domain = [0, 100]
    const result = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]

    it('should give the correct number of ticks', () => {
      expect(
        getTicks(domain, laptopScreenHeight, charHeight, font, formatter)
      ).toEqual(result)
    })
    it('should handle extreme or unusual inputs', () => {
      expect(getTicks(domain, 0, charHeight, font, formatter)).toEqual([])
      expect(getTicks(domain, laptopScreenHeight, 0, font, formatter)).toEqual(
        []
      )
      expect(
        getTicks([0, 0], laptopScreenHeight, charHeight, font, formatter)
      ).toEqual([0])
      expect(
        getTicks(domain, laptopScreenHeight, charHeight, font, formatter)
      ).toEqual(result)
    })
  })

  describe('horizontal axis', () => {
    const axisLength = 1380
    const formatter = (num: number): string => new Date(num).toDateString()
    formatter._GIRAFFE_FORMATTER_TYPE = FormatterType.Time
    const domain = [1578355945276, 1578357085276]
    const result = [
      1578355950000,
      1578355980000,
      1578356010000,
      1578356040000,
      1578356070000,
      1578356100000,
      1578356130000,
      1578356160000,
      1578356190000,
      1578356220000,
      1578356250000,
      1578356280000,
      1578356310000,
      1578356340000,
      1578356370000,
      1578356400000,
      1578356430000,
      1578356460000,
      1578356490000,
      1578356520000,
      1578356550000,
      1578356580000,
      1578356610000,
      1578356640000,
      1578356670000,
      1578356700000,
      1578356730000,
      1578356760000,
      1578356790000,
      1578356820000,
      1578356850000,
      1578356880000,
      1578356910000,
      1578356940000,
      1578356970000,
      1578357000000,
      1578357030000,
      1578357060000,
    ]
    it('should give the correct number of ticks', () => {
      expect(getTicks(domain, axisLength, charHeight, font, formatter)).toEqual(
        result
      )
    })
    it('should handle extreme or unusual inputs', () => {
      expect(getTicks(domain, 0, charHeight, font, formatter)).toEqual([])
      expect(getTicks([0, 0], axisLength, charHeight, font, formatter)).toEqual(
        [0]
      )
      expect(getTicks(domain, axisLength, 0, font, formatter)).toEqual(result)
      expect(
        getTicks(domain, axisLength, 100000000000000000, font, formatter)
      ).toEqual(result)
      expect(getTicks(domain, axisLength, charHeight, font, formatter)).toEqual(
        result
      )
      expect(
        getTicks(domain, axisLength / 2, charHeight, font, formatter).length
      ).toBeLessThan(result.length)
      expect(getTicks(domain, 0, charHeight, font, formatter).length).toEqual(0)
    })
  })
})
