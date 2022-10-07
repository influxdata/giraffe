import {CSSProperties} from 'react'
export const LASER = '#00C9FF'

export const SINGLE_STAT_DEFAULT_TEST_ID = 'giraffe-layer-single-stat'

export const SINGLE_STAT_RESIZER_DEFAULT_STYLE: CSSProperties = {
  overflow: 'hidden',
  width: '100%',
  height: '100%',
}

export const SINGLE_STAT_SVG_DEFAULT_ATTRIBUTES = {
  width: '100%',
  height: '100%',
}

export const SINGLE_STAT_SVG_TEXT_DEFAULT_ATTRIBUTES = {
  fontSize: '100',
  y: '59%',
  x: '50%',
  dominantBaseline: 'middle',
  textAnchor: 'middle',
  opacity: 1,
}

export const SINGLE_STAT_SVG_TEXT_DEFAULT_STYLE: CSSProperties = {
  fill: LASER,
}

export const SINGLE_STAT_SVG_NO_USER_SELECT: CSSProperties = {
  MozUserSelect: 'none',
  WebkitTouchCallout: 'none',
  WebkitUserSelect: 'none',
  msUserSelect: 'none',
  userSelect: 'none',
}
