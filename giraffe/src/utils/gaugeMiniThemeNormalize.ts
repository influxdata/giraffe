import {FormatStatValueOptions, formatStatValue} from './formatStatValue'
import {
  GaugeMiniBarsDefinitions,
  GaugeMiniColors,
  GaugeMiniBarsDefinitionsArr,
} from '../types'
import {GaugeMiniLayerConfig} from '..'
import {color as d3Color} from 'd3-color'
import {range} from 'd3-array'

export const throwReturn = <T extends unknown>(msg: string): T => {
  throw new Error(msg)
}

type TBarsDefinitions = GaugeMiniBarsDefinitions<{[key: string]: true}>

type RestrictedTypesProperties = {
  barsDefinitions: TBarsDefinitions
  colors?: GaugeMiniColors
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

const isBarsDefinitionsArrayStyle = (
  barsDefinitions: GaugeMiniLayerConfig['barsDefinitions']
): barsDefinitions is GaugeMiniBarsDefinitionsArr => {
  return Array.isArray(barsDefinitions.groupByColumns)
}

const getBarsDefinitions = (
  barsDefinitions: GaugeMiniLayerConfig['barsDefinitions']
): TBarsDefinitions => {
  if (!isBarsDefinitionsArrayStyle(barsDefinitions)) {
    return barsDefinitions
  }

  const {groupByColumns, bars} = barsDefinitions

  return {
    groupByColumns: groupByColumns.reduce(
      (obj, prop) => ((obj[prop] = true), obj),
      {} as {[key: string]: true}
    ),
    bars: bars?.map(x => ({
      barDef: x.barDef.reduce(
        (obj, prop, i) => ((obj[prop] = groupByColumns[i]), obj),
        {} as Required<TBarsDefinitions>['bars'][number]['barDef']
      ),
      label: x.label,
    })),
  }
}

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

const getColors = (theme: Required<GaugeMiniLayerConfig>): GaugeMiniColors => {
  const {gaugeMiniColors: colors} = theme

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

// todo: more validations
export const gaugeMiniNormalizeTheme = (
  theme: Required<GaugeMiniLayerConfig>
): Required<GaugeMiniThemeNormalized> => {
  const colors = getColors(theme)
  return {
    ...theme,
    barsDefinitions: getBarsDefinitions(theme.barsDefinitions),
    colors,
    valueFormater: getFormater(theme.valueFormater),

    axesSteps: getAxesSteps(theme.axesSteps, colors),
    axesFormater: getFormater(theme.axesFormater),
  }
}

export const getGaugeMiniBarsDefinitions = getBarsDefinitions
