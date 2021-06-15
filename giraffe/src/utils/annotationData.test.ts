import {sortDistances} from './annotationData'

describe('annotationData utils', () => {
  describe('sort distances; testing that the correct minimum is picked', () => {
    it('handles empty data', () => {
      const empty = []
      empty.sort(sortDistances)
      expect(empty).toEqual([])
    })
    it('picks the point annotation when a range and point annotation overlap when we are within the minimum overlapping distance', () => {
      const points = [
        {dist: 0, annoType: 'range'},
        {dist: 2.3, annoType: 'point'},
      ]
      const minimum = {dist: 2.3, annoType: 'point'}

      expect(points.sort(sortDistances)[0]).toEqual(minimum)
    })
    it('picks the point, with a range and point with same distance from the mouse', () => {
      const points = [
        {dist: 2.3, annoType: 'range'},
        {dist: 2.3, annoType: 'point'},
      ]
      const minimum = {dist: 2.3, annoType: 'point'}
      expect(points.sort(sortDistances)[0]).toEqual(minimum)
    })

    it('picks the range, with a close range and a far point; when the range is close enough to offset the weighting.', () => {
      const points = [
        {dist: 0, annoType: 'range'},
        {dist: 12.3, annoType: 'point'},
      ]
      const minimum = {dist: 0, annoType: 'range'}
      expect(points.sort(sortDistances)[0]).toEqual(minimum)
    })

    it('does a normal comparison on two ranges', () => {
      const points = [
        {dist: 5, annoType: 'range'},
        {dist: 0, annoType: 'range'},
      ]
      const minimum = {dist: 0, annoType: 'range'}
      expect(points.sort(sortDistances)[0]).toEqual(minimum)
    })

    it('does a normal comparison on two points', () => {
      const points = [
        {dist: 15, annoType: 'point'},
        {dist: 8, annoType: 'point'},
      ]
      const minimum = {dist: 8, annoType: 'point'}
      expect(points.sort(sortDistances)[0]).toEqual(minimum)
    })
  })
})
