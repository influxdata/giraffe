import * as React from 'react'
import {storiesOf} from '@storybook/react'
import {withKnobs, number, select, boolean, text} from '@storybook/addon-knobs'
import {
  Config,
  GaugeMiniLayerConfig,
  InfluxColors,
  Plot,
} from '../../giraffe/src'

import {PlotContainer} from './helpers'
import {
  GAUGE_MINI_THEME_BULLET_DARK,
  GAUGE_MINI_THEME_PROGRESS_DARK,
} from '../../giraffe/src/constants/gaugeMiniStyles'
import {gaugeMiniTable} from './data/gaugeMiniLayer'
import {
  gaugeMiniNormalizeThemeMemoized,
  GaugeMiniThemeNormalized,
} from '../../giraffe/src/utils/gaugeMiniThemeNormalize'
import {range} from 'd3-array'
import {FormatStatValueOptions} from '../../giraffe/src/utils/formatStatValue'

type Theme = Required<GaugeMiniLayerConfig>
type ThemeNormalized = Required<GaugeMiniThemeNormalized>
type Color = ThemeNormalized['gaugeMiniColors']['min']

const color = (() => {
  const colors = (() => {
    const obj = {}
    Object.keys(InfluxColors).forEach(x => (obj[x] = InfluxColors[x]))
    return obj
  })()

  return (label: string, ...rest: any[]) => select(label, colors, ...rest)
})()

const randInt: {
  (max: number): number
  (min: number, max: number): number
} = (min: number, max?: number) => {
  if (max === undefined) {
    return Math.floor(Math.random() * min)
  }
  return min + Math.floor(Math.random() * (max - min))
}

const colorRandom = () => {
  const colors = Object.values(InfluxColors)
  return colors[randInt(colors.length)]
}

const colorHexValue = (
  label: string,
  colorDefault: Color,
  groupID: string,
  numberOptions: any = {}
): Color => {
  return {
    hex: color(label + ' - hex', colorDefault?.hex ?? '#888888', groupID),
    value: number(
      label + ' - value',
      colorDefault?.value ?? 50,
      numberOptions,
      groupID
    ),
  }
}

const formatStatValueOptions = (
  label: string,
  formDefault: FormatStatValueOptions,
  groupID: string
): FormatStatValueOptions => {
  const l = (sublabel: string) => label + ' - ' + sublabel
  return {
    decimalPlaces: {
      isEnforced: boolean(
        l('decimalPlaces - isEnforced'),
        formDefault?.decimalPlaces?.isEnforced ?? false,
        groupID
      ),
      digits: number(
        l('decimalPlaces - digits'),
        formDefault?.decimalPlaces?.digits ?? 2,
        {},
        groupID
      ),
    },
    prefix: text(l('prefix'), formDefault?.prefix, groupID),
    suffix: text(l('suffix'), formDefault?.suffix, groupID),
  }
}

const knobGroups = {
  basics: 'basics',
  sizing: 'sizing',
  colors: 'colors',
  labels: 'labels',
}

const editableLayer = (
  theme: ThemeNormalized
): Theme & {numberOfBars: number} => ({
  type: theme.type,
  mode: select(
    'Mode',
    {
      bullet: 'bullet',
      progress: 'progress',
    },
    theme.mode,
    knobGroups.basics
  ),
  textMode: select(
    'textMode',
    {
      follow: 'follow',
      left: 'left',
    },
    theme.textMode,
    knobGroups.basics
  ),
  numberOfBars: number('number of bars', 1, {}, knobGroups.basics),

  valueHeight: number('valueHeight', theme.valueHeight, {}, knobGroups.sizing),
  gaugeHeight: number('gaugeHeight', theme.gaugeHeight, {}, knobGroups.sizing),
  valueRounding: number(
    'valueRounding',
    theme.valueRounding,
    {},
    knobGroups.sizing
  ),
  gaugeRounding: number(
    'gaugeRounding',
    theme.gaugeRounding,
    {},
    knobGroups.sizing
  ),
  barPaddings: number('barPaddings', theme.barPaddings, {}, knobGroups.sizing),
  sidePaddings: number(
    'gaugePaddingSides',
    theme.sidePaddings,
    {},
    knobGroups.sizing
  ),
  oveflowFraction: number(
    'oveflowFraction',
    theme.oveflowFraction,
    {},
    knobGroups.sizing
  ),

  colorSecondary: color(
    'colorSecondary',
    theme.colorSecondary,
    knobGroups.colors
  ),
  gaugeMiniColors: (() => {
    const {thresholds} = theme.gaugeMiniColors
    const min = colorHexValue(
      'colorMin',
      theme.gaugeMiniColors.min,
      knobGroups.colors
    )
    const max = colorHexValue(
      'colorMax',
      theme.gaugeMiniColors.max,
      knobGroups.colors
    )

    const colors: Theme['gaugeMiniColors'] = {
      min,
      max,
      thresholds: (() => {
        const length = number(
          'thresholds number',
          thresholds.length,
          {},
          knobGroups.colors
        )

        return range(length).map(x =>
          colorHexValue(
            `threshold ${x}`,
            thresholds[x] || {
              hex: colorRandom(),
              value: randInt(min.value + 1, max.value),
            },
            knobGroups.colors,
            {
              range: true,
              min: min.value,
              max: max.value,
              step: 1,
            }
          )
        )
      })(),
    }
    return colors
  })(),

  labelMain: text('labelMain', 'Gauge-mini example', knobGroups.labels),
  labelMainFontSize: number(
    'labelMainFontSize',
    theme.labelMainFontSize,
    {},
    knobGroups.labels
  ),
  labelMainFontColor: color(
    'labelMainFontColor',
    theme.labelMainFontColor,
    knobGroups.labels
  ),

  labelBarsEnabled: boolean(
    'labelBarsEnabled',
    theme.labelBarsEnabled,
    knobGroups.labels
  ),
  labelBarsFontSize: number(
    'labelBarsFontSize',
    theme.labelBarsFontSize,
    {},
    knobGroups.labels
  ),
  labelBarsFontColor: color(
    'labelBarsFontColor',
    theme.labelBarsFontColor,
    knobGroups.labels
  ),

  valuePadding: number(
    'valuePadding',
    theme.valuePadding,
    {},
    knobGroups.labels
  ),
  valueFontSize: number(
    'valueFontSize',
    theme.valueFontSize,
    {},
    knobGroups.labels
  ),
  valueFontColorInside: color(
    'valueFontColorInside',
    theme.valueFontColorInside,
    knobGroups.labels
  ),
  valueFontColorOutside: color(
    'valueFontColorOutside',
    theme.valueFontColorOutside,
    knobGroups.labels
  ),
  valueFormater: formatStatValueOptions(
    'valueFormater',
    theme.valueFormater as any,
    knobGroups.labels
  ),

  axesSteps: select(
    'axesSteps',
    {
      thresholds: 'thresholds',
      0: 0,
      1: 1,
      2: 2,
      undefined: null,
    },
    'thresholds',
    knobGroups.basics
  ),
  axesFontSize: number(
    'axesFontSize',
    theme.axesFontSize,
    {},
    knobGroups.labels
  ),
  axesFontColor: color('axesFontColor', theme.axesFontColor, knobGroups.labels),
  axesFormater: formatStatValueOptions(
    'axesFormater',
    theme.axesFormater as any,
    knobGroups.labels
  ),
})

const Story: React.FC<{theme: Theme}> = ({theme}) => {
  const normalized = gaugeMiniNormalizeThemeMemoized(theme)
  const layer = editableLayer(normalized)

  const config: Config = {
    table: gaugeMiniTable(0, 100, layer.numberOfBars),
    layers: [layer],
  }
  return (
    <>
      <PlotContainer>
        <Plot config={config} />
      </PlotContainer>
    </>
  )
}

storiesOf('Gauge mini', module)
  .addDecorator(withKnobs)
  .add('Bullet', () => <Story theme={GAUGE_MINI_THEME_BULLET_DARK} />)
  .add('Progress', () => <Story theme={GAUGE_MINI_THEME_PROGRESS_DARK} />)
