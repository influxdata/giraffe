import {FormatterType} from '../types'
import {TIME, VALUE} from '../constants/columnKeys'
import {
  calculateTicks,
  generateTicks,
  getVerticalTicks,
  getHorizontalTicks,
} from './getTicks'

jest.mock('./textMetrics')

describe('utils/getTicks', () => {
  const font = '10px sans-serif'

  describe('generateTicks', () => {
    describe('value ticks', () => {
      const valueDomain = [1, 300]
      const timeDomain = [1603333737559, 1603334037559]

      it('should handle unusual domain values', () => {
        expect(generateTicks([], VALUE, NaN, NaN, NaN).length).toEqual(0)
        expect(generateTicks([NaN, NaN], VALUE, NaN, NaN, NaN).length).toEqual(
          0
        )
        expect(
          generateTicks([null, null], VALUE, NaN, NaN, NaN).length
        ).toEqual(0)

        expect(generateTicks([100, 0], VALUE, NaN, NaN, NaN).length).toEqual(0)

        expect(generateTicks([100, 99], VALUE, 1, 100, -50).length).toEqual(0)

        expect(generateTicks([100, 100], VALUE, 1, 100, -50).length).toEqual(1)
        expect(generateTicks([0, 0], VALUE, 1, 100, -0.01).length).toEqual(1)
      })

      it('should generate no ticks when total ticks, tick start, and tick step are not finite numbers', () => {
        expect(generateTicks(valueDomain, VALUE, NaN, NaN, NaN).length).toEqual(
          0
        )
        expect(
          generateTicks(valueDomain, VALUE, null, null, null).length
        ).toEqual(0)
        expect(
          generateTicks(valueDomain, VALUE, Infinity, Infinity, Infinity).length
        ).toEqual(0)
        expect(
          generateTicks(valueDomain, VALUE, -Infinity, -Infinity, -Infinity)
            .length
        ).toEqual(0)
      })

      it('should generate exactly the total ticks when given the total ticks, but no tick start and no tick step', () => {
        expect(
          generateTicks(valueDomain, VALUE, 10, null, null).length
        ).toEqual(10)

        expect(generateTicks(timeDomain, TIME, 10, null, null).length).toEqual(
          10
        )
      })

      it('should generate no ticks when given only a tick start, but no total ticks and no tick step', () => {
        const [start, end] = valueDomain
        let tickStart = (end - start) / 2
        expect(
          generateTicks(valueDomain, VALUE, null, tickStart, null).length
        ).toEqual(0)

        tickStart = start
        expect(
          generateTicks(valueDomain, VALUE, null, tickStart, null).length
        ).toEqual(0)

        tickStart = start + 1
        expect(
          generateTicks(valueDomain, VALUE, null, tickStart, null).length
        ).toEqual(0)

        tickStart = end
        expect(
          generateTicks(valueDomain, VALUE, null, tickStart, null).length
        ).toEqual(0)

        tickStart = end - 1
        expect(
          generateTicks(valueDomain, VALUE, null, tickStart, null).length
        ).toEqual(0)
      })

      it('should generate ticks accordingly when given a tick step, but no total ticks and no tick start', () => {
        const [start, end] = valueDomain
        let tickStep = (end - start) / 10
        let result = generateTicks(valueDomain, VALUE, null, null, tickStep)
        expect(result.length).toBeGreaterThan(0)

        tickStep = (end - start) / 11
        result = generateTicks(valueDomain, VALUE, null, null, tickStep)
        expect(result.length).toBeGreaterThan(0)

        tickStep = end - start
        result = generateTicks(valueDomain, VALUE, null, null, tickStep)
        expect(result.length).toBeGreaterThan(0)

        tickStep = end - start + 1
        expect(
          generateTicks(valueDomain, VALUE, null, null, tickStep).length
        ).toEqual(0)

        expect(() => {
          tickStep = 0
          expect(
            generateTicks(valueDomain, VALUE, null, null, tickStep).length
          ).toEqual(0)
        }).not.toThrow()

        tickStep = -10
        expect(
          generateTicks(valueDomain, VALUE, null, null, tickStep).length
        ).toEqual(0)

        tickStep = -1000
        expect(
          generateTicks(timeDomain, TIME, null, null, tickStep).length
        ).toEqual(0)
      })

      it('should generate ticks when given the total ticks, a tick start, but no tick step', () => {
        const totalTicks = 10
        let result = generateTicks(
          valueDomain,
          VALUE,
          totalTicks,
          valueDomain[0],
          null
        )
        expect(result.length).toBeGreaterThan(0)
        expect(result.length).toBeLessThanOrEqual(totalTicks)

        result = generateTicks(
          timeDomain,
          TIME,
          totalTicks,
          timeDomain[0],
          null
        )
        expect(result.length).toBeGreaterThan(0)
        expect(result.length).toBeLessThanOrEqual(totalTicks)

        result = generateTicks(
          valueDomain,
          VALUE,
          totalTicks,
          valueDomain[1] - 1,
          null
        )
        expect(result.length).toBeGreaterThan(0)
        expect(result.length).toBeLessThanOrEqual(totalTicks)
      })

      it('should generate ticks accordingly when given total ticks, a tick step, but no tick start', () => {
        const totalTicks = 10
        const [start, end] = valueDomain
        const [timeStart, timeEnd] = timeDomain
        let tickStep = (end - start) / totalTicks
        let result = generateTicks(
          valueDomain,
          VALUE,
          totalTicks,
          null,
          tickStep
        )
        expect(result.length).toBeGreaterThan(0)
        expect(result.length).toBeLessThanOrEqual(totalTicks)

        tickStep = (timeEnd - timeStart) / totalTicks
        result = generateTicks(timeDomain, TIME, totalTicks, null, tickStep)
        expect(result.length).toBeGreaterThan(0)
        expect(result.length).toBeLessThanOrEqual(totalTicks)

        tickStep = (end - start) / (totalTicks + 1)
        result = generateTicks(valueDomain, VALUE, totalTicks, null, tickStep)
        expect(result.length).toBeGreaterThan(0)
        expect(result.length).toBeLessThanOrEqual(totalTicks)

        tickStep = end - start
        result = generateTicks(valueDomain, VALUE, totalTicks, null, tickStep)
        expect(result.length).toBeGreaterThan(0)
        expect(result.length).toBeLessThanOrEqual(totalTicks)

        tickStep = ((end - start) / (totalTicks + 1)) * -1
        expect(
          generateTicks(valueDomain, VALUE, totalTicks, null, tickStep).length
        ).toEqual(0)

        tickStep = ((timeEnd - timeStart) / (totalTicks + 1)) * -1
        expect(
          generateTicks(timeDomain, TIME, totalTicks, null, tickStep).length
        ).toEqual(0)

        tickStep = end - start + 1
        expect(
          generateTicks(valueDomain, VALUE, totalTicks, null, tickStep).length
        ).toEqual(0)
      })

      it('should generate ticks accordingly when given total ticks, tick start, and tick step', () => {
        const [start, end] = valueDomain
        const [timeStart, timeEnd] = timeDomain
        let totalTicks = 10
        let tickStart = start
        let tickStep = (end - start) / totalTicks
        let result = generateTicks(
          valueDomain,
          VALUE,
          totalTicks,
          tickStart,
          tickStep
        )
        expect(result.length).toBeGreaterThan(0)
        expect(result.length).toBeLessThanOrEqual(totalTicks)

        tickStart = timeStart
        tickStep = (timeEnd - timeStart) / totalTicks
        result = generateTicks(
          timeDomain,
          TIME,
          totalTicks,
          tickStart,
          tickStep
        )
        expect(result.length).toBeGreaterThan(0)
        expect(result.length).toBeLessThanOrEqual(totalTicks)

        totalTicks = 10
        tickStart = end
        tickStep = ((end - start) / (totalTicks + 1)) * -1
        result = generateTicks(
          valueDomain,
          VALUE,
          totalTicks,
          tickStart,
          tickStep
        )
        expect(result.length).toBeGreaterThan(0)
        expect(result.length).toBeLessThanOrEqual(totalTicks)

        tickStart = timeEnd
        tickStep = ((timeEnd - timeStart) / (totalTicks + 1)) * -1
        result = generateTicks(
          timeDomain,
          TIME,
          totalTicks,
          tickStart,
          tickStep
        )
        expect(result.length).toBeGreaterThan(0)
        expect(result.length).toBeLessThanOrEqual(totalTicks)

        expect(() => {
          tickStep = 0
          expect(
            generateTicks(valueDomain, VALUE, totalTicks, tickStart, tickStep)
              .length
          ).toEqual(0)
        }).not.toThrow()

        totalTicks = 1
        tickStart = start
        tickStep = 0.01
        result = generateTicks(
          valueDomain,
          VALUE,
          totalTicks,
          tickStart,
          tickStep
        )
        expect(result.length).toEqual(totalTicks)

        totalTicks = 1
        tickStart = timeDomain[0]
        tickStep = 1
        result = generateTicks(
          timeDomain,
          TIME,
          totalTicks,
          tickStart,
          tickStep
        )
        expect(result.length).toEqual(totalTicks)

        totalTicks = 15
        tickStart = start - 1
        tickStep = end - start + 1
        result = generateTicks(
          valueDomain,
          VALUE,
          totalTicks,
          tickStart,
          tickStep
        )
        expect(result.length).toEqual(1)
      })
    })
  })

  describe('calculateTicks', () => {
    describe('time ticks', () => {
      const columnKey = TIME

      it('should handle fewer than 4 time ticks', () => {
        const timeDomain = [1586382921737, 1586384061737]
        const rangeLength = 1200
        const tickSize = 110
        const result = [1586383200000, 1586383500000, 1586383800000]
        expect(
          calculateTicks(timeDomain, rangeLength, tickSize, columnKey)
        ).toEqual(result)
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
        expect(
          calculateTicks(timeDomain, rangeLength, tickSize, columnKey)
        ).toEqual(result)

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
        expect(
          calculateTicks(timeDomain, rangeLength, tickSize, columnKey)
        ).toEqual(result)
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
        expect(
          calculateTicks(timeDomain, rangeLength, tickSize, columnKey)
        ).toEqual(result)
      })
    })

    describe('value ticks', () => {
      const columnKey = VALUE

      it('should handle fewer than 4 ticks', () => {
        const valueDomain = [1, 300]
        const rangeLength = 1116
        const tickSize = 172
        const result = [100, 200, 300]
        expect(
          calculateTicks(valueDomain, rangeLength, tickSize, columnKey)
        ).toEqual(result)
      })

      it('should handle 4 to 10 ticks', () => {
        const valueDomain = [1, 300]
        const rangeLength = 1116
        const tickSize = 86
        const result = [50, 100, 150, 200, 250, 300]
        expect(
          calculateTicks(valueDomain, rangeLength, tickSize, columnKey)
        ).toEqual(result)
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
        expect(
          calculateTicks(valueDomain, rangeLength, tickSize, columnKey)
        ).toEqual(result)
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
