import {line, curveLinear, area} from 'd3-shape'
import {range} from 'd3-array'

import {BandIndexMap, LineData, LineInterpolation} from '../types'
import {CURVES} from '../constants'
import {LOWER, UPPER} from '../constants/columnKeys'
import {isDefined} from '../utils/isDefined'

import {getBands} from '../transforms/band'

interface DrawBandsOptions {
  bandIndexMap: BandIndexMap
  context: CanvasRenderingContext2D
  interpolation: LineInterpolation
  lineData: LineData
  lineWidth: number
  lineOpacity: number
  shadeOpacity: number
}

export const drawBands = ({
  bandIndexMap,
  context,
  interpolation,
  lineData,
  lineWidth,
  lineOpacity,
  shadeOpacity,
}: DrawBandsOptions): void => {
  const bands = getBands(lineData, bandIndexMap)

  // draw shading
  for (const band of bands) {
    const lower = band[LOWER]
    const upper = band[UPPER]
    if (lower) {
      const {xs: xs_min, ys: ys_min} = lower
      const minAreaGenerator = area<number>()
        .y1((i: any) => band.ys[i])
        .y0((i: any) => ys_min[i])
        .x1((i: any) => band.xs[i])
        .x0((i: any) => xs_min[i])
        .context(context)
        .defined((i: any) => isDefined(xs_min[i]) && isDefined(ys_min[i]))
        .curve(CURVES[interpolation] || curveLinear)

      context.fillStyle = lower.fill
      context.globalAlpha = shadeOpacity
      context.beginPath()
      minAreaGenerator(range(0, xs_min.length))
      context.fill()
    }

    if (upper) {
      const {xs: xs_max, ys: ys_max} = upper
      const maxAreaGenerator = area<number>()
        .y1((i: any) => ys_max[i])
        .y0((i: any) => band.ys[i])
        .x1((i: any) => xs_max[i])
        .x0((i: any) => band.xs[i])
        .context(context)
        .defined((i: any) => isDefined(xs_max[i]) && isDefined(ys_max[i]))
        .curve(CURVES[interpolation] || curveLinear)

      context.fillStyle = upper.fill
      context.globalAlpha = shadeOpacity
      context.beginPath()
      maxAreaGenerator(range(0, xs_max.length))
      context.fill()
    }
  }

  context.lineWidth = lineWidth
  context.globalAlpha = lineOpacity

  // draw lines
  for (const {xs, ys, fill} of bands) {
    const lineGenerator = line<number>()
      .context(context)
      .y((i: any) => ys[i])
      .x((i: any) => xs[i])
      .context(context)
      .defined((i: any) => isDefined(xs[i]) && isDefined(ys[i]))
      .curve(CURVES[interpolation] || curveLinear)

    context.strokeStyle = fill
    context.beginPath()
    lineGenerator(range(0, xs.length))
    context.stroke()
  }
}
