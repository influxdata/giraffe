// Types
import {GeoTable, MinAndMax} from './processing/GeoTable'
import {DashboardColor} from '../../types/geo'

// Utils
import {getMinAndMax} from './processing/GeoTable'

const DEFAULT_COLOR = '#1010FF'

interface Color {
  r: number
  g: number
  b: number
}

const FALLBACK_COLOR: Color = {r: 255, g: 0, b: 0}
const colorCache: {[color: string]: Color} = {}

const getColorThresholds = (
  c: DashboardColor[],
  value: number
): {low: DashboardColor; high: DashboardColor} => {
  for (let i = 0; i < c.length - 1; i++) {
    if (
      (c[i].type === 'min' || value >= c[i].value) &&
      (c[i + 1].type === 'max' || value <= c[i + 1].value)
    ) {
      return {low: c[i], high: c[i + 1]}
    }
  }
}

const getColorAsArray: (color: string) => Color = (color: string) => {
  const fromCache = colorCache[color]
  if (fromCache) {
    return fromCache
  }
  const match = color.match(/^#([0-9a-f]{6})$/i)[1]
  if (match) {
    const result = {
      r: parseInt(match.substr(0, 2), 16),
      g: parseInt(match.substr(2, 2), 16),
      b: parseInt(match.substr(4, 2), 16),
    }
    colorCache[color] = result
    return result
  }
  return FALLBACK_COLOR
}

const hex = (n: number) => n.toString(16).padStart(2, '0')
const toHexColor: (c: Color) => string = c => {
  return `#${hex(c.r)}${hex(c.g)}${hex(c.b)}`
}

const fitIntoDefinedRange = (
  value: number,
  low: DashboardColor,
  high: DashboardColor
) => {
  const bottomFitted =
    low.type === 'min' ? (value < low.value ? low.value : value) : value
  return high.type === 'max'
    ? bottomFitted > high.value
      ? high.value
      : bottomFitted
    : bottomFitted
}

const mixColors = (index: number, component1: number, component2: number) => {
  const c1 = Math.min(component1, component2)
  const c2 = Math.max(component1, component2)
  return Math.floor(c1 + index * (c2 - c1))
}

export const getColor = (
  color: DashboardColor[],
  value: number,
  interpolateColors: boolean
): string => {
  if (!color) {
    return DEFAULT_COLOR
  }
  if (value === undefined) {
    return color[0].hex
  }
  const {low, high} = getColorThresholds(color, value)
  if (!interpolateColors) {
    return value > high.value ? high.hex : low.hex
  }
  const fittedValue = fitIntoDefinedRange(value, low, high)
  const interpolationMin = low.value
  const interpolationMax = high.value
  const delta = interpolationMax - interpolationMin
  if (delta === 0) {
    return low.hex
  }
  const index = (fittedValue - interpolationMin) / delta
  const minColor = getColorAsArray(low.hex)
  const maxColor = getColorAsArray(high.hex)

  return toHexColor({
    r: mixColors(index, minColor.r, maxColor.r),
    g: mixColors(index, minColor.g, maxColor.g),
    b: mixColors(index, minColor.b, maxColor.b),
  })
}

export const calculateMinAndMax = (
  bounds: string[],
  table: GeoTable,
  fieldName: string
) => {
  return bounds &&
    bounds.length === 2 &&
    bounds[0] !== null &&
    bounds[1] !== null &&
    bounds[0] !== '' &&
    bounds[1] !== ''
    ? {
        min: Number(bounds[0]),
        max: Number(bounds[1]),
      }
    : getMinAndMax(table, fieldName)
}

export const normalizeValue = (
  range: MinAndMax,
  maxValue: number,
  value: number
): number => {
  if (range) {
    const {min, max} = range
    const delta = max - min
    if (delta === 0) {
      return maxValue / 2
    }
    const clampedValue = Math.min(max, Math.max(min, value))
    return (maxValue * (clampedValue - min)) / delta
  } else {
    return maxValue / 2
  }
}

export const nameOf = <T>(name: keyof T): string => String(name)
