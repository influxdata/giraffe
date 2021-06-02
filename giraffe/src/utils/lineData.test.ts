import {DomainLabel} from '../types'
import {getDomainDataFromLines} from './lineData'

describe('lineData', () => {
  describe('get domain data from line data', () => {
    const lineData = {
      0: {
        xs: [],
        ys: [],
        fill: 'yes',
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
      lineData[0] = {xs: [100, 101], ys: [1, 2, 3, 4], fill: 'yes'}
      lineData[1] = {xs: [100, 101], ys: [5, 6, 7, 8], fill: 'yup'}
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

      lineData[2] = {xs: [], ys: [], fill: 'yikes'}
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
})
