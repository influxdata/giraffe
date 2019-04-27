import {SymbolType} from 'd3-shape'

export type ColumnType = 'int' | 'uint' | 'float' | 'string' | 'time' | 'bool'

export type NumericColumnType = 'int' | 'uint' | 'float' | 'time'

export interface FloatColumn {
  data: number[]
  type: 'float'
  name: string
}

export interface IntColumn {
  data: number[]
  type: 'int'
  name: string
}

export interface UIntColumn {
  data: number[]
  type: 'uint'
  name: string
}

export interface TimeColumn {
  data: number[]
  type: 'time'
  name: string
}

export interface StringColumn {
  data: string[]
  type: 'string'
  name: string
}

export interface BoolColumn {
  data: boolean[]
  type: 'bool'
  name: string
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
    [columnKey: string]: TableColumn
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

export interface TooltipColumn {
  name: string
  type: ColumnType
  values: string[]
  colors: string[] | null
}

export type TooltipData = TooltipColumn[]

export type LineInterpolation =
  | 'linear'
  | 'monotoneX'
  | 'monotoneY'
  | 'cubic'
  | 'step'
  | 'stepBefore'
  | 'stepAfter'
  | 'natural'

/*
  The tooltip for a line layer can operate in one of three modes:

  In the `x` mode, every y-value for the currently hovered x-value is displayed
  in the tooltip. The crosshair is a vertical line.

  In the `y` mode, every x-value for the currently hovered y-value is displayed
  in the tooltip. The crosshair is a horizontal line.

  In the `xy` mode, the single xy-point closest to the hovered mouse position
  is displayed in the tooltip. The series that it belongs to is highlighted.
  The crosshair is an intersecting pair of horizontal and vertical lines.
*/
export type LineHoverDimension = 'x' | 'y' | 'xy'

export interface LineLayerConfig {
  type: 'line'
  x: string
  y: string
  fill: string[]
  colors: string[]
  interpolation: LineInterpolation
  hoverDimension?: LineHoverDimension | 'auto'
  lineWidth?: number
}

export interface LineMappings {
  x: string
  y: string
  fill: string[]
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

export interface HeatmapMappings {
  xMin: 'xMin'
  xMax: 'xMax'
  yMin: 'yMin'
  yMax: 'yMax'
  fill: 'count'
}

export interface HistogramMappings {
  xMin: 'xMin'
  xMax: 'xMax'
  yMin: 'yMin'
  yMax: 'yMax'
  fill: string[]
}

export interface HistogramScales {
  fill: Scale<string, string>
}

export interface ScatterLayerConfig {
  type: 'scatter'
  x: string
  y: string
  colors: string[]
  fill: string[]
  symbol: string[]
}

export interface ScatterMappings {
  x: string
  y: string
  fill: string[]
  symbol: string[]
}

export interface ScatterScales {
  fill: Scale<string, string>
  symbol: Scale<string, SymbolType>
}

export type Mappings =
  | LineMappings
  | HistogramMappings
  | HeatmapMappings
  | ScatterMappings

export type Scales =
  | LineScales
  | HistogramScales
  | HeatmapScales
  | ScatterScales

export type LayerConfig =
  | LineLayerConfig
  | HistogramLayerConfig
  | HeatmapLayerConfig
  | ScatterLayerConfig

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

  showAxes?: boolean

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
