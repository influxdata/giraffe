import {Color, GaugeMiniLayerConfig} from '../types'
import {InfluxColors} from './colorSchemes'

export const GAUGE_MINI_THEME_BULLET_DARK: Required<GaugeMiniLayerConfig> = {
  type: 'gauge mini',
  mode: 'bullet',
  textMode: 'follow',

  valueHeight: 18,
  gaugeHeight: 25,
  valueRounding: 2,
  gaugeRounding: 3,
  barPaddings: 5,
  sidePaddings: 20,

  gaugeColors: [
    {value: 0, type: 'min', hex: InfluxColors.Krypton},
    {value: 50, type: 'threshold', hex: InfluxColors.Sulfur},
    {value: 75, type: 'threshold', hex: InfluxColors.Topaz},
    {value: 100, type: 'max', hex: InfluxColors.Topaz},
  ] as Color[],
  colorSecondary: InfluxColors.Kevlar,

  labelMain: '',
  labelMainFontSize: 13,
  labelMainFontColor: InfluxColors.Ghost,

  labelBars: [],
  labelBarsFontSize: 11,
  labelBarsFontColor: InfluxColors.Forge,

  valueFontSize: 12,
  valueFontColorOutside: InfluxColors.Raven,
  valueFontColorInside: InfluxColors.Cloud,
  valueFormater: (val: number) => val.toFixed(0),

  axesSteps: 'thresholds',
  axesFontSize: 11,
  axesFontColor: InfluxColors.Forge,
  axesFormater: (val: number) => val.toFixed(0),
}

export const GAUGE_MINI_THEME_PROGRESS_DARK: Required<GaugeMiniLayerConfig> = {
  type: 'gauge mini',
  mode: 'progress',
  textMode: 'follow',

  valueHeight: 20,
  gaugeHeight: 20,
  valueRounding: 3,
  gaugeRounding: 3,
  barPaddings: 5,
  sidePaddings: 20,

  gaugeColors: [
    {value: 0, type: 'min', hex: InfluxColors.Krypton},
    {value: 100, type: 'max', hex: InfluxColors.Topaz},
  ] as Color[],
  colorSecondary: InfluxColors.Kevlar,

  labelMain: '',
  labelMainFontSize: 13,
  labelMainFontColor: InfluxColors.Ghost,

  labelBars: [],
  labelBarsFontSize: 11,
  labelBarsFontColor: InfluxColors.Forge,

  valueFontSize: 18,
  valueFontColorInside: InfluxColors.Raven,
  valueFontColorOutside: InfluxColors.Cloud,
  valueFormater: (val: number) => val.toFixed(0),

  axesSteps: undefined as any,
  axesFontSize: 11,
  axesFontColor: InfluxColors.Forge,
  axesFormater: (val: number) => val.toFixed(0),
}
