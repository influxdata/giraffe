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

export interface Margins {
  top: number
  right: number
  bottom: number
  left: number
}

export interface HistogramMappings {
  xMin: 'xMin'
  xMax: 'xMax'
  yMin: 'yMin'
  yMax: 'yMax'
  fill: string[]
}

export interface HistogramScales {
  // x and y scale are from the `BaseLayer`
  fill: Scale<number, string>
}

export type Mappings = HistogramMappings

export type Scales = HistogramScales

export type LayerConfig = HistogramLayerConfig

export interface HistogramTooltipProps {
  xMin: number
  xMax: number
  counts: Array<{
    grouping: {[colName: string]: any}
    count: number
    color: string
  }>
}

export interface HistogramLayerConfig {
  type: 'histogram'
  x: string
  fill: string[]
  colors: string[]
  position?: 'overlaid' | 'stacked'
  binCount?: number
  tooltip?: (props: HistogramTooltipProps) => JSX.Element
}

export interface Config {
  table: Table
  layers: LayerConfig[]

  width?: number
  height?: number

  axesStroke?: string
  tickFont?: string
  tickFill?: string
  xAxisLabel?: string
  yAxisLabel?: string

  // The x domain of the plot can be explicitly set. If this option is passed,
  // then the component is operating in a "controlled" mode, where it always
  // uses the passed x domain. Any interaction with the plot that should change
  // the x domain (clicking, brushing, etc.) will call the `onSetXDomain`
  // option when the component is in controlled mode. If the `xDomain` option
  // is not passed, then the component is "uncontrolled". It will compute and
  // set the `xDomain` automatically.
  xDomain?: number[]
  onSetXDomain?: (xDomain: number[]) => void

  // See the `xDomain` and `onSetXDomain` options
  yDomain?: number[]
  onSetYDomain?: (yDomain: number[]) => void
}

export type SizedConfig = Config & {width: number; height: number}
