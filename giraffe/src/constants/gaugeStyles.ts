import {Color, GaugeTheme} from '../types'
export const MIN_THRESHOLDS = 2

export const COLOR_TYPE_MIN = 'min'
export const COLOR_TYPE_MAX = 'max'
export const DEFAULT_VALUE_MIN = 0
export const DEFAULT_VALUE_MAX = 100

export const DEFAULT_GAUGE_COLORS = [
  {
    id: '0',
    type: COLOR_TYPE_MIN,
    hex: '#00C9FF',
    name: 'laser',
    value: DEFAULT_VALUE_MIN,
  } as Color,
  {
    id: '1',
    type: COLOR_TYPE_MAX,
    hex: '#9394FF',
    name: 'comet',
    value: DEFAULT_VALUE_MAX,
  } as Color,
]

export const GAUGE_THEME_LIGHT: GaugeTheme = {
  lineCount: 5,
  smallLineCount: 10,
  lineColor: '#d4d7dd',
  labelColor: '#676978',
  labelFontSize: 13,
  lineStrokeSmall: 1,
  lineStrokeLarge: 3,
  tickSizeSmall: 9,
  tickSizeLarge: 18,
  minFontSize: 22,
  minLineWidth: 24,
  valueColor: '#545667',
  valuePositionYOffset: 0.5,
  valuePositionXOffset: 0,
  needleColor0: '#8e91a1',
  needleColor1: '#434453',

  // This constant expresses how far past the gauge max the needle should be
  // drawn if the value for the needle is greater than the gauge max. It is
  // expressed as a percentage of the circumference of a circle, e.g. 0.5 means
  // draw halfway around the gauge from the max value
  overflowDelta: 0.03,
}

export const GAUGE_THEME_DARK: GaugeTheme = {
  lineCount: 5,
  smallLineCount: 10,
  lineColor: '#545667',
  labelColor: '#8e91a1',
  labelFontSize: 13,
  lineStrokeSmall: 1,
  lineStrokeLarge: 3,
  tickSizeSmall: 9,
  tickSizeLarge: 18,
  minFontSize: 22,
  minLineWidth: 24,
  valueColor: '#ffffff',
  valuePositionYOffset: 0.5,
  valuePositionXOffset: 0,
  needleColor0: '#434453',
  needleColor1: `#ffffff`,

  // This constant expresses how far past the gauge max the needle should be
  // drawn if the value for the needle is greater than the gauge max. It is
  // expressed as a percentage of the circumference of a circle, e.g. 0.5 means
  // draw halfway around the gauge from the max value
  overflowDelta: 0.03,
}
