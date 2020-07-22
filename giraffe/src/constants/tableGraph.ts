import {Color, TimeField} from '../types'

export const NULL_ARRAY_INDEX = -1

export const ASCENDING = 'asc'
export const DESCENDING = 'desc'
export const DEFAULT_SORT_DIRECTION = ASCENDING

export const DEFAULT_FIX_FIRST_COLUMN = true
export const DEFAULT_VERTICAL_TIME_AXIS = true

export const CELL_HORIZONTAL_PADDING = 30

export const DEFAULT_TIME_FIELD: TimeField = {
  internalName: '_time',
  displayName: 'time',
  visible: true,
}

export const DEFAULT_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss ZZ'

export const FORMAT_OPTIONS: Array<{text: string}> = [
  {text: DEFAULT_TIME_FORMAT},
  {text: 'DD/MM/YYYY HH:mm:ss.sss'},
  {text: 'MM/DD/YYYY HH:mm:ss.sss'},
  {text: 'YYYY/MM/DD HH:mm:ss'},
  {text: 'hh:mm a'},
  {text: 'HH:mm'},
  {text: 'HH:mm:ss'},
  {text: 'HH:mm:ss ZZ'},
  {text: 'HH:mm:ss.sss'},
  {text: 'MMMM D, YYYY HH:mm:ss'},
  {text: 'dddd, MMMM D, YYYY HH:mm:ss'},
]

export const DEFAULT_TABLE_COLORS = [
  {
    id: 'base',
    type: 'text',
    hex: '#ffffff',
    name: 'white',
    value: 0,
  } as Color,
]
