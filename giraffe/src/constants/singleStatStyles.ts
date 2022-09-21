import CSS from 'csstype'

export const LASER = '#00C9FF'

export const SINGLE_STAT_DEFAULT_TEST_ID = 'giraffe-layer-single-stat'

export const SINGLE_STAT_DEFAULT_STYLE: CSS.Properties = {
  alignItems: 'center',
  borderRadius: '4px',
  bottom: 0,
  color: LASER,
  cursor: 'text',
  display: 'flex',
  fontFamily: '"Proxima Nova", Helvetica, Arial, Tahoma, Verdana, sans-serif',
  height: '100%',
  justifyContent: 'center',
  left: 0,
  MozUserSelect: 'text',
  msUserSelect: 'text',
  overflow: 'hidden',
  padding: '8px',
  position: 'absolute',
  right: 0,
  top: 0,
  userSelect: 'text',
  WebkitUserSelect: 'text',
  width: '100%',
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
