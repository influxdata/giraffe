export const MAX_THRESHOLDS = 5
export const MIN_THRESHOLDS = 2

export const COLOR_TYPE_MIN = 'min'
export const DEFAULT_VALUE_MIN = 0
export const COLOR_TYPE_MAX = 'max'
export const DEFAULT_VALUE_MAX = 100
export const COLOR_TYPE_THRESHOLD = 'threshold'

export const THRESHOLD_TYPE_TEXT = 'text'
export const THRESHOLD_TYPE_BG = 'background'

export const BASE_THRESHOLD_ID = 'base'

export const THRESHOLD_COLORS = [
  {
    hex: '#BF3D5E',
    name: 'ruby',
  },
  {
    hex: '#DC4E58',
    name: 'fire',
  },
  {
    hex: '#F95F53',
    name: 'curacao',
  },
  {
    hex: '#F48D38',
    name: 'tiger',
  },
  {
    hex: '#FFB94A',
    name: 'pineapple',
  },
  {
    hex: '#FFD255',
    name: 'thunder',
  },
  {
    hex: '#7CE490',
    name: 'honeydew',
  },
  {
    hex: '#4ED8A0',
    name: 'rainforest',
  },
  {
    hex: '#32B08C',
    name: 'viridian',
  },
  {
    hex: '#4591ED',
    name: 'ocean',
  },
  {
    hex: '#22ADF6',
    name: 'pool',
  },
  {
    hex: '#00C9FF',
    name: 'laser',
  },
  {
    hex: '#513CC6',
    name: 'planet',
  },
  {
    hex: '#7A65F2',
    name: 'star',
  },
  {
    hex: '#9394FF',
    name: 'comet',
  },
  {
    hex: '#383846',
    name: 'pepper',
  },
  {
    hex: '#545667',
    name: 'graphite',
  },
  {
    hex: '#ffffff',
    name: 'white',
  },
  {
    hex: '#292933',
    name: 'castle',
  },
]

export const DEFAULT_GAUGE_COLORS = [
  {
    type: COLOR_TYPE_MIN,
    hex: THRESHOLD_COLORS[11].hex,
    id: '0',
    name: THRESHOLD_COLORS[11].name,
    value: DEFAULT_VALUE_MIN,
  },
  {
    type: COLOR_TYPE_MAX,
    hex: THRESHOLD_COLORS[14].hex,
    id: '1',
    name: THRESHOLD_COLORS[14].name,
    value: DEFAULT_VALUE_MAX,
  },
]

export const DEFAULT_THRESHOLDS_LIST_COLORS = [
  {
    type: THRESHOLD_TYPE_TEXT,
    hex: THRESHOLD_COLORS[11].hex,
    id: BASE_THRESHOLD_ID,
    name: THRESHOLD_COLORS[11].name,
    value: 0,
  },
]

export const DEFAULT_THRESHOLDS_TABLE_COLORS = [
  {
    type: THRESHOLD_TYPE_TEXT,
    hex: THRESHOLD_COLORS[17].hex,
    id: BASE_THRESHOLD_ID,
    name: THRESHOLD_COLORS[17].name,
    value: 0,
  },
]
