import {getTicks} from './getTicks'
import {getTextMetrics} from './getTextMetrics'
import {getMargins} from './getMargins'
import {extentOfExtents} from './extrema'
import {identityMerge} from './identityMerge'
import {MemoizedFunctionCache} from './MemoizedFunctionCache'
import {timeFormatter} from './formatters'
import {getLinearScale} from './getLinearScale'
import {lineTransform} from '../transforms/line'
import {scatterTransform} from '../transforms/scatter'
import {worldmapTransform} from '../transforms/worldmap'
import {histogramTransform} from '../transforms/histogram'
import {heatmapTransform} from '../transforms/heatmap'

import {
  DEFAULT_RANGE_PADDING,
  LAYER_DEFAULTS,
  CONFIG_DEFAULTS,
} from '../constants'

import {
  SizedConfig,
  Margins,
  Scale,
  LineLayerConfig,
  LayerSpec,
  ColumnType,
  Formatter,
} from '../types'

const X_DOMAIN_AESTHETICS = ['x', 'xMin', 'xMax']
const Y_DOMAIN_AESTHETICS = ['y', 'yMin', 'yMax']
const DEFAULT_X_DOMAIN: [number, number] = [0, 1]
const DEFAULT_Y_DOMAIN: [number, number] = [0, 1]
const DEFAULT_FORMATTER = x => String(x)
const DEFAULT_TIME_FORMATTER = timeFormatter()

export class PlotEnv {
  private _config: SizedConfig | null = null
  private _xDomain: number[] | null = null
  private _yDomain: number[] | null = null
  private fns = new MemoizedFunctionCache()

  public get config(): SizedConfig | null {
    return this._config
  }

  public set config(config: SizedConfig) {
    const prevConfig = this._config

    this._config = mergeConfigs(config, prevConfig)

    if (areUncontrolledDomainsStale(this._config, prevConfig)) {
      this._xDomain = null
      this._yDomain = null
    }
  }

  public get margins(): Margins {
    const {
      yTicks,
      config: {xAxisLabel, yAxisLabel, tickFont},
    } = this

    const getMarginsMemoized = this.fns.get('margins', getMargins)

    return getMarginsMemoized(
      this.config.showAxes,
      xAxisLabel,
      yAxisLabel,
      yTicks,
      this.yTickFormatter,
      tickFont
    )
  }

  public get innerWidth(): number {
    const {width} = this.config
    const {margins} = this

    return width - margins.left - margins.right
  }

  public get innerHeight(): number {
    const {height} = this.config
    const {margins} = this

    return height - margins.top - margins.bottom
  }

  public get xTicks(): number[] {
    if (this.config.xTicks) {
      return this.config.xTicks
    }

    const getTicksMemoized = this.fns.get('xTicks', getTicks)

    return getTicksMemoized(
      this.xDomain,
      this.config.width,
      this.charMetrics.width,
      this.xTickFormatter
    )
  }

  public get yTicks(): number[] {
    if (this.config.yTicks) {
      return this.config.yTicks
    }

    const getTicksMemoized = this.fns.get('yTicks', getTicks)

    return getTicksMemoized(
      this.yDomain,
      this.config.height,
      this.charMetrics.height,
      this.yTickFormatter
    )
  }

  public get xScale(): Scale<number, number> {
    const getXScaleMemoized = this.fns.get('xScale', getLinearScale)
    const {xDomain, rangePadding, innerWidth} = this

    return getXScaleMemoized(
      xDomain[0],
      xDomain[1],
      rangePadding,
      innerWidth - rangePadding * 2
    )
  }

  public get yScale(): Scale<number, number> {
    const getYScaleMemoized = this.fns.get('yScale', getLinearScale)
    const {yDomain, rangePadding, innerHeight} = this

    return getYScaleMemoized(
      yDomain[0],
      yDomain[1],
      innerHeight - rangePadding * 2,
      rangePadding
    )
  }

  public get xDomain(): number[] {
    if (this.isXControlled) {
      return this.config.xDomain
    }

    if (!this._xDomain) {
      this._xDomain = this.getXDomain()
    }

    return this._xDomain
  }

  public set xDomain(newXDomain: number[]) {
    if (this.isXControlled) {
      this.config.onSetXDomain(newXDomain)
    } else {
      this._xDomain = newXDomain
    }
  }

  public get yDomain(): number[] {
    if (this.isYControlled) {
      return this.config.yDomain
    }

    if (!this._yDomain) {
      this._yDomain = this.getYDomain()
    }

    return this._yDomain
  }

  public set yDomain(newYDomain: number[]) {
    if (this.isYControlled) {
      this.config.onSetYDomain(newYDomain)
    } else {
      this._yDomain = newYDomain
    }
  }

  public get xTickFormatter(): Formatter {
    const firstXMapping = this.getSpec(0).xColumnKey

    return this.getFormatterForColumn(firstXMapping)
  }

  public get yTickFormatter(): Formatter {
    const firstYMapping = this.getSpec(0).yColumnKey

    return this.getFormatterForColumn(firstYMapping)
  }

  public getSpec(layerIndex: number): LayerSpec {
    const layerConfig = this.config.layers[layerIndex]
    const table = this.config.table

    const memoizedTransformKey = `${layerIndex}: ${layerConfig.type}`

    switch (layerConfig.type) {
      case 'line': {
        const transform = this.fns.get(memoizedTransformKey, lineTransform)

        return transform(
          table,
          layerConfig.x,
          layerConfig.y,
          layerConfig.fill,
          layerConfig.colors,
          layerConfig.position
        )
      }

      case 'scatter': {
        const transform = this.fns.get(memoizedTransformKey, scatterTransform)

        return transform(
          table,
          layerConfig.x,
          layerConfig.y,
          layerConfig.fill,
          layerConfig.symbol,
          layerConfig.colors
        )
      }

      case 'worldmap': {
        const transform = this.fns.get(memoizedTransformKey, worldmapTransform)

        return transform(
          table,
          layerConfig.x,
          layerConfig.y,
          layerConfig.fill,
          layerConfig.symbol,
          layerConfig.colors
        )
      }

      case 'histogram': {
        const transform = this.fns.get(memoizedTransformKey, histogramTransform)

        return transform(
          table,
          layerConfig.x,
          this.config.xDomain,
          layerConfig.colors,
          layerConfig.fill,
          layerConfig.binCount,
          layerConfig.position
        )
      }

      case 'heatmap': {
        const transform = this.fns.get(memoizedTransformKey, heatmapTransform)

        return transform(
          table,
          layerConfig.x,
          layerConfig.y,
          this.config.xDomain,
          this.config.yDomain,
          this.config.width,
          this.config.height,
          layerConfig.binSize,
          layerConfig.colors
        )
      }

      case 'custom':
        return null

      default:
        const unknownConfig: never = layerConfig
        const unknownType = (unknownConfig as any).type

        throw new Error(
          `transform not implemented for layer of type "${unknownType}"`
        )
    }
  }

  public getFormatterForColumn = (colKey: string): Formatter => {
    const preferredFormatter = this.config.valueFormatters[colKey]

    if (preferredFormatter) {
      return preferredFormatter
    }

    const colType = this.getColumnTypeByKey(colKey)

    switch (colType) {
      case 'time':
        return DEFAULT_TIME_FORMATTER
      default:
        return DEFAULT_FORMATTER
    }
  }

  public resetDomains = (): void => {
    if (this.isXControlled) {
      this.config.onResetXDomain()
    } else {
      this._xDomain = this.getXDomain()
    }

    if (this.isYControlled) {
      this.config.onResetYDomain()
    } else {
      this._yDomain = this.getYDomain()
    }
  }

  private get charMetrics() {
    const getTextMetricsMemoized = this.fns.get('charMetrics', getTextMetrics)

    // https://stackoverflow.com/questions/3949422/which-letter-of-the-english-alphabet-takes-up-most-pixels
    return getTextMetricsMemoized(this.config.tickFont, 'W')
  }

  private get isXControlled() {
    return (
      this.config.xDomain &&
      this.config.onSetXDomain &&
      this.config.onResetXDomain
    )
  }

  private get isYControlled() {
    return (
      this.config.yDomain &&
      this.config.onSetYDomain &&
      this.config.onResetYDomain
    )
  }

  private getXDomain() {
    return (
      extentOfExtents(
        ...this.config.layers
          .map((_, i) => this.getSpec(i))
          .filter(spec => spec && spec.xDomain)
          .map(spec => spec.xDomain)
      ) || DEFAULT_X_DOMAIN
    )
  }

  private getYDomain() {
    return (
      extentOfExtents(
        ...this.config.layers
          .map((_, i) => this.getSpec(i))
          .filter(spec => spec && spec.yDomain)
          .map(spec => spec.yDomain)
      ) || DEFAULT_Y_DOMAIN
    )
  }

  private getColumnTypeByKey(columnKey): ColumnType {
    const suppliedColumnType = this.config.table.getColumnType(columnKey)

    if (suppliedColumnType) {
      return suppliedColumnType
    }

    const derivedColumnType = this.config.layers
      .map((_, i) => this.getSpec(i).table)
      .filter(table => !!table)
      .map(table => table.getColumnType(columnKey))
      .find(k => !!k)

    return derivedColumnType
  }

  private get rangePadding(): number {
    const specifiedLineWidths = this.config.layers
      .filter(l => l.type === 'line')
      .map(l => (l as LineLayerConfig).lineWidth)

    return Math.max(DEFAULT_RANGE_PADDING, ...specifiedLineWidths)
  }
}

const applyLayerDefaults = (
  layers: SizedConfig['layers']
): SizedConfig['layers'] =>
  layers.map(layer =>
    LAYER_DEFAULTS[layer.type]
      ? {...LAYER_DEFAULTS[layer.type], ...layer}
      : layer
  )

const mergeConfigs = (
  config: SizedConfig,
  prevConfig: SizedConfig | null
): SizedConfig => ({
  ...identityMerge(prevConfig, {
    ...CONFIG_DEFAULTS,
    ...config,
    layers: applyLayerDefaults(config.layers),
    // Avoid passing the `table` to `identityMerge` since checking its identity
    // can be quite expensive if it is a large object
    table: null,
  }),
  table: config.table,
})

const areUncontrolledDomainsStale = (
  config: SizedConfig,
  prevConfig: SizedConfig
): boolean => {
  if (!prevConfig) {
    return true
  }

  if (config.table !== prevConfig.table) {
    return true
  }

  const xyMappingsChanged = [
    ...X_DOMAIN_AESTHETICS,
    ...Y_DOMAIN_AESTHETICS,
  ].some(aes =>
    config.layers.some(
      (layer, layerIndex) => layer[aes] !== prevConfig.layers[layerIndex][aes]
    )
  )

  if (xyMappingsChanged) {
    return true
  }

  const binCountChanged = config.layers.some(
    (layer: any, layerIndex) =>
      layer.binCount !== (prevConfig.layers[layerIndex] as any).binCount
  )

  if (binCountChanged) {
    return true
  }

  return false
}
