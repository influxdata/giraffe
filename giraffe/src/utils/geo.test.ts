import {getMinZoom} from './geo'

describe('getMinZoom', () => {
  it('can return minimum zoom for viewing maps', () => {
    const width = 500
    const minimumZoom = getMinZoom(width)
    expect(minimumZoom).toBe(1)
  })
})
