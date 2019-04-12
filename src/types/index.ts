export type ColumnType = 'int' | 'uint' | 'float' | 'string' | 'time' | 'bool'

export type NumericColumnType = 'int' | 'uint' | 'float' | 'time'

export interface FloatColumn {
  data: number[]
  type: 'float'
}

export interface IntColumn {
  data: number[]
  type: 'int'
}

export interface UIntColumn {
  data: number[]
  type: 'uint'
}

export interface TimeColumn {
  data: number[]
  type: 'time'
}

export interface StringColumn {
  data: string[]
  type: 'string'
}

export interface BoolColumn {
  data: boolean[]
  type: 'bool'
}

export type NumericTableColumn =
  | FloatColumn
  | IntColumn
  | UIntColumn
  | TimeColumn

export type TableColumn =
  | FloatColumn
  | IntColumn
  | UIntColumn
  | TimeColumn
  | StringColumn
  | BoolColumn

export interface Table {
  length: number
  columns: {
    [columnName: string]: TableColumn
  }
}

export interface Scale<D = any, R = any> {
  (x: D): R
  invert?: (y: R) => D
}

export interface Margins {
  top: number
  right: number
  bottom: number
  left: number
}

export interface TooltipData {
  xMin?: number
  xMax?: number
  yMin?: number
  yMax?: number
  columns: Array<{
    name: string
    type: ColumnType
    values: any[]
    colors: Array<string | null>
  }>
}

export type LineInterpolation =
  | 'linear'
  | 'monotoneX'
  | 'monotoneY'
  | 'cubic'
  | 'step'
  | 'stepBefore'
  | 'stepAfter'
  | 'natural'

export interface LineLayerConfig {
  type: 'line'
  x: string
  y: string
  fill: string[]
  colors: string[]
  interpolation: LineInterpolation
}

export interface LineScales {
  fill: Scale<string, string>
}

export interface HistogramTable extends Table {
  columns: {
    xMin: NumericTableColumn
    xMax: NumericTableColumn
    yMin: IntColumn
    yMax: IntColumn
    [fillColumn: string]: TableColumn
  }
  length: number
}

export interface HeatmapTable extends Table {
  columns: {
    xMin: NumericTableColumn
    xMax: NumericTableColumn
    yMin: NumericTableColumn
    yMax: NumericTableColumn
    count: IntColumn
  }
  length: number
}

export interface HeatmapLayerConfig {
  type: 'heatmap'
  x: string
  y: string
  colors: string[]
}

export interface HeatmapScales {
  fill: Scale<number, string>
}

export interface HistogramScales {
  fill: Scale<string, string>
}

export type Scales = LineScales | HistogramScales | HeatmapScales

export type LayerConfig =
  | LineLayerConfig
  | HistogramLayerConfig
  | HeatmapLayerConfig

export type HistogramPosition = 'overlaid' | 'stacked'

export interface HistogramLayerConfig {
  type: 'histogram'
  x: string
  fill: string[]
  colors: string[]
  position?: HistogramPosition
  binCount?: number
}

export interface Config {
  table: Table
  layers: LayerConfig[]

  width?: number
  height?: number

  xAxisLabel?: string
  yAxisLabel?: string

  // The x domain of the plot can be explicitly set. If this option is passed,
  // then the component is operating in a "controlled" mode, where it always
  // uses the passed x domain. Any brush interaction with the plot that should
  // change the x domain will call the `onSetXDomain` option when the component
  // is in controlled mode. Double clicking the plot will call
  // `onResetXDomain`. If the `xDomain` option is not passed, then the
  // component is "uncontrolled". It will compute, set, and reset the `xDomain`
  // automatically.
  xDomain?: number[]
  onSetXDomain?: (xDomain: number[]) => void
  onResetXDomain?: () => void

  // See the `xDomain`, `onSetXDomain`, and `onResetXDomain` options
  yDomain?: number[]
  onSetYDomain?: (yDomain: number[]) => void
  onResetYDomain?: () => void

  xTickFormatter?: (tickValue: number) => string
  yTickFormatter?: (tickValue: number) => string

  axisColor?: string
  axisOpacity?: number
  gridColor?: string
  gridOpacity?: number

  tickFont?: string
  tickFontColor?: string

  legendFont?: string
  legendFontColor?: string
  legendFontBrightColor?: string
  legendBackgroundColor?: string
  legendBorder?: string
  legendCrosshairColor?: string
}

export type SizedConfig = Config & {width: number; height: number}
