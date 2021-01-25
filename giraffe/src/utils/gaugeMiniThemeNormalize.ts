import {useMemo} from 'react'
import {FormatStatValueOptions, formatStatValue} from './formatStatValue'
import {GaugeMiniColors} from '../types'
import {GaugeMiniLayerConfig} from '..'
import {color as d3Color} from 'd3-color'
import {range} from 'd3-array'

export const throwReturn = <T extends unknown>(msg: string): T => {
  throw new Error(msg)
}

type RestrictedTypesProperties = {
  colors?: GaugeMiniColors
  gaugeMiniColors?: GaugeMiniColors
  valueFormater?: (value: number) => string

  axesSteps: undefined | number[]
  axesFormater?: (value: number) => string
}

export type GaugeMiniThemeNormalized = Omit<
  GaugeMiniLayerConfig,
  keyof RestrictedTypesProperties
> &
  RestrictedTypesProperties

const getFormater = (
  formater: ((value: number) => string) | FormatStatValueOptions
): ((value: number) => string) =>
  typeof formater === 'function'
    ? formater
    : (value: number) => formatStatValue(value, formater)

const getAxesSteps = (
  axesSteps: number | 'thresholds' | undefined | number[],
  colors: GaugeMiniColors
): number[] | undefined => {
  if (axesSteps === undefined || axesSteps === null) {
    return undefined
  }
  const {
    max: {value: max},
    min: {value: min},
  } = colors

  if (Array.isArray(axesSteps)) {
    const steps = axesSteps.filter(x => x > min || x < max)
    if (axesSteps.length !== steps.length) {
      console.error(`All axes values must be inside range of colors!`)
    }
    return steps
  }

  if (axesSteps === 'thresholds') {
    return (colors.thresholds ?? []).map(x => x.value)
  }

  if (Number.isInteger(axesSteps)) {
    const colorLen = max - min

    return range(axesSteps).map(
      x => ((x + 1) * colorLen) / (axesSteps + 1) + min
    )
  }

  throw new Error(
    `AxesSteps must be number | "thresholds" | number[]` +
      ` | undefined. But it's value is ${JSON.stringify(axesSteps)}`
  )
}

const getColors = (
  colors: Required<GaugeMiniLayerConfig>['gaugeMiniColors']
): GaugeMiniColors => {
  if (!Array.isArray(colors)) {
    return {
      ...colors,
      thresholds: (colors.thresholds ?? []).sort(
        ({value: a}, {value: b}) => a - b
      ),
    }
  }

  colors.forEach(
    ({hex, name}) =>
      d3Color(hex) ??
      throwReturn(`Object "${hex}" isn"t valid color for name:${name}`)
  )

  return {
    min:
      colors.find(x => x.type === 'min') ??
      throwReturn('color of type min must be defined'),
    max:
      colors.find(x => x.type === 'max') ??
      throwReturn('color of type max must be defined'),
    thresholds: colors
      .filter(({type}) => type === 'threshold')
      .sort(({value: a}, {value: b}) => a - b),
  }
}

export const gaugeMiniNormalizeThemeMemoized = (
  theme: Required<GaugeMiniLayerConfig>
): Required<GaugeMiniThemeNormalized> => {
  const colors = useMemo(() => getColors(theme.gaugeMiniColors), [
    theme.gaugeMiniColors,
  ])

  const axesSteps = useMemo(() => getAxesSteps(theme.axesSteps, colors), [
    theme.axesSteps,
    colors,
  ])

  return {
    ...theme,
    colors,
    gaugeMiniColors: colors,
    valueFormater: getFormater(theme.valueFormater),

    axesSteps,
    axesFormater: getFormater(theme.axesFormater),
  }
}
