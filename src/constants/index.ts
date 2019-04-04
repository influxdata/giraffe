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

// TODO: Make configurable
export const PLOT_PADDING = 20
export const TICK_PADDING_RIGHT = 8
export const TICK_PADDING_TOP = 5
export const AXIS_LABEL_PADDING_BOTTOM = 15

// TODO: Measure text metrics instead
export const TICK_CHAR_WIDTH = 7
export const TICK_CHAR_HEIGHT = 10

export const GROUP_COL_KEY = '_vis_group_keys'

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
