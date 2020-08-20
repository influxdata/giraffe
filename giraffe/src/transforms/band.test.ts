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
    it('creates a map with no indices when the column map is empty', () => {
      expect(getBandIndexMap({columnKeys: null, mappings: null})).toEqual({
        maxIndices: [],
        minIndices: [],
        rowIndices: [],
      })
      expect(
        getBandIndexMap({columnKeys: undefined, mappings: undefined})
      ).toEqual({
        maxIndices: [],
        minIndices: [],
        rowIndices: [],
      })
      expect(getBandIndexMap({columnKeys: [], mappings: []})).toEqual({
        maxIndices: [],
        minIndices: [],
        rowIndices: [],
      })
    })

    it('creates a map with indices that are in the same position for the same band per column type', () => {
      expect(getBandIndexMap(columnMap)).toEqual({
        maxIndices: [0, 1],
        minIndices: [2, 3],
        rowIndices: [5, 4],
      })
    })
  })

  describe('creates a map of unique identifiers for the bands and indices of their data', () => {
    it('creates no indentifiers when the column map is empty', () => {
      expect(
        groupLineIndicesIntoBands({columnKeys: null, mappings: null})
      ).toEqual({})
      expect(
        groupLineIndicesIntoBands({columnKeys: undefined, mappings: undefined})
      ).toEqual({})
      expect(groupLineIndicesIntoBands({columnKeys: [], mappings: []})).toEqual(
        {}
      )
    })

    it('creates identifiers when given a column map', () => {
      expect(groupLineIndicesIntoBands(columnMap)).toEqual({
        usage_systemcpucpu0localhost: {min: 3, max: 1, row: 4},
        usage_systemcpucpu1localhost: {min: 2, max: 0, row: 5},
      })
    })
  })

  describe('creates the bands to be rendered', () => {
    it('creates a line with min and max when they are available in the lineData', () => {
      const fill = {
        columnKeys: ['result', '_field', '_measurement', 'cpu', 'host'],
        mappings: [
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
            result: 'max',
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
            result: 'max',
            _field: 'usage_system',
            _measurement: 'cpu',
          },
        ],
      }
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
      const cyan = 'rgb(49, 192, 246)'
      const bandFillColors = [
        cyan,
        'rgb(78, 145, 226)',
        'rgb(106, 103, 205)',
        'rgb(134, 70, 182)',
        'rgb(161, 53, 158)',
        'rgb(186, 54, 130)',
        'rgb(209, 70, 101)',
        'rgb(232, 95, 70)',
        'rgb(255, 126, 39)',
      ]
      const result = getBands(fill, lineData, bandFillColors)
      expect(Array.isArray(result)).toEqual(true)
      expect(result[0].fill).toEqual(cyan)
      expect(result[0].min).toBeDefined()
      expect(result[0].max).toBeDefined()
    })

    it('creates a line without the min or max when corresponding min or max is missing from lineData', () => {
      const fill = {
        columnKeys: ['result', '_field', '_measurement', 'cpu', 'host'],
        mappings: [
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
            result: 'max',
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
          {
            cpu: 'cpu2',
            host: 'localhost',
            result: 'mean',
            _field: 'usage_system',
            _measurement: 'cpu',
          },
        ],
      }
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
      const cyan = 'rgb(49, 192, 246)'
      const babyBlue = 'rgb(78, 145, 226)'
      const purple = 'rgb(106, 103, 205)'
      const bandFillColors = [
        cyan,
        babyBlue,
        purple,
        'rgb(134, 70, 182)',
        'rgb(161, 53, 158)',
        'rgb(186, 54, 130)',
        'rgb(209, 70, 101)',
        'rgb(232, 95, 70)',
        'rgb(255, 126, 39)',
      ]
      const result = getBands(fill, lineData, bandFillColors)
      expect(Array.isArray(result)).toEqual(true)

      expect(result[0].fill).toEqual(cyan)
      expect(result[0].min).toBeUndefined()
      expect(result[0].max).toBeDefined()

      expect(result[1].fill).toEqual(babyBlue)
      expect(result[1].min).toBeDefined()
      expect(result[1].max).toBeUndefined()

      expect(result[2].fill).toEqual(purple)
      expect(result[2].min).toBeUndefined()
      expect(result[2].max).toBeUndefined()
    })
  })

  describe('aligns min and max columns to have same length as band', () => {
    it('returns the line data unaltered when no row indices (no bands) are present', () => {
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
        maxIndices: [],
        minIndices: [],
        rowIndices: [],
      }

      expect(alignMinMaxWithBand(lineData, bandIndexMap)).toEqual(lineData)
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
        maxIndices: [0],
        minIndices: [1],
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
        maxIndices: [0, 1],
        minIndices: [2, 3],
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
    })
  })
})
