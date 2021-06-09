import {sortDistances} from './annotationData'

describe('annotationData utils', () => {
  describe('sort distances', () => {
    it('handles empty data', () => {
      const empty = []
      empty.sort(sortDistances)
      expect(empty).toEqual([])
    })
    it('a point annotation within the overlap range should be the minimum when there is an overlapping range annotation', () => {
      const points = [
        {dist: 0, annoType: 'range'},
        {dist: 2.3, annoType: 'point'},
      ]
      const minimum = {dist: 2.3, annoType: 'point'}

      expect(points.sort(sortDistances)[0]).toEqual(minimum)
    })
    it('a range and point with same distance, the point should be the minimum', () => {
      const points = [
        {dist: 2.3, annoType: 'range'},
        {dist: 2.3, annoType: 'point'},
      ]
      const minimum = {dist: 2.3, annoType: 'point'}
      expect(points.sort(sortDistances)[0]).toEqual(minimum)
    })

    it('a range and point with the range still being closer with the weighted distance', () => {
      const points = [
        {dist: 0, annoType: 'range'},
        {dist: 12.3, annoType: 'point'},
      ]
      const minimum = {dist: 0, annoType: 'range'}
      expect(points.sort(sortDistances)[0]).toEqual(minimum)
    })

    it('two ranges, normal comparison', () => {
      const points = [
        {dist: 5, annoType: 'range'},
        {dist: 0, annoType: 'range'},
      ]
      const minimum = {dist: 0, annoType: 'range'}
      expect(points.sort(sortDistances)[0]).toEqual(minimum)
    })

    it('two points, normal comparison', () => {
      const points = [
        {dist: 15, annoType: 'point'},
        {dist: 8, annoType: 'point'},
      ]
      const minimum = {dist: 8, annoType: 'point'}
      expect(points.sort(sortDistances)[0]).toEqual(minimum)
    })
  })
})
