import {getLineLengths, getBandHoverIndices} from './bandHover'

describe('getBandHoverIndices utils', () => {
  describe('getLineLengths', () => {
    it('handles empty data', () => {
      expect(getLineLengths({})).toEqual({})
    })

    it('creates a map of line lengths and starting indices from line data with same lengths', () => {
      const lineData = {
        0: {
          fill: 'rgb(49, 192, 246)',
          xs: [1597715835000, 1597715850000, 1597715865000],
          ys: [1.4, 1.1988011988011988, 0.8],
        },
        1: {
          fill: 'rgb(140, 66, 177)',
          xs: [1597715835000, 1597715850000, 1597715865000],
          ys: [1.4, 1.001001001001001, 0.8],
        },
        2: {
          fill: 'rgb(255, 126, 39)',
          xs: [1597715835000, 1597715850000, 1597715865000],
          ys: [1.4, 1.0999010999010999, 0.8],
        },
      }
      const result = getLineLengths(lineData)
      expect(Object.keys(result).length).toEqual(Object.keys(lineData).length)
      expect(result[0].length).toEqual(3)
      expect(result[0].startIndex).toEqual(0)
      expect(result[1].length).toEqual(3)
      expect(result[1].startIndex).toEqual(3)
      expect(result[2].length).toEqual(3)
      expect(result[2].startIndex).toEqual(6)
    })

    it('creates a map of line lengths and starting indices from line data with different lengths', () => {
      const lineData = {
        0: {
          fill: 'rgb(49, 192, 246)',
          xs: [1597715835000, 1597715850000, 1597715865000],
          ys: [1.4, 1.1988011988011988, 0.8],
        },
        1: {
          fill: 'rgb(140, 66, 177)',
          xs: [1597715835000, 1597715850000, 1597715865000, 1597715880000],
          ys: [1.4, 1.001001001001001, 0.8, 1.2987012987012987],
        },
        2: {
          fill: 'rgb(255, 126, 39)',
          xs: [
            1597715835000,
            1597715850000,
            1597715865000,
            1597715880000,
            1597715895000,
          ],
          ys: [
            1.4,
            1.0999010999010999,
            0.8,
            1.2987012987012987,
            1.0005005005005005,
          ],
        },
      }
      const result = getLineLengths(lineData)
      expect(Object.keys(result).length).toEqual(Object.keys(lineData).length)
      expect(result[0].length).toEqual(3)
      expect(result[0].startIndex).toEqual(0)
      expect(result[1].length).toEqual(4)
      expect(result[1].startIndex).toEqual(3)
      expect(result[2].length).toEqual(5)
      expect(result[2].startIndex).toEqual(7)
    })
  })

  describe('getBandHoverIndices', () => {
    it('can handle empty data', () => {
      expect(getBandHoverIndices({}, [], [], {})).toEqual({
        rowIndices: [],
        lowerIndices: [],
        upperIndices: [],
      })
    })

    it('creates the band hover indices when data is available', () => {
      const lineLengths = {
        0: {length: 3, startIndex: 0},
        1: {length: 3, startIndex: 3},
        2: {length: 3, startIndex: 6},
        3: {length: 3, startIndex: 9},
        4: {length: 3, startIndex: 12},
        5: {length: 3, startIndex: 15},
        6: {length: 3, startIndex: 18},
        7: {length: 3, startIndex: 21},
        8: {length: 3, startIndex: 24},
      }
      const hoverRowIndices = [6, 3, 0]
      const hoverGroupData = [8, 8, 8, 7, 7, 7, 6, 6, 6]
      const bandLineIndexMap = {
        band1: {upper: 2, lower: 5, row: 6},
        band2: {upper: 1, lower: 4, row: 7},
        band3: {upper: 0, lower: 3, row: 8},
      }
      expect(
        getBandHoverIndices(
          lineLengths,
          hoverRowIndices,
          hoverGroupData,
          bandLineIndexMap
        )
      ).toEqual({
        rowIndices: [18, 21, 24],
        lowerIndices: [15, 12, 9],
        upperIndices: [6, 3, 0],
      })
    })
  })
})
