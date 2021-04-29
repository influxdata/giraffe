import {
  alignMinMaxWithBand,
  getBandIndexMap,
  getBands,
  groupLineIndicesIntoBands,
} from './band'

describe('band transform utils', () => {
  const columnMap = {
    columnKeys: ['result', '_field', '_measurement', 'cpu', 'host'],
    mappings: [
      {
        cpu: 'cpu1',
        host: 'localhost',
        result: 'max',
        _field: 'usage_system',
        _measurement: 'cpu',
      },
      {
        cpu: 'cpu0',
        host: 'localhost',
        result: 'max',
        _field: 'usage_system',
        _measurement: 'cpu',
      },
      {
        cpu: 'cpu1',
        host: 'localhost',
        result: 'min',
        _field: 'usage_system',
        _measurement: 'cpu',
      },
      {
        cpu: 'cpu0',
        host: 'localhost',
        result: 'min',
        _field: 'usage_system',
        _measurement: 'cpu',
      },
      {
        cpu: 'cpu0',
        host: 'localhost',
        result: 'mean',
        _field: 'usage_system',
        _measurement: 'cpu',
      },
      {
        cpu: 'cpu1',
        host: 'localhost',
        result: 'mean',
        _field: 'usage_system',
        _measurement: 'cpu',
      },
    ],
  }

  describe('creates a map of indices by column type for all columns', () => {
    it('creates a map with null indices when the named columns are not found', () => {
      expect(getBandIndexMap(columnMap, 'lower', 'median', 'upper')).toEqual({
        upperIndices: [null, null],
        lowerIndices: [null, null],
        rowIndices: [null, null],
      })
      expect(getBandIndexMap(columnMap, '', '', '')).toEqual({
        upperIndices: [null, null],
        lowerIndices: [null, null],
        rowIndices: [null, null],
      })
    })

    it('creates a map with no indices when the column map is empty', () => {
      expect(
        getBandIndexMap(
          {columnKeys: null, mappings: null},
          'min',
          'mean',
          'max'
        )
      ).toEqual({
        upperIndices: [],
        lowerIndices: [],
        rowIndices: [],
      })
      expect(
        getBandIndexMap(
          {columnKeys: undefined, mappings: undefined},
          'min',
          'mean',
          'max'
        )
      ).toEqual({
        upperIndices: [],
        lowerIndices: [],
        rowIndices: [],
      })
      expect(
        getBandIndexMap({columnKeys: [], mappings: []}, 'min', 'mean', 'max')
      ).toEqual({
        upperIndices: [],
        lowerIndices: [],
        rowIndices: [],
      })
    })

    it('creates a map with indices that are in the same position for the same band per column type', () => {
      expect(getBandIndexMap(columnMap, 'min', 'mean', 'max')).toEqual({
        upperIndices: [0, 1],
        lowerIndices: [2, 3],
        rowIndices: [5, 4],
      })
    })
  })

  describe('creates a map of unique identifiers for the bands and indices of their data', () => {
    it('creates indentifiers with null values when the named columns are not found', () => {
      expect(
        groupLineIndicesIntoBands(columnMap, 'lower', 'median', 'upper')
      ).toEqual({
        usage_systemcpucpu0localhost: {lower: null, upper: null, row: null},
        usage_systemcpucpu1localhost: {lower: null, upper: null, row: null},
      })
      expect(groupLineIndicesIntoBands(columnMap, '', '', '')).toEqual({
        usage_systemcpucpu0localhost: {lower: null, upper: null, row: null},
        usage_systemcpucpu1localhost: {lower: null, upper: null, row: null},
      })
    })

    it('creates no indentifiers when the column map is empty', () => {
      expect(
        groupLineIndicesIntoBands(
          {columnKeys: null, mappings: null},
          'min',
          'mean',
          'max'
        )
      ).toEqual({})
      expect(
        groupLineIndicesIntoBands(
          {columnKeys: undefined, mappings: undefined},
          'min',
          'mean',
          'max'
        )
      ).toEqual({})
      expect(
        groupLineIndicesIntoBands(
          {columnKeys: [], mappings: []},
          'min',
          'mean',
          'max'
        )
      ).toEqual({})
    })

    it('creates identifiers when given a column map', () => {
      expect(
        groupLineIndicesIntoBands(columnMap, 'min', 'mean', 'max')
      ).toEqual({
        usage_systemcpucpu0localhost: {lower: 3, upper: 1, row: 4},
        usage_systemcpucpu1localhost: {lower: 2, upper: 0, row: 5},
      })
    })
  })

  describe('creates the bands to be rendered', () => {
    it('creates a line with lower and upper when they are available in the lineData', () => {
      const lineData = {
        0: {
          fill: 'rgb(106, 103, 205)',
          xs: [
            0,
            52.00725109558422,
            104.01450219116845,
            156.02175328675267,
            208.0290043823369,
          ],
          ys: [
            76.61205076395663,
            61.825853725468505,
            98.89477906175978,
            73.4646930173073,
            64.65424723502838,
          ],
        },
        1: {
          fill: 'rgb(186, 54, 130',
          xs: [
            0,
            52.00725109558422,
            104.01450219116845,
            156.02175328675267,
            208.0290043823369,
          ],
          ys: [
            76.61205076395663,
            121.77592874278233,
            98.89477906175978,
            101.72034417781009,
            64.65424723502838,
          ],
        },
        2: {
          fill: 'rgb(209, 70, 101)',
          xs: [
            0,
            52.00725109558422,
            104.01450219116845,
            156.02175328675267,
            208.0290043823369,
          ],
          ys: [
            76.61205076395663,
            91.8008912341254,
            98.89477906175978,
            87.59251859755864,
            64.65424723502838,
          ],
        },
      }
      const bandIndexMap = {
        upperIndices: [2],
        rowIndices: [0],
        lowerIndices: [1],
      }

      const result = getBands(lineData, bandIndexMap)
      expect(Array.isArray(result)).toEqual(true)
      expect(result[0].fill).toEqual(lineData[0].fill)
      expect(result[0].lower).toBeDefined()
      expect(result[0].upper).toBeDefined()
    })

    it('creates a line without the lower or upper when corresponding lower or upper is missing from lineData', () => {
      const lineData = {
        0: {
          fill: 'rgb(106, 103, 205)',
          xs: [
            0,
            52.00725109558422,
            104.01450219116845,
            156.02175328675267,
            208.0290043823369,
          ],
          ys: [
            76.61205076395663,
            61.825853725468505,
            98.89477906175978,
            73.4646930173073,
            64.65424723502838,
          ],
        },
        1: {
          fill: 'rgb(186, 54, 130',
          xs: [
            0,
            52.00725109558422,
            104.01450219116845,
            156.02175328675267,
            208.0290043823369,
          ],
          ys: [
            76.61205076395663,
            121.77592874278233,
            98.89477906175978,
            101.72034417781009,
            64.65424723502838,
          ],
        },
        2: {
          fill: 'rgb(209, 70, 101)',
          xs: [
            0,
            52.00725109558422,
            104.01450219116845,
            156.02175328675267,
            208.0290043823369,
          ],
          ys: [
            76.61205076395663,
            91.8008912341254,
            98.89477906175978,
            87.59251859755864,
            64.65424723502838,
          ],
        },
        3: {
          fill: 'rgb(134, 70, 182)',
          xs: [
            0,
            52.00725109558422,
            104.01450219116845,
            156.02175328675267,
            208.0290043823369,
          ],
          ys: [
            361.6723348544358,
            361.6723348544358,
            367.2923527579312,
            364.49789997048606,
            356.02120462233523,
          ],
        },
        4: {
          fill: 'rgb(232, 95, 70)',
          xs: [
            0,
            52.00725109558422,
            104.01450219116845,
            156.02175328675267,
            208.0290043823369,
          ],
          ys: [
            361.6723348544358,
            370.14903020258663,
            367.2923527579312,
            373,
            356.02120462233523,
          ],
        },
      }
      const bandIndexMap = {
        upperIndices: [3, null, null],
        rowIndices: [0, 1, 2],
        lowerIndices: [null, 4, null],
      }

      const result = getBands(lineData, bandIndexMap)
      expect(Array.isArray(result)).toEqual(true)

      expect(result[0].fill).toEqual(lineData[0].fill)
      expect(result[0].lower).toBeUndefined()
      expect(result[0].upper).toBeDefined()

      expect(result[1].fill).toEqual(lineData[1].fill)
      expect(result[1].lower).toBeDefined()
      expect(result[1].upper).toBeUndefined()

      expect(result[2].fill).toEqual(lineData[2].fill)
      expect(result[2].lower).toBeUndefined()
      expect(result[2].upper).toBeUndefined()
    })
  })

  describe('aligns min and max columns to have same length as band', () => {
    it('returns an empty object when no row indices (no bands) are present', () => {
      const lineData = {
        0: {
          fill: 'rgb(49, 192, 246)',
          xs: [16.422140713571192],
          ys: [373.73275],
        },
        1: {
          fill: 'rgb(95, 119, 213)',
          xs: [16.422140713571192, 32.844281427142384],
          ys: [373.73275, 304.66375],
        },
        2: {
          fill: 'rgb(140, 66, 177)',
          xs: [16.422140713571192, 32.844281427142384, 49.26642214071357],
          ys: [373.73275, 304.66375, 379.4885],
        },
      }
      const bandIndexMap = {
        upperIndices: [],
        lowerIndices: [],
        rowIndices: [],
      }

      expect(alignMinMaxWithBand(lineData, bandIndexMap)).toEqual({})
    })

    it('returns the updated line data with same length rows when one row index is present', () => {
      const lineData = {
        0: {
          fill: 'rgb(49, 192, 246)',
          xs: [16.422140713571192],
          ys: [373.73275],
        },
        1: {
          fill: 'rgb(95, 119, 213)',
          xs: [16.422140713571192, 32.844281427142384],
          ys: [373.73275, 304.66375],
        },
        2: {
          fill: 'rgb(140, 66, 177)',
          xs: [16.422140713571192, 32.844281427142384, 49.26642214071357],
          ys: [373.73275, 304.66375, 379.4885],
        },
      }
      const bandIndexMap = {
        upperIndices: [0],
        lowerIndices: [1],
        rowIndices: [2],
      }

      expect(alignMinMaxWithBand(lineData, bandIndexMap)).toEqual({
        0: {
          fill: 'rgb(49, 192, 246)',
          xs: [16.422140713571192, 32.844281427142384, 49.26642214071357],
          ys: [373.73275, 304.66375, 379.4885],
        },
        1: {
          fill: 'rgb(95, 119, 213)',
          xs: [16.422140713571192, 32.844281427142384, 49.26642214071357],
          ys: [373.73275, 304.66375, 379.4885],
        },
        2: {
          fill: 'rgb(140, 66, 177)',
          xs: [16.422140713571192, 32.844281427142384, 49.26642214071357],
          ys: [373.73275, 304.66375, 379.4885],
        },
      })

      lineData[2].xs.unshift(0)
      lineData[2].ys.unshift(null)

      expect(alignMinMaxWithBand(lineData, bandIndexMap)).toEqual({
        0: {
          fill: 'rgb(49, 192, 246)',
          xs: [0, 16.422140713571192, 32.844281427142384, 49.26642214071357],
          ys: [null, 373.73275, 304.66375, 379.4885],
        },
        1: {
          fill: 'rgb(95, 119, 213)',
          xs: [0, 16.422140713571192, 32.844281427142384, 49.26642214071357],
          ys: [null, 373.73275, 304.66375, 379.4885],
        },
        2: {
          fill: 'rgb(140, 66, 177)',
          xs: [0, 16.422140713571192, 32.844281427142384, 49.26642214071357],
          ys: [null, 373.73275, 304.66375, 379.4885],
        },
      })
    })

    it('returns the updated line data with same length rows when multiple row indices are present', () => {
      const lineData = {
        0: {
          fill: 'rgb(49, 192, 246)',
          xs: [16.422140713571192],
          ys: [373.73275],
        },
        1: {
          fill: 'red',
          xs: [1, 3],
          ys: [20, 55],
        },
        2: {
          fill: 'rgb(95, 119, 213)',
          xs: [16.422140713571192, 32.844281427142384],
          ys: [373.73275, 304.66375],
        },
        3: {
          fill: 'green',
          xs: [3],
          ys: [25],
        },
        4: {
          fill: 'blue',
          xs: [1, 3, 5, 7, 9],
          ys: [20, 40, 60, 80, 100],
        },
        5: {
          fill: 'rgb(140, 66, 177)',
          xs: [16.422140713571192, 32.844281427142384, 49.26642214071357],
          ys: [373.73275, 304.66375, 379.4885],
        },
      }
      const bandIndexMap = {
        upperIndices: [0, 1],
        lowerIndices: [2, 3],
        rowIndices: [5, 4],
      }

      expect(alignMinMaxWithBand(lineData, bandIndexMap)).toEqual({
        0: {
          fill: 'rgb(49, 192, 246)',
          xs: [16.422140713571192, 32.844281427142384, 49.26642214071357],
          ys: [373.73275, 304.66375, 379.4885],
        },
        1: {
          fill: 'red',
          xs: [1, 3, 5, 7, 9],
          ys: [20, 55, 60, 80, 100],
        },
        2: {
          fill: 'rgb(95, 119, 213)',
          xs: [16.422140713571192, 32.844281427142384, 49.26642214071357],
          ys: [373.73275, 304.66375, 379.4885],
        },
        3: {
          fill: 'green',
          xs: [1, 3, 5, 7, 9],
          ys: [20, 25, 60, 80, 100],
        },
        4: {
          fill: 'blue',
          xs: [1, 3, 5, 7, 9],
          ys: [20, 40, 60, 80, 100],
        },
        5: {
          fill: 'rgb(140, 66, 177)',
          xs: [16.422140713571192, 32.844281427142384, 49.26642214071357],
          ys: [373.73275, 304.66375, 379.4885],
        },
      })

      lineData[4].xs.unshift(0)
      lineData[4].ys.unshift(null)
      lineData[5].xs.push(50)
      lineData[5].ys.push(null)

      expect(alignMinMaxWithBand(lineData, bandIndexMap)).toEqual({
        0: {
          fill: 'rgb(49, 192, 246)',
          xs: [16.422140713571192, 32.844281427142384, 49.26642214071357, 50],
          ys: [373.73275, 304.66375, 379.4885, null],
        },
        1: {
          fill: 'red',
          xs: [0, 1, 3, 5, 7, 9],
          ys: [null, 20, 55, 60, 80, 100],
        },
        2: {
          fill: 'rgb(95, 119, 213)',
          xs: [16.422140713571192, 32.844281427142384, 49.26642214071357, 50],
          ys: [373.73275, 304.66375, 379.4885, null],
        },
        3: {
          fill: 'green',
          xs: [0, 1, 3, 5, 7, 9],
          ys: [null, 20, 25, 60, 80, 100],
        },
        4: {
          fill: 'blue',
          xs: [0, 1, 3, 5, 7, 9],
          ys: [null, 20, 40, 60, 80, 100],
        },
        5: {
          fill: 'rgb(140, 66, 177)',
          xs: [16.422140713571192, 32.844281427142384, 49.26642214071357, 50],
          ys: [373.73275, 304.66375, 379.4885, null],
        },
      })
    })
  })
})
