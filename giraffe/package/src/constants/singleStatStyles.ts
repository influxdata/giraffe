import CSS from 'csstype'

export const LASER = '#00C9FF'

export const SINGLE_STAT_DEFAULT_TEST_ID = 'giraffe-layer-single-stat'

export const SINGLE_STAT_DEFAULT_STYLE: CSS.Properties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  width: '100%',
  height: '100%',
  padding: '8px',
  color: LASER,
  userSelect: 'none',
  MozUserSelect: 'none',
  WebkitUserSelect: 'none',
  msUserSelect: 'none',
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  borderRadius: '4px',
}

export const SINGLE_STAT_RESIZER_DEFAULT_STYLE: CSS.Properties = {
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

export const SINGLE_STAT_SVG_TEXT_DEFAULT_STYLE: CSS.Properties = {
  fill: LASER,
}
