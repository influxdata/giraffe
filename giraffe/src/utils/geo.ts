import {GeoViewLayer} from '..'

// Constants
export const ZOOM_FRACTION = 8

export const getMinZoom = (width: number): number => {
  // Math.max(Math.log2(width/256)),Math.log2(height/256))
  // while the formula above would be technically correct, problem is that
  // web map projection is square (as opposed to regular book based world maps).
  // The polar areas are extremely distorted and people don't
  // want to look at those - they usually want to see all the continents and
  // expect to see a rectangle, similar to book based maps.
  return Math.ceil(Math.log2(width / 256) * ZOOM_FRACTION) / ZOOM_FRACTION
}

export const getRowLimit = (layers: GeoViewLayer[]) => {
  return Math.min.apply(
    null,
    layers.map(l => {
      switch (l.type) {
        case 'circleMap':
          return 5000
        case 'heatmap':
          return 100000
        case 'pointMap':
          return 2000
        case 'trackMap':
          return 2000
      }
    })
  )
}
