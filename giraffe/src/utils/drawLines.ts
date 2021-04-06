import {line, curveLinear, area} from 'd3-shape'
import {range} from 'd3-array'

import {LineInterpolation, LineData} from '../types'
import {CURVES} from '../constants'
import {isDefined} from '../utils/isDefined'

interface DrawLinesOptions {
  context: CanvasRenderingContext2D
  interpolation: LineInterpolation
  lineData: LineData
  lineWidth: number
  shadeBelow: boolean
  shadeBelowOpacity: number
  shadeAboveY: number
}

export const drawLines = ({
  context,
  lineData,
  interpolation,
  lineWidth,
  shadeBelow,
  shadeBelowOpacity,
  shadeAboveY,
}: DrawLinesOptions): void => {
  if (shadeBelow) {
    for (const {xs, ys, fill} of Object.values(lineData)) {
      console.log('have linedata (jilla-2)', xs, ys, fill)
      console.log(
        'shade stuff.... (jilla-3)',
        shadeBelow,
        shadeAboveY,
        context,
        shadeBelowOpacity
      )
      const areaGenerator = area<number>()
        .y0(shadeAboveY)
        .y1((i: any) => ys[i])
        .x((i: any) => xs[i])
        .context(context)
        .defined((i: any) => isDefined(xs[i]) && isDefined(ys[i]))
        .curve(CURVES[interpolation] || curveLinear)

      context.fillStyle = fill
      context.globalAlpha = shadeBelowOpacity
      context.beginPath()
      areaGenerator(range(0, xs.length))
      context.fill()
    }
  }

  context.lineWidth = lineWidth
  context.globalAlpha = 1

  console.log('have linedata (jilla-1)', lineData)

  for (const {xs, ys, fill} of Object.values(lineData)) {
    // console.log('have (fill) linedata (jillb-2)', fill)
    // console.log('shade stuff.... (jillb-3)', shadeAboveY)
    // console.log('ack! context jillb-4', context)
    //console.log('rest.....jillb-5 (shade bewol opacity)', shadeBelowOpacity)

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
