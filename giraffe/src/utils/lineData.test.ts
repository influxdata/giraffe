import {DomainLabel} from '../types'
import {getDomainDataFromLines, simplifyBandData} from './lineData'
import {getLinearScale} from './getLinearScale'

describe('lineData', () => {
  describe('get domain data from line data', () => {
    const lineData = {
      0: {
        xs: [],
        ys: [],
        fill: 'some color',
      },
    }
    it('should return an empty array when line data has no domain values', () => {
      expect(getDomainDataFromLines(lineData, [], DomainLabel.X)).toEqual([])
      expect(getDomainDataFromLines(lineData, [], DomainLabel.Y)).toEqual([])

      lineData[1] = {xs: [], ys: [], fill: []}
      expect(getDomainDataFromLines(lineData, [], DomainLabel.X)).toEqual([])
      expect(getDomainDataFromLines(lineData, [], DomainLabel.Y)).toEqual([])
    })
    it('should return an array of domain values in order by group number', () => {
      lineData[0] = {xs: [100, 101], ys: [1, 2, 3, 4], fill: 'a color 1'}
      lineData[1] = {xs: [100, 101], ys: [5, 6, 7, 8], fill: 'a color 2'}
      expect(
        getDomainDataFromLines(lineData, [0, 0, 1, 1], DomainLabel.X)
      ).toEqual([100, 101, 100, 101])
      expect(
        getDomainDataFromLines(
          lineData,
          [0, 0, 0, 0, 1, 1, 1, 1],
          DomainLabel.Y
        )
      ).toEqual([1, 2, 3, 4, 5, 6, 7, 8])

      lineData[2] = {xs: [], ys: [], fill: 'a color 3'}
      expect(
        getDomainDataFromLines(lineData, [0, 0, 1, 1], DomainLabel.X)
      ).toEqual([100, 101, 100, 101])
      expect(
        getDomainDataFromLines(
          lineData,
          [0, 0, 0, 0, 1, 1, 1, 1],
          DomainLabel.Y
        )
      ).toEqual([1, 2, 3, 4, 5, 6, 7, 8])
    })
  })

  describe('simplifyBandData', () => {
    const xScale = getLinearScale(0, 100, 0, 1200)

    const NOW = new Date().getTime()
    const TWENTY_FOUR_HOURS_FROM_NOW = NOW + 1000 * 60 * 60 * 24
    const yScale = getLinearScale(NOW, TWENTY_FOUR_HOURS_FROM_NOW, 800, 0)

    it('returns the same number of points that it receives for each line', () => {
      const lineData = {
        0: {
          fill: '#31C0F6',
          xs: [
            NOW + 1000 * 60 * 60 * 1,
            NOW + 1000 * 60 * 60 * 2,
            NOW + 1000 * 60 * 60 * 3,
            NOW + 1000 * 60 * 60 * 4,
            NOW + 1000 * 60 * 60 * 5,
          ],
          ys: [77, 60, 33, 63, 71],
        },
        1: {
          fill: '#31C0F6',
          xs: [
            NOW + 1000 * 60 * 60 * 1,
            NOW + 1000 * 60 * 60 * 2,
            NOW + 1000 * 60 * 60 * 3,
            NOW + 1000 * 60 * 60 * 4,
            NOW + 1000 * 60 * 60 * 5,
          ],
          ys: [25, 40, 32, 22, 58],
        },
        2: {
          fill: '#31C0F6',
          xs: [
            NOW + 1000 * 60 * 60 * 1,
            NOW + 1000 * 60 * 60 * 2,
            NOW + 1000 * 60 * 60 * 3,
            NOW + 1000 * 60 * 60 * 4,
            NOW + 1000 * 60 * 60 * 5,
          ],
          ys: [22, 31, 9, 13, 44],
        },
      }

      const result = simplifyBandData(lineData, xScale, yScale)
      expect(result[0].xs.length).toEqual(lineData[0].xs.length)
      expect(result[0].ys.length).toEqual(lineData[0].ys.length)

      expect(result[1].xs.length).toEqual(lineData[1].xs.length)
      expect(result[1].ys.length).toEqual(lineData[1].ys.length)

      expect(result[2].xs.length).toEqual(lineData[2].xs.length)
      expect(result[2].ys.length).toEqual(lineData[2].ys.length)
    })
  })
})
