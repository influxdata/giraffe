import {DomainLabel} from '../types'
import {getPreviousDomainNextValue} from './line'

describe('line transform utils', () => {
  describe('get cumulative value from domain data', () => {
    const lineData = {
      0: {
        xs: [1554308748000, 1554308948000, 1554309628000],
        ys: [35, 10, 20],
        fill: 'yes',
      },
    }
    it('should return 0 when line data has only 1 line', () => {
      expect(getPreviousDomainNextValue(lineData, 0, DomainLabel.X)).toEqual(0)
      expect(getPreviousDomainNextValue(lineData, 0, DomainLabel.Y)).toEqual(0)
    })
    it('should return 0 when previous domain value does not exist', () => {
      lineData[0] = {xs: [], ys: [], fill: 'yes'}
      lineData[1] = {xs: [10, 20, 30], ys: [5, 6, 7], fill: 'yup'}
      expect(getPreviousDomainNextValue(lineData, 1, DomainLabel.X)).toEqual(0)
      expect(getPreviousDomainNextValue(lineData, 1, DomainLabel.Y)).toEqual(0)
    })
    it('should return 0 when group ID does not exist in the line data', () => {
      lineData[0] = {xs: [10, 20, 30], ys: [2, 4, 6], fill: 'yes'}
      lineData[1] = {xs: [10, 20], ys: [1, 3], fill: 'yup'}
      expect(getPreviousDomainNextValue(lineData, 2, DomainLabel.X)).toEqual(0)
      expect(getPreviousDomainNextValue(lineData, 13, DomainLabel.X)).toEqual(0)
      expect(getPreviousDomainNextValue(lineData, 40, DomainLabel.X)).toEqual(0)
      expect(getPreviousDomainNextValue(lineData, 2, DomainLabel.Y)).toEqual(0)
      expect(getPreviousDomainNextValue(lineData, 38, DomainLabel.Y)).toEqual(0)
      expect(getPreviousDomainNextValue(lineData, 104, DomainLabel.Y)).toEqual(
        0
      )
    })
    it('should return 0 when group ID minus 1 does not exist in the line data', () => {
      lineData[99] = {xs: [10, 20], ys: [1, 3], fill: 'whoa'}
      expect(getPreviousDomainNextValue(lineData, 10, DomainLabel.X)).toEqual(0)
      expect(getPreviousDomainNextValue(lineData, 10, DomainLabel.Y)).toEqual(0)
    })
    it('should return 0 when previous and current domains are same length', () => {
      lineData[0] = {xs: [10, 20, 30], ys: [2, 4, 6], fill: 'yes'}
      lineData[1] = {xs: [10, 20, 30], ys: [1, 3, 5], fill: 'yup'}
      expect(getPreviousDomainNextValue(lineData, 1, DomainLabel.X)).toEqual(0)
      expect(getPreviousDomainNextValue(lineData, 1, DomainLabel.Y)).toEqual(0)
    })
    it('should return 0 when current domain is longer', () => {
      lineData[0] = {xs: [10, 20, 30], ys: [2, 4, 6], fill: 'yes'}
      lineData[1] = {xs: [10, 20, 30, 40], ys: [1, 3, 5, 7], fill: 'yup'}
      expect(getPreviousDomainNextValue(lineData, 1, DomainLabel.X)).toEqual(0)
      expect(getPreviousDomainNextValue(lineData, 1, DomainLabel.Y)).toEqual(0)

      lineData[1][DomainLabel.X].push(50)
      lineData[1][DomainLabel.Y].push(9)
      expect(getPreviousDomainNextValue(lineData, 1, DomainLabel.X)).toEqual(0)
      expect(getPreviousDomainNextValue(lineData, 1, DomainLabel.Y)).toEqual(0)

      lineData[1][DomainLabel.X].push(60)
      lineData[1][DomainLabel.X].push(70)
      lineData[1][DomainLabel.X].push(80)
      lineData[1][DomainLabel.Y].push(11)
      lineData[1][DomainLabel.Y].push(13)
      lineData[1][DomainLabel.Y].push(15)
      expect(getPreviousDomainNextValue(lineData, 1, DomainLabel.X)).toEqual(0)
      expect(getPreviousDomainNextValue(lineData, 1, DomainLabel.Y)).toEqual(0)
    })
    it('should return the corresponding next value of previous domain when current domain is shorter', () => {
      lineData[0] = {xs: [10, 20, 30, 40], ys: [2, 4, 6, 8], fill: 'yes'}
      lineData[1] = {xs: [10, 20, 30], ys: [1, 3, 5], fill: 'yup'}
      expect(getPreviousDomainNextValue(lineData, 1, DomainLabel.X)).toEqual(40)
      expect(getPreviousDomainNextValue(lineData, 1, DomainLabel.Y)).toEqual(8)

      lineData[0][DomainLabel.X].push(50)
      lineData[0][DomainLabel.Y].push(10)
      expect(getPreviousDomainNextValue(lineData, 1, DomainLabel.X)).toEqual(40)
      expect(getPreviousDomainNextValue(lineData, 1, DomainLabel.Y)).toEqual(8)

      lineData[0][DomainLabel.X].push(60)
      lineData[0][DomainLabel.X].push(70)
      lineData[0][DomainLabel.X].push(80)
      lineData[0][DomainLabel.Y].push(12)
      lineData[0][DomainLabel.Y].push(14)
      lineData[0][DomainLabel.Y].push(16)
      expect(getPreviousDomainNextValue(lineData, 1, DomainLabel.X)).toEqual(40)
      expect(getPreviousDomainNextValue(lineData, 1, DomainLabel.Y)).toEqual(8)
    })
  })
})
