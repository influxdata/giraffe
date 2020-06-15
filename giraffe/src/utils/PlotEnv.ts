import {getHorizontalTicks, getVerticalTicks} from './getTicks'
import {getMargins} from './getMargins'
import {extentOfExtents} from './extrema'
import {identityMerge} from './identityMerge'
import {MemoizedFunctionCache} from './MemoizedFunctionCache'
import {timeFormatter} from './formatters'
import {getScale} from './getScale'
import {lineTransform} from '../transforms/line'
import {scatterTransform} from '../transforms/scatter'
import {histogramTransform} from '../transforms/histogram'
import {heatmapTransform} from '../transforms/heatmap'

import {
  DEFAULT_RANGE_PADDING,
  LAYER_DEFAULTS,
  CONFIG_DEFAULTS,
} from '../constants'

import {
  ColumnType,
  Formatter,
  LayerSpec,
  LayerTypes,
  LineLayerConfig,
  Margins,
  Scale,
  SizedConfig,
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

    const getTicksMemoized = this.fns.get('xTicks', getHorizontalTicks)

    return getTicksMemoized(
      this.xDomain,
      this.config.width,
      this.config.tickFont,
      this.xTickFormatter
    )
  }

  public get yTicks(): number[] {
    if (this.config.yTicks) {
      return this.config.yTicks
    }

    const getTicksMemoized = this.fns.get('yTicks', getVerticalTicks)

    return getTicksMemoized(
      this.yDomain,
      this.config.height,
      this.config.tickFont,
      this.yTickFormatter
    )
  }

  public get xScale(): Scale<number, number> {
    const getXScaleMemoized = this.fns.get(
      `xScale_${this.config.xScale}`,
      getScale(this.config.xScale)
    )
    const {xDomain, rangePadding, innerWidth} = this

    return getXScaleMemoized(
      xDomain[0],
      xDomain[1],
      rangePadding,
      innerWidth - rangePadding * 2
    )
  }

  public get yScale(): Scale<number, number> {
    const getYScaleMemoized = this.fns.get(
      `yScale_${this.config.yScale}`,
      getScale(this.config.yScale)
    )
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
    const spec = this.getSpec(0)
    if (!spec) {
      return DEFAULT_FORMATTER
    }
    const firstXMapping = spec.xColumnKey

    return this.getFormatterForColumn(firstXMapping)
  }

  public get yTickFormatter(): Formatter {
    const spec = this.getSpec(0)
    if (!spec) {
      return DEFAULT_FORMATTER
    }
    const firstYMapping = spec.yColumnKey

    return this.getFormatterForColumn(firstYMapping)
  }

  public getSpec(layerIndex: number): LayerSpec {
    const layerConfig = this.config.layers[layerIndex]
    const table = this.config.table

    const memoizedTransformKey = `${layerIndex}: ${layerConfig.type}`

    switch (layerConfig.type) {
      case LayerTypes.Line: {
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

      case LayerTypes.Scatter: {
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

      case LayerTypes.Histogram: {
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

      case LayerTypes.Heatmap: {
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

      case LayerTypes.Gauge:
      case LayerTypes.Custom:
      case LayerTypes.SingleStat:
        return null

      default:
        const unknownConfig = layerConfig
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
    config.layers.some((layer, layerIndex) => {
      if (layerIndex >= prevConfig.layers.length) {
        return false
      }
      return layer[aes] !== prevConfig.layers[layerIndex][aes]
    })
  )

  if (xyMappingsChanged) {
    return true
  }

  const binCountChanged = config.layers.some((layer: any, layerIndex) => {
    if (layerIndex >= prevConfig.layers.length) {
      return false
    }
    return layer.binCount !== (prevConfig.layers[layerIndex] as any).binCount
  })

  if (binCountChanged) {
    return true
  }

  return false
}
