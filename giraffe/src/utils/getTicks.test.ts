import {FormatterType} from '../types'
import {TIME, VALUE} from '../constants/columnKeys'
import {getTicks, getVerticalTicks, getHorizontalTicks} from './getTicks'

jest.mock('./getTextMetrics')

describe('utils/getTicks', () => {
  const font = '10px sans-serif'

  describe('getTicks', () => {
    describe('time ticks', () => {
      const columnKey = TIME

      it('should handle fewer than 4 time ticks', () => {
        const timeDomain = [1586382921737, 1586384061737]
        const rangeLength = 1200
        const tickSize = 110
        const result = [1586383200000, 1586383500000, 1586383800000]
        expect(getTicks(timeDomain, rangeLength, tickSize, columnKey)).toEqual(
          result
        )
      })

      it('should handle 4 to 10 time ticks', () => {
        let timeDomain = [1586383757747, 1586384897747]
        let rangeLength = 1131
        let tickSize = 116
        let result = [
          1586383800000,
          1586384100000,
          1586384400000,
          1586384700000,
        ]
        expect(getTicks(timeDomain, rangeLength, tickSize, columnKey)).toEqual(
          result
        )

        timeDomain = [1586384617834, 1586385140120]
        rangeLength = 1042
        tickSize = 62
        result = [
          1586384640000,
          1586384700000,
          1586384760000,
          1586384820000,
          1586384880000,
          1586384940000,
          1586385000000,
          1586385060000,
          1586385120000,
        ]
        expect(getTicks(timeDomain, rangeLength, tickSize, columnKey)).toEqual(
          result
        )
      })

      it('should handle more than 10 ticks', () => {
        const timeDomain = [1586384653177, 1586385793177]
        const rangeLength = 1170
        const tickSize = 39
        const result = [
          1586384700000,
          1586384760000,
          1586384820000,
          1586384880000,
          1586384940000,
          1586385000000,
          1586385060000,
          1586385120000,
          1586385180000,
          1586385240000,
          1586385300000,
          1586385360000,
          1586385420000,
          1586385480000,
          1586385540000,
          1586385600000,
          1586385660000,
          1586385720000,
          1586385780000,
        ]
        expect(getTicks(timeDomain, rangeLength, tickSize, columnKey)).toEqual(
          result
        )
      })
    })

    describe('value ticks', () => {
      const columnKey = VALUE

      it('should handle fewer than 4 time ticks', () => {
        const valueDomain = [1, 300]
        const rangeLength = 1116
        const tickSize = 172
        const result = [100, 200, 300]
        expect(getTicks(valueDomain, rangeLength, tickSize, columnKey)).toEqual(
          result
        )
      })

      it('should handle 4 to 10 time ticks', () => {
        const valueDomain = [1, 300]
        const rangeLength = 1116
        const tickSize = 86
        const result = [50, 100, 150, 200, 250, 300]
        expect(getTicks(valueDomain, rangeLength, tickSize, columnKey)).toEqual(
          result
        )
      })

      it('should handle more than 10 ticks', () => {
        const valueDomain = [1, 300]
        const rangeLength = 1116
        const tickSize = 47
        const result = [
          20,
          40,
          60,
          80,
          100,
          120,
          140,
          160,
          180,
          200,
          220,
          240,
          260,
          280,
          300,
        ]
        expect(getTicks(valueDomain, rangeLength, tickSize, columnKey)).toEqual(
          result
        )
      })
    })
  })

  describe('vertical axis', () => {
    const laptopScreenHeight = 788
    const formatter = (num: number): string => `${num} foo`
    const domain = [0, 100]
    const result = [
      0,
      5,
      10,
      15,
      20,
      25,
      30,
      35,
      40,
      45,
      50,
      55,
      60,
      65,
      70,
      75,
      80,
      85,
      90,
      95,
      100,
    ]

    it('should give the correct number of ticks', () => {
      expect(
        getVerticalTicks(domain, laptopScreenHeight, font, formatter)
      ).toEqual(result)
    })
    it('should handle 0 domain or screen height', () => {
      expect(getVerticalTicks(domain, 0, font, formatter)).toEqual([])
      expect(
        getVerticalTicks([0, 0], laptopScreenHeight, font, formatter)
      ).toEqual([0])
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
      expect(getHorizontalTicks(domain, axisLength, font, formatter)).toEqual(
        result
      )
    })
    it('should handle 0 domain or screen height', () => {
      expect(getHorizontalTicks([0, 0], axisLength, font, formatter)).toEqual([
        0,
      ])
      expect(getHorizontalTicks(domain, 0, font, formatter).length).toEqual(0)
    })
  })
})
