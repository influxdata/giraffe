import {
  curveLinear,
  curveMonotoneY,
  curveMonotoneX,
  curveBasis,
  curveStep,
  curveStepAfter,
  curveStepBefore,
  curveNatural,
} from 'd3-shape'

import {Config, LayerConfig} from '../types'
import {NINETEEN_EIGHTY_FOUR as DEFAULT_COLOR_SCHEME} from './colorSchemes'

// TODO: Make configurable
export const TICK_PADDING_RIGHT = 8
export const TICK_PADDING_TOP = 8
export const AXIS_LABEL_PADDING_BOTTOM = 15

export const GROUP_COL_KEY = '_vis_group_keys'
export const FILL_COL_KEY = '_fill_group_keys'
export const SYMBOL_COL_KEY = '_symbol_group_keys'

export const CURVES = {
  linear: curveLinear,
  monotoneX: curveMonotoneX,
  monotoneY: curveMonotoneY,
  cubic: curveBasis,
  step: curveStep,
  stepBefore: curveStepBefore,
  stepAfter: curveStepAfter,
  natural: curveNatural,
}

export const MAX_TOOLTIP_ROWS = 8

export const CONFIG_DEFAULTS: Partial<Config> = {
  layers: [],
  valueFormatters: {},
  xAxisLabel: '',
  yAxisLabel: '',
  showAxes: true,
  axisColor: '#292933',
  axisOpacity: 1,
  gridColor: '#292933',
  gridOpacity: 1,
  tickFont: '10px sans-serif',
  tickFontColor: '#8e91a1',
  legendFont: '10px monospace',
  legendFontColor: '#8e91a1',
  legendFontBrightColor: '#c6cad3',
  legendBackgroundColor: '#1c1c21',
  legendBorder: '1px solid #202028',
  legendCrosshairColor: '#31313d',
}

export const LAYER_DEFAULTS: {[layerType: string]: Partial<LayerConfig>} = {
  line: {
    lineWidth: 1,
    hoverDimension: 'auto',
    fill: [],
    colors: DEFAULT_COLOR_SCHEME,
    interpolation: 'linear',
  },
  heatmap: {
    colors: DEFAULT_COLOR_SCHEME,
  },
  scatter: {
    colors: DEFAULT_COLOR_SCHEME,
    fill: [],
    symbol: [],
  },
  histogram: {
    fill: [],
    colors: DEFAULT_COLOR_SCHEME,
    position: 'stacked',
    binCount: null,
  },
}
