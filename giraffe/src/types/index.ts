import CSS from 'csstype'
import {CSSProperties, ReactNode} from 'react'
import {TimeZone} from './timeZones'
import {GeoLayerConfig} from './geo'

export interface PlotDimensions {
  height: number
  width: number
}

export type SizedConfig = Config & {width: number; height: number}
export interface Config {
  width?: number
  height?: number

  interactionHandlers?: InteractionHandlers

  gridColor?: string
  gridOpacity?: number

  cursor?: string

  showAxes?: boolean
  axisColor?: string
  axisOpacity?: number

  // Tick placement on the axes can be specified otherwise they are calculated,
  //   - specified for an entire axis, or
  //   - specified by a step interval per tick and/or a total number of ticks
  xTicks?: number[]
  xTickStart?: number
  xTickStep?: number
  xTotalTicks?: number
  yTicks?: Array<number | string>
  yTickStart?: number
  yTickStep?: number
  yTotalTicks?: number

  // Ticks can have font, color, and be formatted for precision and labeling
  tickFont?: string
  tickFontColor?: string
  valueFormatters?: {
    [colKey: string]: Formatter
  }

  // The labels on the axes
  xAxisLabel?: string
  yAxisLabel?: string

  // The scaling of the axes, usually linear or logarithmic
  xScale?: string
  yScale?: string

  table?: Table
  fluxResponse?: string
  layers: LayerConfig[]

  // The x domain of the plot can be explicitly set when `xDomain` is passed,
  // along with `includeXDomainZoom`, or `onSetXDomain` and `onResetXDomain`,
  // or `includeXDomainZoom` with any of the other two.
  // This is known as "controlled" mode, where it always uses the passed x domain
  //   - Any brush interaction with the plot that should change the x domain
  //     will use the built-in brush handler if `includeXDomainZoom` is true,
  //     and call `onSetXDomain` if provided.
  //   - Double clicking the plot will use the built-in reset handler if
  //     `includeXDomainZoom` is true, and call `onResetXDomain` if provided.
  //
  // When the `xDomain` option is not passed, then the
  // component is "uncontrolled". It will compute, set, and reset the `xDomain`
  // automatically.
  xDomain?: number[]
  includeXDomainZoom?: boolean
  onSetXDomain?: (xDomain: number[]) => void
  onResetXDomain?: () => void

  // Similar to xDomain above
  yDomain?: number[]
  includeYDomainZoom?: boolean
  onSetYDomain?: (yDomain: number[]) => void
  onResetYDomain?: () => void

  // legend properties apply to both the static legend and the tooltip
  legendBackgroundColor?: string
  legendBorder?: string
  legendColorizeRows?: boolean
  legendColumns?: string[]
  legendCrosshairColor?: string
  legendFont?: string
  legendFontBrightColor?: string
  legendFontColor?: string
  legendHide?: boolean
  legendMessage?: string
  legendOpacity?: number
  legendOrientationThreshold?: number

  // applies only to the static legend, overrides "legend" properties above
  staticLegend?: StaticLegend

  // The type of the y-axis column
  yColumnType?: ColumnType
}

export type LegendType = 'tooltip' | 'static'

export enum LegendPropertyNames {
  backgroundColor = 'legendBackgroundColor',
  border = 'legendBorder',
  colorizeRows = 'legendColorizeRows',
  columns = 'legendColumns',
  crosshairColor = 'legendCrosshairColor',
  font = 'legendFont',
  fontBrightColor = 'legendFontBrightColor',
  fontColor = 'legendFontColor',
  hide = 'legendHide',
  message = 'legendMessage',
  opacity = 'legendOpacity',
  orientationThreshold = 'legendOrientationThreshold',
}

export interface StaticLegend {
  backgroundColor?: string
  border?: string
  colorizeRows?: boolean
  columns?: string[]
  crosshairColor?: string
  cursor?: string // no corresponding legend property, unique to static legend
  font?: string
  fontBrightColor?: string
  fontColor?: string
  heightRatio?: number // no corresponding legend property, unique to static legend
  hide?: boolean
  layer?: number // no corresponding legend property, unique to static legend
  message?: string
  opacity?: number
  orientationThreshold?: number
  renderEffect?: (options: StaticLegendRenderEffectOptions) => void // no corresponding legend property, unique to static legend
  style?: CSSProperties // no correspinding legend property, unique to static legend
  valueAxis?: 'x' | 'y' // no corresponding legend property, unique to static legend
  widthRatio?: number // no corresponding legend property, unique to static legend
}

export interface StaticLegendRenderEffectOptions {
  totalHeight: number
  staticLegendHeight: number
  legendDataLength: number
  lineCount: number
  lineSpacingRatio: number
  padding: number
  headerTextMetrics: TextMetrics
  sampleTextMetrics: TextMetrics
}

export interface InteractionHandlerArguments {
  clampedValueX: number
  hoverX: number
  hoverY: number
  valueX: number | string
  valueY: number | string
  xDomain: number[]
  yDomain: number[]
  resetDomains: () => void
}

export interface InteractionHandlers {
  doubleClick?: (plotInteraction: InteractionHandlerArguments) => void
  singleClick?: (plotInteraction: InteractionHandlerArguments) => void
  singleShiftClick?: (plotInteraction: InteractionHandlerArguments) => void
  hover?: (plotInteraction: InteractionHandlerArguments) => void
  onXBrush?: (beginning: number | string, end: number | string) => void
}

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

export interface Table {
  getColumn: GetColumn
  getColumnName: (columnKey: string) => string | null // null if the column is not available
  getColumnType: (columnKey: string) => ColumnType | null // null if the column is not available
  getOriginalColumnType: (columnKey: string) => FluxDataType | null // null if the column is not available
  columnKeys: string[]
  length: number
  addColumn: (
    columnKey: string,
    fluxDataType: FluxDataType,
    type: ColumnType,
    data: ColumnData,
    name?: string
  ) => Table
}

export interface GetColumn {
  (columnKey: string): ColumnData | null
  (columnKey: string, type: 'number'): NumericColumnData | null
  (columnKey: string, type: 'time'): NumericColumnData | null
  (columnKey: string, type: 'string'): string[] | null
  (columnKey: string, type: 'boolean'): boolean[] | null
}

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

export type FluxDataType =
  | 'boolean'
  | 'unsignedLong'
  | 'long'
  | 'double'
  | 'string'
  | 'dateTime:RFC3339'
  | 'system'

export enum LayerTypes {
  RawFluxDataTable = 'flux data table',
  Gauge = 'gauge',
  Custom = 'custom',
  Annotation = 'annotation',
  SingleStat = 'single stat',
  Heatmap = 'heatmap',
  Histogram = 'histogram',
  Line = 'line',
  Band = 'band',
  Scatter = 'scatter',
  Mosaic = 'mosaic',
  Table = 'table',
  Geo = 'geo',
  SimpleTable = 'simple table',
}

export type LayerConfig =
  | CustomLayerConfig
  | AnnotationLayerConfig
  | RawFluxDataTableLayerConfig
  | GaugeLayerConfig
  | SingleStatLayerConfig
  | HeatmapLayerConfig
  | HistogramLayerConfig
  | LineLayerConfig
  | BandLayerConfig
  | ScatterLayerConfig
  | MosaicLayerConfig
  | TableGraphLayerConfig
  | GeoLayerConfig
  | SimpleTableLayerConfig

export interface CustomLayerConfig {
  type: 'custom' // do not refactor or restrict to LayerTypes.Custom
  render: (p: CustomLayerRenderProps) => JSX.Element
}

export interface AnnotationLayerConfig {
  type: 'annotation'
  x: string
  y: string
  annotations: AnnotationMark[]
  fill: string[]
  hoverDimension?: LineHoverDimension | 'auto'
  hoverMargin?: number
  svgAttributes?: SVGAttributes
  svgStyle?: CSS.Properties
  lineWidth?: number
  handleAnnotationClick?: (id: string) => void
}

export interface CustomLayerRenderProps {
  key: string | number
  xScale: Scale<number, number>
  yScale: Scale<number, number>
  xDomain: number[]
  yDomain: number[]
  width: number
  height: number
  innerWidth: number
  innerHeight: number
  yColumnType: ColumnType
  columnFormatter: (colKey: string) => (x: any) => string
}

export interface RawFluxDataTableLayerConfig {
  type: 'flux data table' // do not refactor or restrict to LayerTypes.RawFluxDataTable
  files: string[]
  width: number
  height: number
  disableVerticalScrolling?: boolean
  parseObjects?: boolean
}

export interface GaugeLayerConfig {
  type: 'gauge' // do not refactor or restrict to LayerTypes.Gauge
  prefix?: string
  suffix?: string
  tickPrefix?: string
  tickSuffix?: string
  decimalPlaces?: DecimalPlaces
  gaugeColors: Color[]
  gaugeSize?: number
  gaugeTheme?: Partial<GaugeTheme>
}

export interface GaugeTheme {
  lineCount: number
  smallLineCount: number
  lineColor: string
  labelColor: string
  labelFontSize: number
  lineStrokeSmall: number
  lineStrokeLarge: number
  tickSizeSmall: number
  tickSizeLarge: number
  minFontSize: number
  minLineWidth: number
  valueColor: string
  valuePositionXOffset: number
  valuePositionYOffset: number
  needleColor0: string
  needleColor1: string
  overflowDelta: number
}

export interface SingleStatLayerConfig {
  type: 'single stat' // do not refactor or restrict to LayerTypes.SingleStat
  prefix: string
  suffix: string
  decimalPlaces: DecimalPlaces
  textColor: string
  textOpacity?: number
  backgroundColor?: string
  testID?: string
  style?: CSS.Properties
  resizerStyle?: CSS.Properties
  svgAttributes?: SVGAttributes
  svgStyle?: CSS.Properties
  svgTextAttributes?: SVGAttributes
  svgTextStyle?: CSS.Properties
}

export type SVGAttributeFunction = (stat: string) => string

export interface SVGAttributes {
  [attributeName: string]: string | SVGAttributeFunction
}

export interface HeatmapLayerConfig {
  type: 'heatmap' // do not refactor or restrict to LayerTypes.Heatmap
  x: string
  y: string
  binSize?: number
  colors?: string[]
  fillOpacity?: number
  strokeOpacity?: number
  strokeWidth?: number
  strokePadding?: number
}

export interface HistogramLayerConfig {
  type: 'histogram' // do not refactor or restrict to LayerTypes.Histogram
  x: string
  position?: HistogramPosition
  binCount?: number
  fill?: string[]
  colors?: string[]
  fillOpacity?: number
  strokeOpacity?: number
  strokeWidth?: number
  strokePadding?: number
}

export interface MosaicLayerConfig {
  type: 'mosaic' // do not refactor or restrict to LayerTypes.Mosaic
  x: string
  y: string[]
  yLabelColumns?: string[]
  yLabelColumnSeparator?: string
  fill: string[]
  hoverDimension?: MosaicHoverDimension | 'auto'
  colors?: string[]
  strokeWidth?: number
  strokePadding?: number
  strokeOpacity?: number
  fillOpacity?: number
}

export type RectLayerConfig = HeatmapLayerConfig | HistogramLayerConfig

export interface LineLayerConfig {
  type: 'line' // do not refactor or restrict to LayerTypes.Line
  x: string
  y: string
  fill?: string[]
  position?: LinePosition
  hoverDimension?: LineHoverDimension | 'auto'
  maxTooltipRows?: number
  interpolation?: LineInterpolation
  lineWidth?: number
  colors?: string[]
  shadeBelow?: boolean
  shadeBelowOpacity?: number
}

export interface BandLayerConfig {
  type: 'band' // do not refactor or restrict to LayerTypes.Line
  x: string
  y: string
  fill: string[]
  position?: LinePosition
  hoverDimension?: LineHoverDimension | 'auto'
  maxTooltipRows?: number
  interpolation?: LineInterpolation
  lineWidth?: number
  lineOpacity?: number
  colors?: string[]
  shadeOpacity?: number
  mainColumnName: string
  upperColumnName?: string
  lowerColumnName?: string
}

export interface ScatterLayerConfig {
  type: 'scatter' // do not refactor or restrict to LayerTypes.Scatter
  x: string
  y: string
  fill?: string[]
  colors?: string[]
  symbol?: string[]
}

export interface SimpleTableLayerConfig {
  type: 'simple table' // do not refactor or restrict to LayerTypes.SimpleTable
  showAll: boolean
  fluxResponse?: string
}

export interface TableGraphLayerConfig {
  type: 'table' // do not refactor or restrict to LayerTypes.Table
  tables?: FluxTable[]
  timeZone: TimeZone
  tableTheme?: Theme
  properties: TableViewProperties
}

export interface DashboardQuery {
  text?: string
  editMode?: QueryEditMode
  name?: string
  builderConfig?: BuilderConfig
}

export type QueryEditMode = 'builder' | 'advanced'

export interface BuilderConfig {
  buckets?: string[]
  tags?: BuilderTagsType[]
  functions?: BuilderFunctionsType[]
  aggregateWindow?: {
    period?: string
  }
}

export interface BuilderTagsType {
  key?: string
  values?: string[]
  aggregateFunctionType?: BuilderAggregateFunctionType
}

export type BuilderAggregateFunctionType = 'filter' | 'group'

export interface BuilderFunctionsType {
  name?: string
}

export interface RenamableField {
  readonly internalName?: string
  displayName?: string
  visible?: boolean
}

export * from './timeZones'

export type Theme = 'light' | 'dark'

export interface TableViewProperties {
  type?: string
  shape?: string
  note?: string
  showNoteWhenEmpty?: boolean
  queries?: DashboardQuery[]
  colors: Color[]
  tableOptions: {
    wrapping?: 'truncate' | 'wrap' | 'single-line'
    fixFirstColumn?: boolean
    verticalTimeAxis?: boolean
    sortBy?: RenamableField
  }
  fieldOptions: RenamableField[]
  timeFormat: string
  decimalPlaces: DecimalPlaces
}

export interface ColumnWidths {
  totalWidths: number
  widths: {[x: string]: number}
}

export interface TransformTableDataReturnType {
  transformedData: string[][]
  sortedTimeVals: string[]
  columnWidths: ColumnWidths
  resolvedRenamableFields: RenamableField[]
  sortOptions: SortOptions
}

export interface SortOptions {
  field: string
  direction: string
}

export interface TimeField {
  internalName: string
  displayName: string
  visible: boolean
}

export interface FluxTable {
  id: string
  name: string
  data: string[][]
  result: string
  groupKey: {
    [columnName: string]: string
  }
  dataTypes: {
    [columnName: string]: string
  }
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
export type LayerSpec =
  | AnnotationLayerSpec
  | LineLayerSpec
  | BandLayerSpec
  | ScatterLayerSpec
  | RectLayerSpec
  | MosaicLayerSpec

export enum SpecTypes {
  Annotation = 'annotation',
  Line = 'line',
  Band = 'band',
  Scatter = 'scatter',
  Rect = 'rect',
  Mosaic = 'mosaic',
  Table = 'table',
}

export interface AnnotationLayerSpec {
  type: 'annotation'
  table: Table
  annotationData: AnnotationMark[]
  xColumnKey: string
  yColumnKey: string
  xColumnType: ColumnType
  yColumnType: ColumnType
  xDomain: number[]
  yDomain: number[]
}

export interface MosaicLayerSpec {
  type: 'mosaic'
  inputTable: Table
  table: Table // has `X_MIN`, `X_MAX`, `Y_MIN`, `Y_MAX`, and `COUNT` columns, and maybe a `FILL` column
  xDomain: number[]
  yDomain: number[]
  xColumnKey: string
  xColumnType: ColumnType
  yColumnType: ColumnType
  yColumnsName: string
  scales: {fill: Scale<number, string>}
  columnGroupMaps: {
    fill: ColumnGroupMap
  }
  ySeries: Array<string>
  yTicks: Array<string>
}

export interface LineLayerSpec {
  type: 'line' // do not refactor or restrict to SpecTypes.Line
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
    latestIndices: LatestIndexMap
  }
  stackedDomainValueColumn?: NumericColumnData
}

export interface BandLayerSpec {
  type: 'band' // do not refactor or restrict to SpecTypes.Line
  bandLineMap: BandLineMap
  bandName: string
  upperColumnName: string
  lowerColumnName: string
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
    latestIndices: LatestIndexMap
  }
}

export interface ScatterLayerSpec {
  type: 'scatter' // do not refactor or restrict to SpecTypes.Scatter
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
  type: 'rect' // do not refactor or restrict to SpecTypes.Rect
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
  columnFormatter: (colKey: string) => (x: any) => string
  yColumnType: ColumnType
  config: LayerConfig
  plotConfig: SizedConfig
  spec: LayerSpec
  hoverX: number | null
  hoverY: number | null
  legendHide: boolean
  height: number
  width: number
  xScale: Scale<number, number>
  yScale: Scale<number, number>
}

export interface Scale<D = any, R = any> {
  (x: D): R
  invert?: (y: R) => D
}

export type ScaleFactory = (
  domainStart: number,
  domainStop: number,
  rangeStart: number,
  rangeStop: number
) => Scale<number, number>

export interface DecimalPlaces {
  isEnforced?: boolean
  digits?: number
}

export interface Margins {
  top: number
  right: number
  bottom: number
  left: number
}

export interface Color {
  id: string
  type: 'min' | 'max' | 'threshold' | 'scale' | 'text' | 'background'
  hex: string
  name: string
  value: number
}

export interface LegendColumn {
  key: string
  name: string
  type: ColumnType
  values: string[]
  colors: string[] | null
}

export type LegendData = LegendColumn[]

export interface TooltipPosition {
  x: number
  y: number
}

export interface AnnotationTooltipOptions {
  dimension: AnnotationDimension
  position: TooltipPosition
  xOffset: number
  yOffset: number
}

export interface AnnotationTooltipData {
  title: string
  description: string
  fontColor: string
  position: TooltipPosition
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

export type LinePosition = 'overlaid' | 'stacked'

export type HistogramPosition = 'overlaid' | 'stacked'

export type MosaicPosition = 'stacked'

export type MosaicHoverDimension = 'x' | 'y' | 'xy'

export type SymbolType =
  | 'circle'
  | 'triangle'
  | 'square'
  | 'plus'
  | 'tritip'
  | 'ex'

export interface ColumnGroupMap {
  // The column keys that specify the grouping
  columnKeys: string[]

  // A group ID `i` takes on the values specified by `mappings[i]` for the
  // column keys that specify the grouping
  mappings: Array<{[columnKey: string]: any}>
}

export interface LatestIndexMap {
  // each Column in a Table contains a single array even when there are multiple series
  //   for example, a line graph has multiple lines (series), but each Column has only one array
  // Static Legend needs to know where each line (series) ends, to render the "latest"
  //   - "latest" is the timestamp with the highest value in each line (series)
  //   - Keep a map of the highest timestamp's index for each series
  [columnKey: string]: number
}

export type LineData = {
  [groupID: number]: {
    xs: number[]
    ys: number[]
    fill: string
  }
}

export type CumulativeValuesByTime = {
  [time: number]: {
    [groupID: number]: number
  }
}

export enum ErrorName {
  UnknownColumnTypeError = 'UnknownColumnTypeError',
  SchemaMismatchError = 'SchemaMismatchError',
}

export enum DomainLabel {
  X = 'xs',
  Y = 'ys',
}

export interface TextMetrics {
  width: number
  height: number
}

export type AxisTicks = Date[] | number[]

export interface BandBorder {
  xs: Array<number>
  ys: Array<number>
  fill: string
}
export interface Band {
  lower?: BandBorder
  upper?: BandBorder
  xs: Array<number>
  ys: Array<number>
  fill: string
}

export interface BandLineMap {
  rowLines: number[]
  lowerLines: number[]
  upperLines: number[]
}

export interface StandardFunctionProps {
  id?: string
  style?: CSSProperties
  testID?: string
  children?: ReactNode
  className?: string
}

export type AnnotationDimension = 'x' | 'y'

export type AnnotationPinType = 'none' | 'circle' | 'start' | 'stop'
export interface AnnotationMark {
  title: string
  description: string
  color: string
  startValue: number
  stopValue: number
  dimension: AnnotationDimension
  pin: AnnotationPinType
  id?: string
}
