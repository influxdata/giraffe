import {newTableFromConfig} from './newTable'
import {getHorizontalTicks, getVerticalTicks} from './getTicks'
import {getMargins} from './getMargins'
import {extentOfExtents} from './extrema'
import {identityMerge} from './identityMerge'
import {MemoizedFunctionCache} from './MemoizedFunctionCache'
import {timeFormatter} from './formatters'
import {getScale} from './getScale'
import {lineTransform} from '../transforms/line'
import {bandTransform} from '../transforms/band'
import {scatterTransform} from '../transforms/scatter'
import {histogramTransform} from '../transforms/histogram'
import {heatmapTransform} from '../transforms/heatmap'
import {mosaicTransform} from '../transforms/mosaic'
import {annotationTransform} from '../transforms/annotation'

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

  constructor() {
    this.getFormatterForColumn = this.getFormatterForColumn.bind(this)
    this.resetDomains = this.resetDomains.bind(this)
  }

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

    const sampleYTicks = yTicks.length
      ? yTicks
      : getVerticalTicks(
          this.yDomain,
          this.config.height,
          this.config.tickFont,
          this.yTickFormatter,
          null,
          null,
          null
        )

    return getMarginsMemoized(
      this.config.showAxes,
      xAxisLabel,
      yAxisLabel,
      sampleYTicks,
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
      this.xTickFormatter,
      this.config.xTotalTicks,
      this.config.xTickStart,
      this.config.xTickStep
    )
  }

  public get yTicks(): Array<number | string> {
    const currLayerSpec = this.config.layers.map((_, i) => this.getSpec(i))[0]
    if (
      currLayerSpec &&
      currLayerSpec.type === 'mosaic' &&
      Array.isArray(currLayerSpec.yTicks)
    ) {
      return currLayerSpec.yTicks
    }
    if (this.config.yTicks) {
      return this.config.yTicks
    }
    const getTicksMemoized = this.fns.get('yTicks', getVerticalTicks)

    return getTicksMemoized(
      this.yDomain,
      this.config.height,
      this.config.tickFont,
      this.yTickFormatter,
      this.config.yTotalTicks,
      this.config.yTickStart,
      this.config.yTickStep
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

  public get yColumnType(): ColumnType {
    // added to allow the y-axis type to be a string
    // if there are multiple layers (ex. single stat + line graph),
    // it will pick the yColumnType of the 1st layer (so BEWARE)
    for (let i = 0; i < this.config.layers.length; i++) {
      const layer: any = this.config.layers[i]
      if (layer.yColumnType) {
        return layer.yColumnType
      }
    }

    return 'number'
  }

  public set yColumnType(columnType: ColumnType) {
    this.config.yColumnType = columnType
  }

  public get xDomain(): number[] {
    if (this.isXControlled && !this.config.setXDomainToDefault) {
      return this.config.xDomain
    }

    if (!this._xDomain) {
      this._xDomain = this.isXControlled
        ? this.config.xDomain
        : this.getXDomain()
    }

    return this._xDomain
  }

  public set xDomain(newXDomain: number[]) {
    if (this.isXControlled) {
      if (this.config.setXDomainToDefault === true) {
        this._xDomain = newXDomain
      }
      if (typeof this.config.onSetXDomain === 'function') {
        this.config.onSetXDomain(newXDomain)
      }
    } else {
      this._xDomain = newXDomain
    }
  }

  public get yDomain(): number[] {
    if (this.isYControlled && !this.config.setYDomainToDefault) {
      return this.config.yDomain
    }

    if (!this._yDomain) {
      this._yDomain = this.isYControlled
        ? this.config.yDomain
        : this.getYDomain()
    }

    return this._yDomain
  }

  public set yDomain(newYDomain: number[]) {
    if (this.isYControlled) {
      if (this.config.setYDomainToDefault === true) {
        this._yDomain = newYDomain
      }
      if (typeof this.config.onSetYDomain === 'function') {
        this.config.onSetYDomain(newYDomain)
      }
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
    if (spec.type === 'mosaic') {
      return this.getFormatterForColumn('_value')
    }

    const {yColumnKey} = spec

    return this.getFormatterForColumn(yColumnKey)
  }

  public getSpec(layerIndex: number): LayerSpec {
    const layerConfig = this.config.layers[layerIndex]

    if (!this.config.table) {
      this.config.table = newTableFromConfig(this.config)
    }
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

      case LayerTypes.Band: {
        const transform = this.fns.get(memoizedTransformKey, bandTransform)

        return transform(
          table,
          layerConfig.x,
          layerConfig.y,
          layerConfig.fill,
          layerConfig.colors,
          layerConfig.lowerColumnName,
          layerConfig.mainColumnName,
          layerConfig.upperColumnName
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

      case LayerTypes.Mosaic: {
        const transform = this.fns.get(memoizedTransformKey, mosaicTransform)

        return transform(
          table,
          layerConfig.x,
          layerConfig.y,
          layerConfig.yLabelColumns,
          layerConfig.yLabelColumnSeparator,
          this.config.xDomain,
          layerConfig.fill,
          layerConfig.colors
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
      case LayerTypes.Annotation: {
        const transform = this.fns.get(
          memoizedTransformKey,
          annotationTransform
        )

        return transform(
          table,
          layerConfig.annotations,
          layerConfig.x,
          layerConfig.y,
          layerConfig.fill
        )
      }

      case LayerTypes.RawFluxDataTable:
      case LayerTypes.Gauge:
      case LayerTypes.Geo:
      case LayerTypes.Custom:
      case LayerTypes.SingleStat:
      case LayerTypes.Table:
        return null

      default:
        const unknownConfig = layerConfig
        const unknownType = (unknownConfig as any).type

        throw new Error(
          `transform not implemented for layer of type "${unknownType}"`
        )
    }
  }

  public getFormatterForColumn(colKey: string): Formatter {
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

  public resetDomains(): void {
    if (this.isXControlled) {
      if (this.config.resetXDomainToDefault === true) {
        this._xDomain = this.config.xDomain
      }
      if (typeof this.config.onResetXDomain === 'function') {
        this.config.onResetXDomain()
      }
    } else {
      this._xDomain = this.getXDomain()
    }

    if (this.isYControlled) {
      if (this.config.resetYDomainToDefault === true) {
        this._yDomain = this.config.yDomain
      }
      if (typeof this.config.onResetYDomain === 'function') {
        this.config.onResetYDomain()
      }
    } else {
      this._yDomain = this.getYDomain()
    }
  }

  private get isXControlled() {
    return (
      this.config.xDomain &&
      (this.config.setXDomainToDefault || this.config.onSetXDomain) &&
      (this.config.resetXDomainToDefault || this.config.onResetXDomain)
    )
  }

  private get isYControlled() {
    return (
      this.config.yDomain &&
      (this.config.setYDomainToDefault || this.config.onSetYDomain) &&
      (this.config.resetYDomainToDefault || this.config.onResetYDomain)
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
      .map((_, i) => this.getSpec(i)?.table)
      .filter(table => !!table)
      .map(table => table.getColumnType(columnKey))
      .find(k => !!k)

    return derivedColumnType
  }

  private get rangePadding(): number {
    const specifiedLineWidths = this.config.layers.map(layer => {
      if (layer.type === 'line' || layer.type === 'band') {
        return layer.lineWidth ?? DEFAULT_RANGE_PADDING
      }
      return DEFAULT_RANGE_PADDING
    })

    return Math.max(...specifiedLineWidths)
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
