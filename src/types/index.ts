export type NumericColumnData =
  | number[]
  | Int8Array
  | Int16Array
  | Int32Array
  | Uint8Array
  | Uint16Array
  | Uint32Array
  | Float32Array
  | Float64Array

export type ColumnData = NumericColumnData | string[] | boolean[]

export type ColumnType = 'number' | 'string' | 'time' | 'boolean'

export interface GetColumn {
  (columnKey: string): ColumnData | null
  (columnKey: string, type: 'number'): NumericColumnData | null
  (columnKey: string, type: 'time'): NumericColumnData | null
  (columnKey: string, type: 'string'): string[] | null
  (columnKey: string, type: 'boolean'): boolean[] | null
}

export interface Table {
  getColumn: GetColumn
  getColumnName: (columnKey: string) => string
  getColumnType: (columnKey: string) => ColumnType
  columnKeys: string[]
  length: number
  addColumn: (
    columnKey: string,
    type: ColumnType,
    data: ColumnData,
    name?: string
  ) => Table
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
  key: string
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
  fill?: string[]
  colors?: string[]
  interpolation?: LineInterpolation
  hoverDimension?: LineHoverDimension | 'auto'
  lineWidth?: number
  maxTooltipRows?: number
  shadeBelow?: boolean
  shadeBelowOpacity?: number
}

export interface HeatmapLayerConfig {
  type: 'heatmap'
  x: string
  y: string
  colors?: string[]
  binSize?: number
  strokeWidth?: number
  strokePadding?: number
  strokeOpacity?: number
  fillOpacity?: number
}

export type HistogramPosition = 'overlaid' | 'stacked'

export interface HistogramLayerConfig {
  type: 'histogram'
  x: string
  fill?: string[]
  colors?: string[]
  position?: HistogramPosition
  binCount?: number
  strokeWidth?: number
  strokePadding?: number
  strokeOpacity?: number
  fillOpacity?: number
}

export type RectLayerConfig = HistogramLayerConfig | HeatmapLayerConfig

export type SymbolType =
  | 'circle'
  | 'triangle'
  | 'square'
  | 'plus'
  | 'tritip'
  | 'ex'

export interface ScatterLayerConfig {
  type: 'scatter'
  x: string
  y: string
  colors?: string[]
  fill?: string[]
  symbol?: string[]
}

export type LayerConfig =
  | LineLayerConfig
  | HistogramLayerConfig
  | HeatmapLayerConfig
  | ScatterLayerConfig

export enum FormatterType {
  Time = 'TIME',
  BinaryPrefix = 'BINARY_PREFIX',
  SIPrefix = 'SI_PREFIX',
}

export interface Formatter {
  // A `Formatter` takes a value in a `Table` and formats it as a
  // human-readable string
  (val: any, options?: object): string

  // The formatting of values in a plot affects our strategy for generating
  // nice axis tick marks. For example, if a user formats x values as times,
  // then a x axis tick at 2:00:00 PM would be nice, but a tick at 2:37:43 PM
  // would not be nice. A similar problem exists if a user is formatting values
  // with a [binary prefix][0]. As a library, we provide utilities to create
  // `Formatter`s for these common formatting scenarios. We tag the created
  // `Formatter`s with this property, so that we can recognize when they are
  // used and generate nicer ticks in those cases.
  //
  // [0]: https://en.wikipedia.org/wiki/Binary_prefix
  readonly _GIRAFFE_FORMATTER_TYPE?: FormatterType
}

export interface Config {
  table: Table
  layers: LayerConfig[]

  width?: number
  height?: number

  xAxisLabel?: string
  yAxisLabel?: string

  xTicks?: number[]
  yTicks?: number[]

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

  valueFormatters?: {
    [colKey: string]: Formatter
  }

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
  legendColumns?: string[]
}

export type SizedConfig = Config & {width: number; height: number}

export interface ColumnGroupMap {
  // The column keys that specify the grouping
  columnKeys: string[]

  // A group ID `i` takes on the values specified by `mappings[i]` for the
  // column keys that specify the grouping
  mappings: Array<{[columnKey: string]: any}>
}

export type LineData = {
  [groupID: number]: {
    xs: number[]
    ys: number[]
    fill: string
  }
}

export interface LineLayerSpec {
  type: 'line'
  inputTable: Table
  table: Table // has `FILL` column added
  lineData: LineData
  xDomain: number[]
  yDomain: number[]
  xColumnKey: string
  yColumnKey: string
  xColumnType: ColumnType
  yColumnType: ColumnType
  scales: {
    fill: Scale<number, string>
  }
  columnGroupMaps: {
    fill: ColumnGroupMap
  }
}

export interface ScatterLayerSpec {
  type: 'scatter'
  inputTable: Table
  table: Table // has `FILL` and `SYMBOL` columns added
  xDomain: number[]
  yDomain: number[]
  xColumnKey: string
  yColumnKey: string
  xColumnType: ColumnType
  yColumnType: ColumnType
  scales: {
    fill: Scale<number, string>
    symbol: Scale<number, SymbolType>
  }
  columnGroupMaps: {
    fill: ColumnGroupMap
    symbol: ColumnGroupMap
  }
}

export interface RectLayerSpec {
  type: 'rect'
  inputTable: Table
  table: Table // has `X_MIN`, `X_MAX`, `Y_MIN`, `Y_MAX`, and `COUNT` columns, and maybe a `FILL` column
  binDimension: 'xy' | 'x'
  xDomain: number[]
  yDomain: number[]
  xColumnKey: string
  yColumnKey: string
  xColumnType: ColumnType
  yColumnType: ColumnType
  scales: {fill: Scale<number, string>}
  columnGroupMaps: {fill?: ColumnGroupMap}
}

export interface LayerProps {
  xScale: Scale<number, number>
  yScale: Scale<number, number>
  width: number
  height: number
  spec: LayerSpec
  config: LayerConfig
  plotConfig: SizedConfig
  columnFormatter: (colKey: string) => (x: any) => string
  hoverX: number | null
  hoverY: number | null
}

/*
  When a user supplies a config for a layer, we derive various data from it:

  - If the layer implies a certain statistical transform or aggregate, we
    compute it. For example: a histogram layer needs to place data into bins,
    and count the number of observations within each bin.

  - Some layers support _group aesthetics_. These are aesthetics which multiple
    columns in the input table may be mapped to at once. In this case, we
    synthesize a new column in the table that contains a numeric group ID for
    each unique combination of values from these columns. We also record the
    values for each column that a particular group ID maps to, so that we can
    display those values in a legend.

  - For any data-to-aesthetic mapping, we create a scale function. The
    exception to this is for the `x` and `y` aesthetics; since multiple layers
    should use the same scale for `x` and `y` aesthetics, we do not generate
    those scales in a layer transform. Instead we record the `xDomain` and
    `yDomain` of the (transformed) data for the layer, so that some other
    entity may compute these scales.

  - We record the `xColumnType` and `yColumnType` for the layer, so that we can
    format x and y values from the layer approriately.

  We call the collection of this derived data a "spec".
*/
export type LayerSpec = LineLayerSpec | ScatterLayerSpec | RectLayerSpec

export enum ErrorName {
  UnknownColumnTypeError = 'UnknownColumnTypeError',
  SchemaMismatchError = 'SchemaMismatchError',
}
