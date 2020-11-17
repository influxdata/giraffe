import * as React from 'react'
import {storiesOf} from '@storybook/react'
import {withKnobs, number, select, text} from '@storybook/addon-knobs'
import {
  Config,
  GaugeMiniLayerConfig,
  InfluxColors,
  Plot,
} from '../../giraffe/src'

import {PlotContainer} from './helpers'
import {gaugeTable} from './data/gaugeLayer'
import {
  GAUGE_MINI_THEME_BULLET_DARK,
  GAUGE_MINI_THEME_PROGRESS_DARK,
} from '../../giraffe/src/constants/gaugeMiniStyles'

type Theme = Required<GaugeMiniLayerConfig>

const color = (() => {
  const colors = (() => {
    const obj = {}
    Object.keys(InfluxColors).forEach(x => (obj[x] = InfluxColors[x]))
    return obj
  })()

  // todo: type definitions
  return (label: string, ...rest: any[]) => select(label, colors, ...rest)
})()

const editableLayer = (theme: Theme): Theme => ({
  type: theme.type,
  mode: select(
    'Mode',
    {
      bullet: 'bullet',
      progress: 'progress',
    },
    theme.mode
  ),
  textMode: select(
    'textMode',
    {
      follow: 'follow',
      left: 'left',
    },
    theme.textMode
  ),

  valueHeight: number('valueHeight', theme.valueHeight),
  gaugeHeight: number('gaugeHeight', theme.gaugeHeight),
  valueRounding: number('valueRounding', theme.valueRounding),
  gaugeRounding: number('gaugeRounding', theme.gaugeRounding),
  barPaddings: number('barPaddings', theme.barPaddings),
  sidePaddings: number('gaugePaddingSides', theme.sidePaddings),

  // todo: add knobs
  gaugeColors: theme.gaugeColors,
  colorSecondary: color('colorSecondary', theme.colorSecondary),

  labelMain: text('labelMain', 'Gauge-mini example'),
  labelMainFontSize: number('labelMainFontSize', theme.labelMainFontSize),
  labelMainFontColor: color('labelMainFontColor', theme.labelMainFontColor),

  // todo: add knobs
  labelBars: theme.labelBars,
  labelBarsFontSize: number('labelBarsFontSize', theme.labelBarsFontSize),
  labelBarsFontColor: color('labelBarsFontColor', theme.labelBarsFontColor),

  valueFontSize: number('valueFontSize', theme.valueFontSize),
  valueFontColorInside: color(
    'valueFontColorInside',
    theme.valueFontColorInside
  ),
  valueFontColorOutside: color(
    'valueFontColorOutside',
    theme.valueFontColorOutside
  ),
  // todo: add knobs
  valueFormater: theme.valueFormater,

  axesSteps: select(
    'axesSteps',
    {
      thresholds: 'thresholds',
      0: 0,
      1: 1,
      2: 2,
      undefined: null,
    },
    theme.axesSteps
  ),
  axesFontSize: number('axesFontSize', theme.axesFontSize),
  axesFontColor: color('axesFontColor', theme.axesFontColor),
  // todo: add knobs
  axesFormater: theme.axesFormater,
})

const createStory = (theme: Theme) => () => {
  const config: Config = {
    table: gaugeTable(0, 100),
    layers: [editableLayer(theme)],
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
  .add('Bullet', createStory(GAUGE_MINI_THEME_BULLET_DARK))
  .add('Progress', createStory(GAUGE_MINI_THEME_PROGRESS_DARK))
