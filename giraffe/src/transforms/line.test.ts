import {mapCumulativeValuesToTimeRange} from './line'

describe('line transform utils', () => {
  describe('creates a map of every time point with the cumulative values for every line', () => {
    const threeTimePoints = [1582222037067, 1582222097067, 1582222157067]

    it('should have a hash of all the time points when all lines are uniform in length', () => {
      const fillCol = [0, 0, 0, 1, 1, 1, 2, 2, 2]
      const timesCol = [
        ...threeTimePoints,
        ...threeTimePoints,
        ...threeTimePoints,
      ]
      const valuesCol = [2, 2, 3, 1, 6, 4, 7, 8, 5]
      const cumulativeValues = mapCumulativeValuesToTimeRange(
        timesCol,
        valuesCol,
        fillCol
      )
      threeTimePoints.forEach(time =>
        expect(cumulativeValues[time]).toBeTruthy()
      )
      expect(Object.keys(cumulativeValues).length).toEqual(
        threeTimePoints.length
      )
    })

    it('should have a hash of all the time points when lines have different lengths', () => {
      const fillCol = [0, 0, 1, 1, 1, 1, 2, 2, 2]
      const fourthTimePoint = 1582222217067
      const timesCol = [
        ...threeTimePoints.slice(1),
        ...threeTimePoints,
        fourthTimePoint,
        ...threeTimePoints,
      ]
      const valuesCol = [5, 8, 19, 48, 35, 29, 10, 1, 23]
      const cumulativeValues = mapCumulativeValuesToTimeRange(
        timesCol,
        valuesCol,
        fillCol
      )
      threeTimePoints
        .concat(fourthTimePoint)
        .forEach(time => expect(cumulativeValues[time]).toBeTruthy())
      expect(Object.keys(cumulativeValues).length).toEqual(4)
    })
  })
})
