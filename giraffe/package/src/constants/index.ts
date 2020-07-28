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

import {Config, LayerConfig, SymbolType} from '../types'
import {NINETEEN_EIGHTY_FOUR as DEFAULT_COLOR_SCHEME} from './colorSchemes'

// TODO: Make configurable
export const TICK_PADDING_RIGHT = 8
export const TICK_PADDING_TOP = 8
export const AXIS_LABEL_PADDING_BOTTOM = 15
export const DEFAULT_RANGE_PADDING = 0 // pixels

export const SCATTER_POINT_SIZE = 6
export const SCATTER_HOVER_POINT_SIZE = 12

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

export const CONFIG_DEFAULTS: Partial<Config> = {
  layers: [],
  valueFormatters: {},
  xAxisLabel: '',
  yAxisLabel: '',
  xScale: 'linear',
  yScale: 'linear',
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
    maxTooltipRows: 24,
    shadeBelow: false,
    shadeBelowOpacity: 0.1,
  },
  heatmap: {
    colors: DEFAULT_COLOR_SCHEME,
    binSize: 10,
    strokeWidth: 0,
    strokePadding: 0,
    strokeOpacity: 0,
    fillOpacity: 1,
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
    strokeWidth: 1,
    strokePadding: 0.75,
    strokeOpacity: 1,
    fillOpacity: 0.75,
  },
  mosaic: {
    fill: [],
    colors: DEFAULT_COLOR_SCHEME,
    position: 'stacked',
    binCount: null,
    strokeWidth: 1,
    strokePadding: 0.75,
    strokeOpacity: 1,
    fillOpacity: 0.75,
  },
}

export const ALL_SYMBOL_TYPES: SymbolType[] = [
  'circle',
  'plus',
  'triangle',
  'square',
  'tritip',
  'ex',
]
